import React from 'react';

function TaskModal({ newTask, setNewTask, categories, addTask, closeModal }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ajouter une tâche</h2>
        <label>
          Titre :
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </label>
        <label>
          Description :
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </label>
        <label>
          Date d'échéance :
          <input
            type="date"
            value={newTask.date_echeance}
            onChange={(e) => setNewTask({ ...newTask, date_echeance: e.target.value })}
          />
        </label>
        <label>
          Urgent :
          <input
            type="checkbox"
            checked={newTask.urgent}
            onChange={(e) => setNewTask({ ...newTask, urgent: e.target.checked })}
          />
        </label>
        <label>
          Catégorie :
          <select
            value={newTask.category || ''}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          >
            <option value="">Aucune</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={addTask}>Ajouter</button>
          <button onClick={closeModal}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;