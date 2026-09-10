from fastapi import APIRouter, HTTPException
from data.fetch_data import fetch_data
from data.clean_data import clean_and_engineer

router = APIRouter()

@router.post("/fetch-nasa-data")
def trigger_nasa_fetch():
    try:
        # 1. Fetch real-time observation data from NASA Caltech TAP API
        raw_df = fetch_data()
        
        # 2. Run data cleaning and feature engineering
        clean_df = clean_and_engineer()
        
        return {
            "status": "success",
            "raw_count": len(raw_df),
            "clean_count": len(clean_df),
            "message": f"Successfully pulled {len(raw_df):,} records ({len(clean_df):,} after cleaning) directly from NASA Exoplanet Archive!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from NASA: {str(e)}")
