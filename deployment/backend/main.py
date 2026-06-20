from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import random
from datetime import datetime, timedelta

from model_handler import model_handler, FEATURE_NAMES

app = FastAPI(
    title="CargoETA API",
    description="Backend microservice for Freight Rail Operations Delay Prediction and Explainability",
    version="1.0.0"
)

# Allow requests from frontend (standard Next.js ports 3000, 3001, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input Pydantic model
class PredictionInput(BaseModel):
    train_length: float = Field(..., ge=100.0, le=2000.0, description="Train length in meters")
    gross_weight: float = Field(..., ge=500.0, le=12000.0, description="Gross train weight in tonnes")
    wagon_count: int = Field(..., ge=5, le=150, description="Number of wagons in the freight train")
    weight_per_wagon: float = Field(..., ge=10.0, le=120.0, description="Average weight per wagon in tonnes")
    weight_per_length: float = Field(..., ge=1.0, le=20.0, description="Weight per length in tonnes/meter")
    trip_distance: float = Field(..., ge=10.0, le=3000.0, description="Trip distance in kilometers")
    previous_delay: float = Field(..., ge=0.0, le=600.0, description="Delay at previous checkpoint in minutes")
    departure_delay: float = Field(..., ge=0.0, le=600.0, description="Departure delay in minutes")
    route_name: str = Field("Berlin - Warsaw", description="Name of the freight corridor")

class PredictionResponse(BaseModel):
    predicted_delay: float
    confidence_score: float
    severity: str
    base_value: float
    contributions: List[Dict[str, Any]]
    global_importance: Dict[str, float]
    inputs: Dict[str, float]
    timestamp: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/predict", response_model=PredictionResponse)
def predict_delay(payload: PredictionInput):
    try:
        # Convert Pydantic payload to dictionary
        input_data = payload.dict()
        
        # Invoke predictions through our handler
        res = model_handler.predict(input_data)
        
        # Add timestamp
        res["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/analytics-summary")
