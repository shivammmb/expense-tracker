from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'sql12.freesqldatabase.com'
app.config['MYSQL_USER'] = 'sql12783047'
app.config['MYSQL_PASSWORD'] = 'QNHrJj6eFi'
app.config['MYSQL_DB'] = 'sql12783047'

CORS(app)
mysql = MySQL(app)

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    amount = data.get('amount')
    category = data.get('category')
    description = data.get('description')
    date = data.get('date')

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO expenses (amount, category, description, date) VALUES (%s, %s, %s, %s)",
        (amount, category, description, date)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Expense added!'})

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
