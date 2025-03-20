import React from 'react';

function Task({
  task,
  selectedTasks,
  openTask,
  toggleTaskStatus,
  deleteTask,
  toggleTaskDetails,
  toggleTaskSelection,
}) {
  const isOpen = openTask === task.id;

  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={selectedTasks.includes(task.id)}
          onChange={() => toggleTaskSelection(task.id)}
        />
        <span
          className="task-category-color"
          style={{ backgroundColor: task.categoryColor }}
        ></span>
        <strong>
          {task.title} - {task.date_echeance}
        </strong>
        {task.urgent && <span className="urgent-indicator"></span>}
        <span
          className={`task-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => toggleTaskDetails(task.id)}
        ></span>
      </div>
      {isOpen && (
        <div className="task-details">
          <p><strong>Description:</strong> {task.description || 'Aucune description'}</p>
          <p><strong>Date de création:</strong> {task.date_creation}</p>
          <p>
            <strong>Contacts:</strong>{' '}
            {task.contacts && task.contacts.length > 0
              ? task.contacts.map((c) => c.name).join(', ')
              : 'Aucun contact'}
          </p>
          <button onClick={() => toggleTaskStatus(task.id)}>
            {task.done ? "Annuler" : "Finaliser"}
          </button>
          <button onClick={() => deleteTask(task.id)}>Supprimer</button>
        </div>
      )}
    </li>
  );
}

export default Task;