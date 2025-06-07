from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime
import werkzeug.exceptions

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'sql12.freesqldatabase.com'
app.config['MYSQL_USER'] = 'sql12783047'
app.config['MYSQL_PASSWORD'] = 'QNHrJj6eFi'
app.config['MYSQL_DB'] = 'sql12783047'

CORS(app)
mysql = MySQL(app)

@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_400_error(e):
    return jsonify({'error': 'Bad Request', 'message': str(e)}), 400

@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_404_error(e):
    return jsonify({'error': 'Not Found', 'message': str(e)}), 404

@app.errorhandler(werkzeug.exceptions.InternalServerError)
def handle_500_error(e):
    return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    amount = data.get('amount')
    category = data.get('category')
    description = data.get('description')
    date = data.get('date')
    required_fields = ['amount', 'category', 'description', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO expenses (amount, category, description, date) VALUES (%s, %s, %s, %s)",
        (amount, category, description, date)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Expense added!'})

@app.route('/api/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, amount, category, description, date FROM expenses WHERE id = %s", (id,))
    row = cur.fetchone()
    cur.close()
    if row:
        expense = {
            'id': row[0],
            'amount': float(row[1]),
            'category': row[2],
            'description': row[3],
            'date': str(row[4])
        }
        return jsonify(expense)
    else:
        return jsonify({'error': 'Expense not found'}), 404

@app.route('/api/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(
        "UPDATE expenses SET amount=%s, category=%s, description=%s, date=%s WHERE id=%s",
        (data['amount'], data['category'], data['description'], data['date'], id)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Expense updated!'})

@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM expenses WHERE id = %s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Expense deleted!'})

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

if __name__ == '__main__':
    app.run(debug=True, port=3003)
