import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from "axios";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";



function App() {
  const [expenses, setExpenses] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchClicked, setSearchClicked] = useState(null);
  const [predictionDate, setPredictionDate] = useState(new Date().toISOString().split('T')[0]);
  const [predictionCategory, setPredictionCategory] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [mlCategories, setMlCategories] = useState([]);

// Get unique categories from expenses
  //const categories = [...new Set(expenses.map(exp => exp.category))];

  const handlePredict = async () => {
    try {
      const response = await axios.post('/api/predict', { 
        date: predictionDate,
        category: predictionCategory || null 
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };
  // Fetch all expenses
  const fetchExpenses = () => {
    axios.get("/api/expenses")
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchExpenses();
    // Fetch categories from backend ML CSV
    axios.get('/api/categories')
      .then(res => setMlCategories(res.data))
      .catch(err => console.error("Category fetch error:", err));
  }, []);

  // Add a new expense
  const addExpense = (expense) => {
    axios.post("/api/expenses", expense)
      .then(() => fetchExpenses())
      .catch(error => console.error(error));
  };

  // Delete an expense
  const deleteExpense = (id) => {
    axios.delete(`/api/expenses/${id}`)
      .then(() => fetchExpenses())
      .catch(error => console.error(error));
  };

  // Search expense by ID
  const searchExpenseById = () => {
    setSearchClicked(true);
    if (!searchId) {
      setSearchResult(null);
      return;
    }
    axios.get(`/api/expenses/${searchId}`)
      .then(response => setSearchResult(response.data))
      .catch(() => setSearchResult(null));
  };

  // Update an expense
  const updateExpense = (id, updatedExpense) => {
    axios.put(`/api/expenses/${id}`, updatedExpense)
      .then(() => {
        setEditingExpense(null);
        fetchExpenses();
      })
      .catch(error => console.error(error));
  };
 return (
    <div className="container mt-4">
      <h1>Expense Tracker</h1>

      {/* Search by ID section */}
      <div className="mb-3 d-flex">
        <input
          type="number"
          placeholder="Search expense by ID"
          value={searchId}
          onChange={e => {
            setSearchId(e.target.value);
            setSearchClicked(false);
          }}
          className="form-control me-2"
          style={{ maxWidth: '300px' }}
        />
        <button
          onClick={searchExpenseById}
          className="btn btn-primary"
          style={{ height: "38px" }}
        >
          Search
        </button>
      </div>

      {/* Prediction section */}
      <div className="mb-4 border p-3 rounded">
        <h4>Expense Prediction</h4>
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input
              type="date"
              value={predictionDate}
              onChange={(e) => setPredictionDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <select
              value={predictionCategory}
              onChange={(e) => setPredictionCategory(e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {mlCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button onClick={handlePredict} className="btn btn-primary w-100">
              Predict
            </button>
          </div>
        </div>

        {/* Prediction result */}
        {prediction && (
          <div className="alert alert-success mt-3">
            <strong>Predicted expense:</strong><br/>
            {prediction.date}{prediction.categories ? ` • ${prediction.categories}` : ''}<br/>
            ₹{prediction.predicted_amount}
          </div>
        )}
      </div>

      {/* Search results */}
      {searchClicked && (
        searchResult ? (
          <div className="alert alert-info">
            <strong>Found Expense:</strong> ID: {searchResult.id}, Amount: ₹{searchResult.amount}, Category: {searchResult.category}, Description: {searchResult.description}, Date: {searchResult.date}
          </div>
        ) : (
          searchId && (
            <div className="alert alert-warning">
              No expense found with ID {searchId}
            </div>
          )
        )
      )}

      {/* Expense Form */}
      <ExpenseForm
        onAddExpense={addExpense}
        editingExpense={editingExpense}
        onUpdateExpense={updateExpense}
        onCancelEdit={() => setEditingExpense(null)}
      />

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onDeleteExpense={deleteExpense}
        onEditExpense={setEditingExpense}
      />
    </div>
  );
}

export default App;
