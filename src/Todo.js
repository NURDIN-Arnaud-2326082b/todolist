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
}) {
  const totalTasks = tasks.length;
  const ongoingTasks = tasks.filter((task) => !task.done).length;
  const completedTasks = tasks.filter((task) => task.done).length;

  return (
    <div>
      <p className="task-stats">
        {totalTasks} tâches, {ongoingTasks} tâches en cours, {completedTasks} tâches effectuées
      </p>
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