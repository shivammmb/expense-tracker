import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function ExpenseList({ expenses }) {
  return (
    <ul>
      {expenses.map(exp => (
        <li key={exp.id}>
          {exp.date} - {exp.category}: {exp.description} (${exp.amount})
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;

