import React from 'react';

function TaskModal({ newTask, setNewTask, categories, addTask, closeModal }) {
  const addCategoryToTask = (categoryId) => {
    const selectedCategories = newTask.categories || [];
    if (!selectedCategories.includes(categoryId)) {
      setNewTask({
        ...newTask,
        categories: [...selectedCategories, categoryId],
      });
    }
  };

  const removeCategoryFromTask = (categoryId) => {
    setNewTask({
      ...newTask,
      categories: newTask.categories.filter((id) => id !== categoryId),
    });
  };

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
          Catégories :
          <select
            onChange={(e) => {
              const categoryId = parseInt(e.target.value, 10);
              if (categoryId) {
                addCategoryToTask(categoryId);
                e.target.value = ""; // Réinitialiser le menu déroulant
              }
            }}
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {categories
              .filter((category) => !newTask.categories.includes(category.id))
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
          </select>
        </label>
        <div className="selected-categories">
          {newTask.categories.map((categoryId) => {
            const category = categories.find((cat) => cat.id === categoryId);
            return (
              <span
                key={category.id}
                className="selected-category"
                style={{ backgroundColor: category.color }}
              >
                {category.title}
                <button
                  className="remove-category"
                  onClick={() => removeCategoryFromTask(category.id)}
                >
                  x
                </button>
              </span>
            );
          })}
        </div>
        <div className="modal-actions">
          <button onClick={addTask}>Ajouter</button>
          <button onClick={closeModal}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;