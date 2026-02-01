from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import math

app = FastAPI(title="HumSafar API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for rides
rides_db = []

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class RideCreate(BaseModel):
    driverName: str = "Anonymous Commuter"
    driverRating: float = 5.0
    driverImg: str = "https://ui-avatars.com/api/?background=10b981&color=fff"
    car: str = "Standard Sedan"
    start_location: Location
    end_location: Location
    route: str
    time: str
    cost: float
    seatsTotal: int

class Ride(RideCreate):
    id: str
    seatsLeft: int

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on the earth."""
    R = 6371  # Earth radius in kilometers
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.post("/rides", response_model=Ride)
async def create_ride(ride_in: RideCreate):
    ride = Ride(
        id=f"r_{uuid.uuid4().hex[:8]}",
        seatsLeft=ride_in.seatsTotal,
        **ride_in.dict()
    )
    rides_db.append(ride)
    return ride

@app.get("/rides", response_model=List[Ride])
async def get_rides():
    return rides_db

@app.get("/rides/match", response_model=List[Ride])
async def match_rides(
    lat: float = Query(..., description="User's current latitude"),
    lng: float = Query(..., description="User's current longitude"),
    radius_km: float = Query(5.0, description="Search radius in kilometers")
):
    """Find rides starting near the user's location (e.g., Chennai Central)."""
    matches = []
    for ride in rides_db:
        dist = haversine(lat, lng, ride.start_location.lat, ride.start_location.lng)
        if dist <= radius_km:
            matches.append(ride)
    
    # Sort by proximity
    matches.sort(key=lambda r: haversine(lat, lng, r.start_location.lat, r.start_location.lng))
    return matches

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)