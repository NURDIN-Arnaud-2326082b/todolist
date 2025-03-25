import React, { useState, useCallback, useEffect } from 'react';

function CategoryModal({ newCategory, setNewCategory, addCategory, closeModal }) {
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!newCategory.title.trim()) errors.title = "Le titre est obligatoire";
    
    setFormErrors(errors);
  }, [newCategory]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleTitleChange = (e) => {
    setNewCategory({ ...newCategory, title: e.target.value });
  };

  const handleColorChange = (e) => {
    setNewCategory({ ...newCategory, color: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      addCategory();
    } else {
      alert("Veuillez remplir tous les champs obligatoires");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ajouter une catégorie</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Titre* :
            <input
              type="text"
              value={newCategory.title}
              onChange={handleTitleChange}
              required
              className={formSubmitted && formErrors.title ? "error-input" : ""}
            />
            {formSubmitted && formErrors.title && <span className="error-message">{formErrors.title}</span>}
          </label>
          <label>
            Couleur* :
            <input
              type="color"
              value={newCategory.color}
              onChange={handleColorChange}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit">Ajouter</button>
            <button type="button" onClick={closeModal}>Annuler</button>
          </div>
          <div className="required-fields-notice">* Champs obligatoires</div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;