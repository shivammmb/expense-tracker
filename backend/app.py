from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime
import pandas as pd
import werkzeug.exceptions
import pickle
import os

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'           
app.config['MYSQL_PASSWORD'] = 'SQLSbaheti101!'          
app.config['MYSQL_DB'] = 'expense_tracker'

CORS(app)
mysql = MySQL(app)

# Load ML model
model_path = os.path.join(os.path.dirname(__file__), 'prophet_model.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'training_expenses_f.csv')
        df = pd.read_csv(csv_path)
        categories = sorted(df['category'].dropna().unique().tolist())
        return jsonify(categories)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        date_str = data['date']
        category = data.get('category', None)
        
        cur = mysql.connection.cursor()
        if category:
            cur.execute("""
                SELECT DATE(date) AS ds, SUM(amount) AS y 
                FROM expenses 
                WHERE category = %s
                GROUP BY ds 
                ORDER BY ds
            """, (category,))
        else:
            cur.execute("""
                SELECT DATE(date) AS ds, SUM(amount) AS y 
                FROM expenses 
                GROUP BY ds 
                ORDER BY ds
            """)
        
        historical = pd.DataFrame(cur.fetchall(), columns=['ds', 'y'])
        cur.close()

        future = pd.DataFrame({'ds': [pd.to_datetime(date_str)]})
        forecast = model.predict(future)
        
        return jsonify({
            'date': date_str,
            'category': category,
            'predicted_amount': round(forecast['yhat'].values[0], 2)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, amount, category, description, date FROM expenses")
    rows = cur.fetchall()
    cur.close()
    
    expenses = []
    for row in rows:
        expenses.append({
            'id': row[0],
            'amount': float(row[1]),
            'category': row[2],
            'description': row[3],
            'date': str(row[4])
        })
    return jsonify(expenses)

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    required_fields = ['amount', 'category', 'description', 'date']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO expenses (amount, category, description, date) VALUES (%s, %s, %s, %s)",
            (data['amount'], data['category'], data['description'], data['date'])
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Expense added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.get_json()
    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "UPDATE expenses SET amount=%s, category=%s, description=%s, date=%s WHERE id=%s",
            (data['amount'], data['category'], data['description'], data['date'], id)
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Expense updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM expenses WHERE id = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Expense deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_400_error(e):
    return jsonify({'error': 'Bad Request', 'message': str(e)}), 400

@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_404_error(e):
    return jsonify({'error': 'Not Found', 'message': str(e)}), 404

@app.errorhandler(werkzeug.exceptions.InternalServerError)
def handle_500_error(e):
    return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003, debug=True)
