import React from 'react';

function SortModal({ closeModal, setSortCriteria, contacts }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Trier les tâches</h2>
        <button onClick={() => { setSortCriteria('date_recent'); closeModal(); }}>
          Date d'échéance (la plus récente)
        </button>
        <button onClick={() => { setSortCriteria('date_late'); closeModal(); }}>
          Date d'échéance (la plus tardive)
        </button>
        <button onClick={() => { setSortCriteria('alphabetical'); closeModal(); }}>
          Ordre alphabétique
        </button>
        <button onClick={() => { setSortCriteria('category'); closeModal(); }}>
          Catégorie
        </button>
        <label>
          Contact :
          <select
            onChange={(e) => {
              setSortCriteria({ type: 'contact', value: e.target.value });
              closeModal();
            }}
          >
            <option value="">-- Sélectionner un contact --</option>
            {contacts.map((contact, index) => (
              <option key={index} value={contact}>
                {contact}
              </option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={closeModal}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default SortModal;