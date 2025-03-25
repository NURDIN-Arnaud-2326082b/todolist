import React, { useState, useEffect, useCallback } from 'react';

function TaskModal({ 
  newTask, 
  setNewTask, 
  categories, 
  addTask, 
  closeModal, 
  existingContacts = [], 
  isEditing = false,
  updateTask = null
}) {
  const [contactInput, setContactInput] = useState('');
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  // Suppression de la variable inutilisée
  // const [isFormValid, setIsFormValid] = useState(false);
  const [selectedRecurrenceType, setSelectedRecurrenceType] = useState('');
  // État pour suivre si le formulaire a été soumis
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Utilisation de useCallback pour mémoriser la fonction validateForm
  const validateForm = useCallback(() => {
    const errors = {};
    
    // Vérification des champs obligatoires
    if (!newTask.title.trim()) errors.title = "Le titre est obligatoire";
    if (!newTask.date_echeance) errors.date_echeance = "La date d'échéance est obligatoire";
    
    // Vérification spécifique pour les tâches récurrentes
    if (newTask.recurring && !newTask.recurrenceInterval) {
      errors.recurrenceInterval = "Veuillez sélectionner un type de récurrence";
    }
    
    // Vérification des catégories
    if (newTask.categories.length === 0) errors.categories = "Au moins une catégorie est requise";
    
    setFormErrors(errors);
    // setIsFormValid(Object.keys(errors).length === 0); // Ligne supprimée car non utilisée
  }, [newTask]); // Ajouter la dépendance newTask

  // Initialiser le type de récurrence sélectionné au chargement
  useEffect(() => {
    if (newTask.recurrenceInterval) {
      switch (newTask.recurrenceInterval) {
        case 1: setSelectedRecurrenceType('daily'); break;
        case 7: setSelectedRecurrenceType('weekly'); break;
        case 30: setSelectedRecurrenceType('monthly'); break;
        case 365: setSelectedRecurrenceType('yearly'); break;
        default: setSelectedRecurrenceType('');
      }
    } else {
      setSelectedRecurrenceType('');
    }
  }, [newTask.recurrenceInterval]);

  // Vérifier la validité du formulaire à chaque changement
  useEffect(() => {
    validateForm();
  }, [validateForm]); // Utiliser validateForm comme dépendance

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Marquer le formulaire comme soumis pour afficher les erreurs
    setFormSubmitted(true);
    
    validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      if (isEditing) {
        updateTask();
      } else {
        addTask();
      }
    } else {
      // Afficher un message d'erreur général
      alert("Veuillez remplir tous les champs obligatoires");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEditing ? 'Modifier la tâche' : 'Ajouter une tâche'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Titre* :
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              className={formSubmitted && formErrors.title ? "error-input" : ""}
            />
            {formSubmitted && formErrors.title && <span className="error-message">{formErrors.title}</span>}
          </label>
          <label>
            Description :
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </label>
          <label>
            Date d'échéance* :
            <input
              type="date"
              value={newTask.date_echeance}
              onChange={(e) => setNewTask({ ...newTask, date_echeance: e.target.value })}
              required
              className={formSubmitted && formErrors.date_echeance ? "error-input" : ""}
            />
            {formSubmitted && formErrors.date_echeance && <span className="error-message">{formErrors.date_echeance}</span>}
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
            Tâche récurrente :
            <input
              type="checkbox"
              checked={newTask.recurring}
              onChange={(e) => {
                if (!e.target.checked) {
                  setNewTask({
                    ...newTask,
                    recurring: false,
                    recurrenceInterval: null,
                    recurrenceEndDate: ''
                  });
                  setSelectedRecurrenceType('');
                } else {
                  setNewTask({
                    ...newTask,
                    recurring: true
                  });
                }
              }}
            />
          </label>

          {newTask.recurring && (
            <>
              <label>
                Type de récurrence* :
                <select
                  value={selectedRecurrenceType}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRecurrenceType(value);
                    
                    let interval = null;
                    switch(value) {
                      case 'daily': interval = 1; break;
                      case 'weekly': interval = 7; break;
                      case 'monthly': interval = 30; break;
                      case 'yearly': interval = 365; break;
                      default: interval = null;
                    }
                    
                    setNewTask({ ...newTask, recurrenceInterval: interval });
                  }}
                  required={newTask.recurring}
                  className={formSubmitted && formErrors.recurrenceInterval ? "error-input" : ""}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                  <option value="yearly">Annuelle</option>
                </select>
                {formSubmitted && formErrors.recurrenceInterval && <span className="error-message">{formErrors.recurrenceInterval}</span>}
              </label>
              <label>
                Jusqu'à :
                <input
                  type="date"
                  value={newTask.recurrenceEndDate || ''}
                  onChange={(e) => setNewTask({ ...newTask, recurrenceEndDate: e.target.value })}
                />
              </label>
            </>
          )}
          <label>
            Catégories* :
            <select
              onChange={(e) => {
                const categoryId = parseInt(e.target.value, 10);
                if (categoryId) {
                  addCategoryToTask(categoryId);
                  e.target.value = ""; // Réinitialiser le menu déroulant
                }
              }}
              className={formSubmitted && formErrors.categories ? "error-input" : ""}
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
            {formSubmitted && formErrors.categories && <span className="error-message">{formErrors.categories}</span>}
          </label>
          <div className="selected-categories">
            {newTask.categories.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId);
              return category && (
                <span
                  key={category.id}
                  className="selected-category"
                  style={{ backgroundColor: category.color }}
                >
                  {category.title}
                  <button
                    type="button"
                    className="remove-category"
                    onClick={() => removeCategoryFromTask(category.id)}
                  >
                    x
                  </button>
                </span>
              );
            })}
          </div>
          <label>
            Contacts :
            <div className="contact-input-container">
              <input
                type="text"
                id="contact-input"
                placeholder="Ajouter un contact"
                value={contactInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setContactInput(value);
                  
                  // Filtrer les suggestions
                  if (value.trim()) {
                    const filtered = existingContacts.filter(
                      contact => contact.toLowerCase().includes(value.toLowerCase())
                    );
                    setContactSuggestions(filtered);
                  } else {
                    setContactSuggestions([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && contactInput.trim()) {
                    const newContact = { name: contactInput.trim() };
                    if (!newTask.contacts.some(contact => contact.name === newContact.name)) {
                      setNewTask({
                        ...newTask,
                        contacts: [...(newTask.contacts || []), newContact]
                      });
                    }
                    setContactInput('');
                    setContactSuggestions([]);
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {contactSuggestions.length > 0 && (
              <div className="contact-suggestions">
                {contactSuggestions.map((contactName, index) => (
                  <div 
                    key={index}
                    className="contact-suggestion"
                    onClick={() => {
                      const newContact = { name: contactName };
                      if (!newTask.contacts.some(contact => contact.name === newContact.name)) {
                        setNewTask({
                          ...newTask,
                          contacts: [...(newTask.contacts || []), newContact]
                        });
                      }
                      setContactInput('');
                      setContactSuggestions([]);
                    }}
                  >
                    {contactName}
                  </div>
                ))}
              </div>
            )}
          </label>
          <div className="selected-contacts">
            {(newTask.contacts || []).map((contact, index) => (
              <span key={index} className="selected-contact">
                {contact.name}
                <button
                  type="button"
                  className="remove-contact"
                  onClick={() => {
                    setNewTask({
                      ...newTask,
                      contacts: newTask.contacts.filter((c, i) => i !== index)
                    });
                  }}
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <div className="modal-actions">
            <button type="submit">
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </button>
            <button type="button" onClick={closeModal}>Annuler</button>
          </div>
          <div className="required-fields-notice">* Champs obligatoires</div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;