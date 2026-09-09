import pandas as pd

url = ("https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query="
       "select+pl_name,pl_bmasse,pl_rade,pl_orbper,pl_orbsmax,"
       "st_mass,st_rad,st_teff,st_met+from+pscomppars&format=csv")
df = pd.read_csv(url)
df.to_csv("data/raw/exoplanets.csv", index=False)
print(df.shape, df.columns.tolist())