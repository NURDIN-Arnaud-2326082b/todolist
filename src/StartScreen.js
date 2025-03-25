import React from 'react';

function StartScreen({ onStart, onImport }) {
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          onImport(importedData);
        } catch (error) {
          alert("Erreur lors de l'importation du fichier JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="start-screen">
      <div className="start-container">
        <h1>Bienvenue sur TodoList</h1>
        <p>Choisissez comment vous souhaitez démarrer :</p>
        
        <div className="start-options">
          <div className="start-option">
            <h2>Commencer une nouvelle sauvegarde</h2>
            <p>Démarrez une nouvelle liste de tâches sans données existantes.</p>
            <button onClick={() => onStart([])}>Nouvelle liste</button>
          </div>
          
          <div className="start-option">
            <h2>Importer une sauvegarde existante</h2>
            <p>Chargez vos tâches et catégories à partir d'un fichier JSON.</p>
            <label htmlFor="file-input" className="import-button">
              Importer un fichier JSON
            </label>
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;