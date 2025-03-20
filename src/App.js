import { useEffect, useState } from 'react';
import Header from './Header';
import Todo from './Todo';
import TaskModal from './TaskModal';
import CategoryModal from './CategoryModal';
import './style.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [openTask, setOpenTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date_echeance: '',
    urgent: false,
    done: false,
    category: null,
  });

  const [newCategory, setNewCategory] = useState({
    title: '',
    color: '#000000',
  });

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        const updatedTasks = data.taches.map((task) => {
          const relation = data.relations.find((rel) => rel.tache === task.id);
          return {
            ...task,
            categoryColor: relation
              ? data.categories.find((cat) => cat.id === relation.categorie).color
              : "#ccc",
          };
        });

        updatedTasks.sort(
          (a, b) =>
            new Date(a.date_echeance.split('/').reverse().join('-')) -
            new Date(b.date_echeance.split('/').reverse().join('-'))
        );

        setTasks(updatedTasks);
        setCategories(data.categories);
      })
      .catch((error) =>
        console.error("Erreur de chargement des données :", error)
      );
  }, []);

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskDetails = (id) => {
    setOpenTask(openTask === id ? null : id);
  };

  const toggleTaskSelection = (id) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((taskId) => taskId !== id)
        : [...prevSelected, id]
    );
  };

  const markSelectedTasksAsDone = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, done: true } : task
      )
    );
    setSelectedTasks([]);
  };

  const deleteSelectedTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => !selectedTasks.includes(task.id))
    );
    setSelectedTasks([]);
  };

  const toggleSelectedTasksStatus = () => {
    const allDone = selectedTasks.every((id) => tasks.find((task) => task.id === id)?.done);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, done: !allDone } : task
      )
    );
    setSelectedTasks([]);
  };

  const openTaskModal = () => {
    setIsTaskModalOpen(true);
    setIsFabOpen(false);
  };

  const closeTaskModal = () => setIsTaskModalOpen(false);

  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
    setIsFabOpen(false);
  };

  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  const addTask = () => {
    const newTaskWithId = {
      ...newTask,
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      date_creation: new Date().toLocaleDateString('fr-FR'),
      date_echeance: new Date(newTask.date_echeance).toLocaleDateString('fr-FR'),
      categoryColor: categories.find((cat) => cat.id === newTask.category)?.color || "#ccc",
    };

    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    setNewTask({
      title: '',
      description: '',
      date_echeance: '',
      urgent: false,
      done: false,
      category: null,
    });
    closeTaskModal();
  };

  const addCategory = () => {
    const newCategoryWithId = {
      ...newCategory,
      id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
    };

    setCategories((prevCategories) => [...prevCategories, newCategoryWithId]);
    setNewCategory({
      title: '',
      color: '#000000',
    });
    closeCategoryModal();
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          if (importedData.taches && importedData.categories && importedData.relations) {
            const updatedTasks = importedData.taches.map((task) => {
              const relation = importedData.relations.find((rel) => rel.tache === task.id);
              return {
                ...task,
                categoryColor: relation
                  ? importedData.categories.find((cat) => cat.id === relation.categorie).color
                  : "#ccc",
              };
            });

            updatedTasks.sort(
              (a, b) =>
                new Date(a.date_echeance.split('/').reverse().join('-')) -
                new Date(b.date_echeance.split('/').reverse().join('-'))
            );

            setTasks(updatedTasks);
            setCategories(importedData.categories);
            alert("Données importées avec succès !");
          } else {
            alert("Le fichier JSON ne contient pas les données attendues.");
          }
        } catch (error) {
          alert("Erreur lors de l'importation du fichier JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  const resetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.")) {
      setTasks([]);
      setCategories([]);
      alert("Les données ont été réinitialisées.");
    }
  };

  return (
    <div>
      <Header />
      <div className="import-reset-buttons">
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
        <button className="reset-button" onClick={resetData}>
          Réinitialiser les données
        </button>
      </div>
      <div className="toggle-completed-tasks">
        <label className="switch">
          <input
            type="checkbox"
            checked={showCompletedTasks}
            onChange={() => setShowCompletedTasks(!showCompletedTasks)}
          />
          <span className="slider"></span>
        </label>
        <span>
          {showCompletedTasks ? 'Masquer les tâches effectuées' : 'Afficher les tâches effectuées'}
        </span>
      </div>
      <Todo
        tasks={tasks.filter(task => showCompletedTasks || !task.done)}
        categories={categories}
        selectedTasks={selectedTasks}
        openTask={openTask}
        toggleTaskStatus={toggleTaskStatus}
        deleteTask={deleteTask}
        toggleTaskDetails={toggleTaskDetails}
        toggleTaskSelection={toggleTaskSelection}
        markSelectedTasksAsDone={markSelectedTasksAsDone}
        deleteSelectedTasks={deleteSelectedTasks}
        toggleSelectedTasksStatus={toggleSelectedTasksStatus}
      />
      {isTaskModalOpen && (
        <TaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          categories={categories}
          addTask={addTask}
          closeModal={closeTaskModal}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryModal
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          addCategory={addCategory}
          closeModal={closeCategoryModal}
        />
      )}
      <div className="fab-container">
        <button className="fab" onClick={() => setIsFabOpen(!isFabOpen)}>+</button>
        {isFabOpen && (
          <div className="fab-options">
            <button onClick={openTaskModal}>Ajouter une tâche</button>
            <button onClick={openCategoryModal}>Ajouter une catégorie</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;