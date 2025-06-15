import pandas as pd
from prophet import Prophet
import pickle

# Load and preprocess data
df = pd.read_csv("training_expenses_f.csv")
df['date'] = pd.to_datetime(df['date'])  # Convert to datetime
daily = df.groupby(df['date'].dt.date)['amount'].sum().reset_index()

daily.columns = ['ds', 'y']

# Create and fit model
model = Prophet(weekly_seasonality=True, daily_seasonality=False)
model.fit(daily)

# Save model
with open('prophet_model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("Model trained and saved as prophet_model.pkl")