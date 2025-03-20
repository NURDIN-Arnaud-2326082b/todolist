import React from 'react';

function CategoryModal({ newCategory, setNewCategory, addCategory, closeModal }) {
  const handleTitleChange = (e) => {
    setNewCategory({ ...newCategory, title: e.target.value });
  };

  const handleColorChange = (e) => {
    setNewCategory({ ...newCategory, color: e.target.value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ajouter une catégorie</h2>
        <label>
          Titre :
          <input
            type="text"
            value={newCategory.title}
            onChange={handleTitleChange}
          />
        </label>
        <label>
          Couleur :
          <input
            type="color"
            value={newCategory.color}
            onChange={handleColorChange}
          />
        </label>
        <div className="modal-actions">
          <button onClick={addCategory}>Ajouter</button>
          <button onClick={closeModal}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;