def get_analytics_summary():
    """
    Returns high-fidelity analytics and performance metrics for the CargoETA Executive Dashboard
    and the Europe geographic heatmap components.
    """
    # European corridors performance statistics (equivalent of Indian Golden Quadrilateral layout but for EU)
    corridors = [
        {"corridor": "Berlin - Paris", "avg_delay": "14m 12s", "efficiency": 92, "traffic_load": 78.5, "trend": "down", "status": "OPTIMAL"},
        {"corridor": "Warsaw - Hamburg", "avg_delay": "08m 42s", "efficiency": 96, "traffic_load": 65.2, "trend": "down", "status": "OPTIMAL"},
        {"corridor": "Rotterdam - Genoa", "avg_delay": "38m 25s", "efficiency": 68, "traffic_load": 94.1, "trend": "up", "status": "MONITOR"},
        {"corridor": "Paris - Milan", "avg_delay": "11m 30s", "efficiency": 89, "traffic_load": 74.8, "trend": "stable", "status": "OPTIMAL"},
        {"corridor": "Vienna - Budapest", "avg_delay": "05m 15s", "efficiency": 98, "traffic_load": 42.0, "trend": "down", "status": "OPTIMAL"},
        {"corridor": "Munich - Verona", "avg_delay": "49m 10s", "efficiency": 48, "traffic_load": 99.2, "trend": "up", "status": "CONGESTED"}
    ]
    
    # Geographic node data representing European Railway hubs for the 3D Europe Map
    nodes = [
        {"id": "london", "name": "London", "lat": 51.5074, "lng": -0.1278, "status": "OPTIMAL", "load": 45, "delay": 2.5},
        {"id": "paris", "name": "Paris", "lat": 48.8566, "lng": 2.3522, "status": "OPTIMAL", "load": 72, "delay": 8.4},
        {"id": "brussels", "name": "Brussels", "lat": 50.8503, "lng": 4.3517, "status": "OPTIMAL", "load": 60, "delay": 4.1},
        {"id": "rotterdam", "name": "Rotterdam Hub", "lat": 51.9244, "lng": 4.4777, "status": "MONITOR", "load": 94, "delay": 32.5},
        {"id": "hamburg", "name": "Hamburg", "lat": 53.5511, "lng": 9.9937, "status": "OPTIMAL", "load": 65, "delay": 6.8},
        {"id": "berlin", "name": "Berlin Hub", "lat": 52.5200, "lng": 13.4050, "status": "OPTIMAL", "load": 78, "delay": 11.2},
        {"id": "warsaw", "name": "Warsaw Central", "lat": 52.2297, "lng": 21.0122, "status": "OPTIMAL", "load": 55, "delay": 5.4},
        {"id": "munich", "name": "Munich Junction", "lat": 48.1351, "lng": 11.5820, "status": "MONITOR", "load": 85, "delay": 21.0},
        {"id": "vienna", "name": "Vienna Central", "lat": 48.2082, "lng": 16.3738, "status": "OPTIMAL", "load": 40, "delay": 3.2},
        {"id": "milan", "name": "Milan Grid", "lat": 45.4642, "lng": 9.1900, "status": "OPTIMAL", "load": 62, "delay": 9.5},
        {"id": "rome", "name": "Rome Depot", "lat": 41.9028, "lng": 12.4964, "status": "OPTIMAL", "load": 50, "delay": 6.1},
        {"id": "madrid", "name": "Madrid Hub", "lat": 40.4168, "lng": -3.7038, "status": "OPTIMAL", "load": 48, "delay": 4.8}
    ]
    
    # Active routes mapping connecting nodes
    routes = [
        {"from": "london", "to": "brussels", "active_trains": 3, "avg_speed": 110, "status": "OPTIMAL"},
        {"from": "brussels", "to": "rotterdam", "active_trains": 5, "avg_speed": 85, "status": "MONITOR"},
        {"from": "rotterdam", "to": "hamburg", "active_trains": 4, "avg_speed": 95, "status": "OPTIMAL"},
        {"from": "hamburg", "to": "berlin", "active_trains": 6, "avg_speed": 105, "status": "OPTIMAL"},
        {"from": "berlin", "to": "warsaw", "active_trains": 3, "avg_speed": 98, "status": "OPTIMAL"},
        {"from": "paris", "to": "brussels", "active_trains": 4, "avg_speed": 115, "status": "OPTIMAL"},
        {"from": "paris", "to": "milan", "active_trains": 2, "avg_speed": 90, "status": "OPTIMAL"},
        {"from": "munich", "to": "vienna", "active_trains": 4, "avg_speed": 100, "status": "OPTIMAL"},
        {"from": "vienna", "to": "rome", "active_trains": 2, "avg_speed": 80, "status": "OPTIMAL"},
        {"from": "milan", "to": "rome", "active_trains": 5, "avg_speed": 112, "status": "OPTIMAL"},
        {"from": "paris", "to": "madrid", "active_trains": 3, "avg_speed": 105, "status": "OPTIMAL"}
    ]
    
    # Performance metric statistics (R2, RMSE, MAPE)
    metrics = {
        "total_predictions": 124802,
        "avg_delay_reduction_mins": 14.8,
        "punctuality_rate": 92.4,
        "delay_variance_mins": 2.1,
        "rmse": 4.25,
        "r2_score": 0.89,
        "mape": 8.7,  # Mean Absolute Percentage Error
        "network_efficiency_index": 88.5
    }
    
    # Delay Trends by month
    monthly_trends = [
        {"month": "Jan", "actual": 15.2, "predicted": 14.8},
        {"month": "Feb", "actual": 14.1, "predicted": 14.5},
        {"month": "Mar", "actual": 16.8, "predicted": 16.2},
        {"month": "Apr", "actual": 18.5, "predicted": 18.1},
        {"month": "May", "actual": 12.9, "predicted": 13.3},
        {"month": "Jun", "actual": 11.4, "predicted": 11.2},
        {"month": "Jul", "actual": 10.8, "predicted": 10.9},
        {"month": "Aug", "actual": 12.1, "predicted": 11.8},
        {"month": "Sep", "actual": 14.5, "predicted": 14.9},
        {"month": "Oct", "actual": 15.9, "predicted": 15.6},
        {"month": "Nov", "actual": 17.2, "predicted": 16.8},
        {"month": "Dec", "actual": 19.4, "predicted": 18.9}
    ]

    return {
        "corridors": corridors,
        "nodes": nodes,
        "routes": routes,
        "metrics": metrics,
        "monthly_trends": monthly_trends
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
