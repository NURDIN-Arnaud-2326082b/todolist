import React from 'react';

function Task({
  task,
  selectedTasks,
  openTask,
  toggleTaskStatus,
  deleteTask,
  toggleTaskDetails,
  toggleTaskSelection,
  removeCategoryFromTask,
  handleCategoryClick,
  openTaskForEdit,
}) {
  const isOpen = openTask === task.id;
  const hasMoreCategories = task.categories && task.categories.length > 2;
  const visibleCategories = hasMoreCategories && !isOpen 
    ? task.categories.slice(0, 2) 
    : task.categories;
  const hiddenCategoriesCount = hasMoreCategories && !isOpen 
    ? task.categories.length - 2 
    : 0;

  return (
    <li className={`task-item ${task.done ? 'done' : ''} ${task.urgent ? 'urgent' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={selectedTasks.includes(task.id)}
          onChange={() => toggleTaskSelection(task.id)}
        />
        <strong>
          {task.title} - {task.date_echeance}
        </strong>
        {task.recurring && (
          <span className="recurrence-indicator" title="Tâche récurrente">
            🔄
          </span>
        )}
        <span
          className={`task-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => toggleTaskDetails(task.id)}
        ></span>
      </div>

      <div className="task-categories">
  {visibleCategories &&
    visibleCategories
      .filter(category => category && category.color) 
      .map((category) => (
        <span
          key={category.id}
          className="task-category"
          style={{ backgroundColor: category.color }}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.title}
          <button
            className="remove-category"
            onClick={(e) => {
              e.stopPropagation(); 
              removeCategoryFromTask(task.id, category.id);
            }}
          >
            x
          </button>
        </span>
      ))}
  
  {hiddenCategoriesCount > 0 && (
    <span 
      className="more-categories" 
      onClick={() => toggleTaskDetails(task.id)}
      title="Voir toutes les catégories"
    >
      +{hiddenCategoriesCount}
    </span>
  )}
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
          <div className="task-actions">
            <button onClick={() => toggleTaskStatus(task.id)}>
              {task.done ? "Annuler" : "Finaliser"}
            </button>
            <button onClick={() => openTaskForEdit(task)}>Modifier</button>
            <button onClick={() => deleteTask(task.id)}>Supprimer</button>
          </div>
        </div>
      )}
    </li>
  );
}

export default Task;