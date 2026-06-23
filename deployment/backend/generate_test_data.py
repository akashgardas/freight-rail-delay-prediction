import os
import numpy as np
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
os.makedirs(MODEL_DIR, exist_ok=True)

print("Generating synthetic test data...")
np.random.seed(123) # Use a different seed from training for a true test set
n_samples = 500

# Generate representative synthetic features
train_length = np.random.uniform(300, 1000, n_samples)
wagon_count = np.random.uniform(25, 90, n_samples).astype(int)
weight_per_wagon = np.random.uniform(40, 95, n_samples)
gross_weight = wagon_count * weight_per_wagon
weight_per_length = gross_weight / train_length
trip_distance = np.random.uniform(100, 1500, n_samples)
previous_delay = np.random.uniform(0, 120, n_samples)
departure_delay = np.random.uniform(0, 180, n_samples)

X = pd.DataFrame({
    "train_length": train_length,
    "gross_weight": gross_weight,
    "wagon_count": wagon_count,
    "weight_per_wagon": weight_per_wagon,
    "weight_per_length": weight_per_length,
    "trip_distance": trip_distance,
    "previous_delay": previous_delay,
    "departure_delay": departure_delay
})

# Underlying delay generation rule (same as training to ensure model predicts well)
y = (
    0.45 * departure_delay +
    0.25 * previous_delay +
    0.01 * trip_distance +
    0.002 * gross_weight +
    0.005 * train_length +
    np.random.normal(0, 5, n_samples)
)
# Delay cannot be less than zero
y = np.clip(y, 0, None)
y_df = pd.DataFrame({"delay_mins": y})

# Save to CSV
x_path = os.path.join(MODEL_DIR, "X_test.csv")
y_path = os.path.join(MODEL_DIR, "y_test.csv")

X.to_csv(x_path, index=False)
y_df.to_csv(y_path, index=False)

print(f"Saved {x_path}")
print(f"Saved {y_path}")
print("Test data generation complete.")
