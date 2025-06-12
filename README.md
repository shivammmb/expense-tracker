
# Expense Tracker

A full-stack Expense Tracker application built with **React** (frontend), **Flask** (backend), and **MySQL** (database).  
Easily track, add, update, delete, and search your expenses.  
Includes Bootstrap styling and ready for ML analytics extension.

---

## Features

- Add, view, edit, and delete expenses
- Search expenses by ID
- Responsive UI with Bootstrap
- RESTful API with Flask and MySQL
- Ready for machine learning analytics integration

---

## Project Structure

```
expense-tracker/
  ├── backend/      # Flask backend API
  └── frontend/     # React frontend app
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

---

### 2. Backend Setup (Flask + MySQL)

#### a. Install Python dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
*(If you don’t have a `requirements.txt`, install at least: `flask`, `flask-mysqldb`, `flask-cors`.)*

#### b. Configure MySQL

- Make sure you have a MySQL database (local or online).
- Create an `expenses` table:
  ```sql
  CREATE TABLE expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount DECIMAL(10,2),
      category VARCHAR(50),
      description VARCHAR(255),
      date DATE
  );
  ```
- Update `app.py` with your MySQL credentials.

#### c. Run the backend server

```bash
python app.py
```
The backend runs on [http://localhost:3003](http://localhost:3003) by default.

---

### 3. Frontend Setup (React)

#### a. Install Node dependencies

```bash
cd ../frontend
npm install
```

#### b. Set up Proxy

Add this line to `frontend/package.json`:
```json
"proxy": "http://localhost:3003"
```

#### c. Start the frontend

```bash
npm start
```
The frontend runs on [http://localhost:3000](http://localhost:3000).

---

## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Add expenses using the form.
- View, edit, delete, or search expenses by ID.
- All changes are reflected in real time.

---

## Customization & Extensions

- **Styling:** Edit `App.css` or use Bootstrap classes for custom UI.
- **Machine Learning:** Add analytics endpoints in the Flask backend and connect them to the frontend.
- **Authentication:** Add user login/register for multi-user support.

---

## Troubleshooting

- If you see `Module not found` errors in React, run `npm install` in the `frontend` folder.
- If you see `ModuleNotFoundError: No module named 'flask'`, activate your Python virtual environment and run `pip install flask`.
- If the backend can't connect to MySQL, check your credentials and database/table existence.

---

## License

MIT License

---

**Happy Tracking!**

---

Feel free to update the repo URL, add your name, or expand the sections as your project grows!

