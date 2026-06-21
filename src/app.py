import streamlit as st
import pandas as pd
import joblib
import os

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Freight Rail Delay Predictor",
    page_icon="🚆",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- MODEL LOADING (CACHED) ---
@st.cache_resource
def load_models_and_scaler():
    """Loads all models and the scaler from the models directory."""
    # Get the absolute path to the models directory (parent of src)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(current_dir, '..', 'models')
    
    # Load models
    models = {
        "LightGBM": joblib.load(os.path.join(models_dir, 'lightGBM.joblib')),
        "Random Forest": joblib.load(os.path.join(models_dir, 'random_forest_regressor.joblib')),
        "Linear Regression": joblib.load(os.path.join(models_dir, 'linear_regression_model.joblib')),
        "KNN": joblib.load(os.path.join(models_dir, 'knn_regressor.joblib'))
    }
    
    # Load scaler
    scaler = joblib.load(os.path.join(models_dir, 'knn_scaler.joblib'))
    
    return models, scaler

# Load them into memory
try:
    models_dict, knn_scaler = load_models_and_scaler()
    models_loaded_successfully = True
except Exception as e:
    models_loaded_successfully = False
    st.error(f"Error loading models: {e}. Please ensure the models folder is structured correctly.")

# --- SIDEBAR: APP INFO & MODEL SELECTION ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2942/2942080.png", width=100)
    st.title("Settings & Info")
    
    st.markdown("### 🛠️ Model Selection")
    selected_model_name = st.selectbox(
        "Choose a predictive model:",
        ("LightGBM", "Random Forest", "Linear Regression", "KNN")
    )
    
    st.markdown("---")
    st.markdown("### 📖 About the Project")
    st.info(
        "This application predicts short-term arrival delays for freight trains. "
        "It utilizes machine learning models trained on historical operational, "
        "train, and network-level data to enhance supply chain reliability."
    )
    
    st.markdown("---")
    st.markdown("### 👨‍💻 Developed By")
    st.markdown("""
    **CVR College of Engineering** B.Tech CSE III Year II Semester  
    *Supervisor:* Mr. D. Chaithanya  
    
    **Team:**
    * Gardas Akash
    * Donthula Harika
    * Kasani Rishitha Srija
    """)

# --- MAIN PAGE: HEADER & DESCRIPTION ---
st.title("🚆 Short-Term Arrival Delay Predictor")
st.markdown("""
Welcome to the Freight Rail Delay Prediction System. Please enter the operational and structural details of the train journey below. 
The system will automatically calculate engineered weight features and predict the expected arrival delay time.
""")

# --- MAIN PAGE: INPUT FORM ---
st.markdown("### 📋 Input Journey Parameters")

with st.form("prediction_form"):
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**🚂 Train Composition**")
        teu_count = st.number_input("TEU Count (Max capacity)", min_value=0.0, value=64.0, step=1.0)
        train_length = st.number_input("Total Train Length (meters)", min_value=0.0, value=540.0, step=10.0)
        
    with col2:
        st.markdown("**🛤️ Trip Details**")
        total_distance_trip = st.number_input("Total Distance (km)", min_value=0.0, value=350.0, step=10.0)
        departure_delay_time = st.number_input("Departure Delay (minutes)", value=0.0, step=5.0)
        
    with col3:
        st.markdown("**⚖️ Weight Engineering Inputs**")
        total_weight_tonnes = st.number_input("Total Lot Weight (Tonnes)", min_value=0.0, value=1200.0, step=50.0)
        num_wagons = st.number_input("Number of Wagons", min_value=1, value=20, step=1)
        wagon_length = st.number_input("Avg. Length per Wagon (m)", min_value=1.0, value=18.0, step=1.0)

    st.markdown("---")
    submitted = st.form_submit_button("Predict Arrival Delay 🚀", use_container_width=True)

# --- BACKEND LOGIC & PREDICTION ---
if submitted and models_loaded_successfully:
    # 1. Feature Engineering
    # Adding a small check to prevent division by zero errors just in case
    if num_wagons > 0 and wagon_length > 0:
        weight_per_length = total_weight_tonnes / (wagon_length * num_wagons)
        weight_per_wagon = total_weight_tonnes / num_wagons
    else:
        weight_per_length = 0
        weight_per_wagon = 0
        
    # 2. Construct DataFrame (Order must match your training data exactly)
    input_data = pd.DataFrame({
        'teu_count': [teu_count],
        'train_length': [train_length],
        'total_distance_trip': [total_distance_trip],
        'departure_delay_time': [departure_delay_time],
        'weight_per_length': [weight_per_length],
        'weight_per_wagon': [weight_per_wagon]
    })
    
    # 3. Model Inference
    model = models_dict[selected_model_name]
    
    try:
        # Scale data if KNN or Linear Regression is selected (adjust based on your actual training pipeline)
        if selected_model_name in ["KNN"]:
            input_data_processed = knn_scaler.transform(input_data)
        else:
            input_data_processed = input_data
            
        # Predict
        prediction = model.predict(input_data_processed)[0]
        
        # 4. Display Results
        st.markdown("### 📊 Prediction Result")
        
        # Displaying the engineered features for transparency
        st.info(f"**Calculated Features:** Weight per length = **{weight_per_length:.2f} t/m** | Weight per wagon = **{weight_per_wagon:.2f} t/wagon**")
        
        # Displaying the final prediction
        if prediction <= 0:
             st.success(f"**Estimated Arrival Delay:** No Delay expected (Predicted: {prediction:.2f} minutes)")
        elif prediction < 30:
             st.warning(f"**Estimated Arrival Delay:** Minor delay of **{prediction:.2f} minutes**")
        else:
             st.error(f"**Estimated Arrival Delay:** Significant delay of **{prediction:.2f} minutes**")
             
    except Exception as e:
        st.error(f"An error occurred during prediction: {e}. Please check if the input features match what the model expects.")
