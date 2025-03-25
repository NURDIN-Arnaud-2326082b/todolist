import React from 'react';
import Task from './Task';

function Todo({
  tasks,
  categories,
  selectedTasks,
  openTask,
  toggleTaskStatus,
  deleteTask,
  toggleTaskDetails,
  toggleTaskSelection,
  markSelectedTasksAsDone,
  deleteSelectedTasks,
  toggleSelectedTasksStatus,
  removeCategoryFromTask,
  handleCategoryClick,
  openTaskForEdit
}) {


  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            selectedTasks={selectedTasks}
            openTask={openTask}
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
            toggleTaskDetails={toggleTaskDetails}
            toggleTaskSelection={toggleTaskSelection}
            removeCategoryFromTask={removeCategoryFromTask}
            handleCategoryClick={handleCategoryClick}
            openTaskForEdit={openTaskForEdit}
          />
        ))}
      </ul>
      <div className="bulk-actions">
        <button onClick={toggleSelectedTasksStatus} disabled={selectedTasks.length === 0}>
          {selectedTasks.every((id) => tasks.find((task) => task.id === id)?.done)
            ? "Marquer comme non faites"
            : "Marquer comme faites"}
        </button>
        <button onClick={deleteSelectedTasks} disabled={selectedTasks.length === 0}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default Todo;