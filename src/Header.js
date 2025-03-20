import React from 'react';

function Header({ totalTasks, ongoingTasks, completedTasks }) {
  return (
    <header>
      <h1>ToDoList</h1>
      <p className="task-stats">
        {totalTasks} tâches, {ongoingTasks} tâches en cours, {completedTasks} tâches effectuées
      </p>
    </header>
  );
}

export default Header;