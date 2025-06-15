// ExpenseForm.js
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


function ExpenseForm({ onAddExpense, editingExpense, onUpdateExpense, onCancelEdit }) {
  const [error, setError] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: today
  });

  // Pre-fill form when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description,
        date: editingExpense.date
      });
    } else {
      setForm({ amount: "", category: "", description: "", date: today });
    }setError("");
  }, [editingExpense, today]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!form.date) {
      setError("Date is required.");
      return;
    }
  
    if (editingExpense) {
      onUpdateExpense(editingExpense.id, form);
    } else {
      onAddExpense(form);
    }
    setForm({ amount: "", category: "", description: "", date: today });
    setError("");
  };
  const handleCancel = () => {
    setForm({ amount: "", category: "", description: "", date: today });
    setError("");
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <input 
        name="amount" 
        value={form.amount} 
        onChange={handleChange} 
        required 
        className="form-control mb-2" 
        type="number"
        min="0.01"
        step="0.01"
        placeholder= "Amount (minimum $ 0.01)"
      />

      <input 
        name="category" 
        value={form.category} 
        onChange={handleChange} 
        placeholder="Category" 
        required 
        className="form-control mb-2" 
      />
      <input 
        name="description" 
        value={form.description} 
        onChange={handleChange} 
        placeholder="Description" 
        required 
        className="form-control mb-2" 
      />
      <input 
        name="date" 
        type="date" 
        value={form.date} 
        onChange={handleChange} 
        required 
        className="form-control mb-2" 
      />
      <button type="submit" className="btn btn-primary me-2">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
      {editingExpense && (
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ExpenseForm;
