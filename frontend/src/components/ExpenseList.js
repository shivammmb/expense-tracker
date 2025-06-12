import React from "react";

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  return (
    <ul className="list-group">
      {expenses.map(exp => (
        <li key={exp.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            {exp.date} - {exp.category}: {exp.description} (${exp.amount})
          </div>
          <div>
            {onEditExpense && (
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEditExpense(exp)}>
                Edit
              </button>
            )}
            {onDeleteExpense && (
              <button className="btn btn-sm btn-danger" onClick={() => onDeleteExpense(exp.id)}>
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
