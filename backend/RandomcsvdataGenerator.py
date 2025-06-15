import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Generate date range for 2 years (2023-2024)
dates = [datetime(2023, 1, 1) + timedelta(days=i) for i in range(730)]
categories = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Education']

# Create synthetic data with patterns
data = []
for date in dates:
    for i in range(3):
    # Base pattern
        amount = np.random.normal(500, 200)
    
    # Weekend spending (Fri/Sat)
        if date.weekday() in [4, 5]:
            amount += np.random.normal(300, 100)
            category = 'Entertainment' if np.random.random() > 0.5 else 'Food'
        else:
            category = np.random.choice(categories)
        
        # Monthly bills pattern
        if date.day == 1:
            amount = np.random.normal(15000, 2000)
            category = 'Rent' if np.random.random() > 0.5 else 'Utilities'
        
        # Add some noise
        amount = abs(round(amount + np.random.normal(0, 150), 2))
        
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'amount': amount,
            'category': category,
            'description': f"Expense for {category} on {date.strftime('%d-%b')}"
        })

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('training_expenses_f.csv', index=False)
print("CSV file created: training_expenses.csv")
