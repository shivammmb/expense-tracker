import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function ExpenseForm({ onAddExpense }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(form);
    setForm({ amount: "", category: "", description: "", date: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
