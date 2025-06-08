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

  // Fetch all expenses
  const fetchExpenses = () => {
    axios.get("/api/expenses")
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchExpenses();
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

      {/* Search by ID */}
      <div className="mb-3">
        <input
          type="number"
          placeholder="Search expense by ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={searchExpenseById} className="btn btn-primary mb-3">Search</button>
        {searchResult ? (
          <div className="alert alert-info">
            <strong>Found Expense:</strong> ID: {searchResult.id}, Amount: ${searchResult.amount}, Category: {searchResult.category}, Description: {searchResult.description}, Date: {searchResult.date}
          </div>
        ) : searchId ? (
          <div className="alert alert-warning">No expense found with ID {searchId}</div>
        ) : null}
      </div>

      {/* Expense Form for Add or Edit */}
      <ExpenseForm
        onAddExpense={addExpense}
        editingExpense={editingExpense}
        onUpdateExpense={updateExpense}
        onCancelEdit={() => setEditingExpense(null)}
      />

      {/* Expense List with delete and edit buttons */}
      <ExpenseList
        expenses={expenses}
        onDeleteExpense={deleteExpense}
        onEditExpense={setEditingExpense}
      />
    </div>
  );
}

export default App;
