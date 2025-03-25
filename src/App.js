import { useEffect, useState } from 'react';
import Header from './Header';
import Todo from './Todo';
import TaskModal from './TaskModal';
import CategoryModal from './CategoryModal';
import './style.css';
import SortModal from './SortModal';
import SearchBar from './SearchBar';
import StartScreen from './StartScreen'; // Importer le nouveau composant

function App() {
  // Nouvel état pour contrôler l'affichage de l'écran de démarrage
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [openTask, setOpenTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('date_recent');
  const totalTasks = tasks.length;
  const ongoingTasks = tasks.filter((task) => !task.done).length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date_echeance: '',
    urgent: false,
    done: false,
    categories: [],
    recurring: false,
    recurrenceInterval: null,
    recurrenceEndDate: '',
    contacts: []
  });

  const [newCategory, setNewCategory] = useState({
    title: '',
    color: '#000000',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
  const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

const startWithEmptyData = () => {
  const confirmNewList = window.confirm("Voulez-vous vraiment créer une nouvelle liste vide ?");
  
  if (!confirmNewList) return;
  
  setTasks([]);
  setCategories([]);
  setIsInitialized(true);
};

  // Fonction pour démarrer l'application avec des données importées
  const startWithImportedData = (importedData) => {
    if (importedData.taches && importedData.categories && importedData.relations) {
      const updatedTasks = importedData.taches.map((task) => {
        const taskCategories = importedData.relations
          .filter((relation) => relation.tache === task.id)
          .map((relation) =>
            importedData.categories.find((cat) => cat.id === relation.categorie)
          );

        return {
          ...task,
          categories: taskCategories,
        };
      });

      updatedTasks.sort(
        (a, b) =>
          new Date(a.date_echeance.split('/').reverse().join('-')) -
          new Date(b.date_echeance.split('/').reverse().join('-'))
      );

      setTasks(updatedTasks);
      setCategories(importedData.categories);
      setIsInitialized(true);
      alert("Données importées avec succès !");
    } else {
      alert("Le fichier JSON ne contient pas les données attendues.");
    }
  };

  // Demander la permission des notifications
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Vérifier les tâches en retard une seule fois au chargement
    if (tasks.length > 0) {
      const now = new Date();
      
      tasks.forEach(task => {
        if (!task.done) {
          const dueDate = new Date(task.date_echeance.split('/').reverse().join('-'));
          
          // Si la date d'échéance est aujourd'hui ou dans le passé
          if (dueDate <= now) {
            if (Notification.permission === 'granted') {
              const isOverdue = dueDate < now;
              new Notification(isOverdue ? 'Tâche en retard' : 'Tâche arrivée à échéance', {
                body: isOverdue 
                  ? `La tâche "${task.title}" est en retard.` 
                  : `La tâche "${task.title}" est arrivée à échéance aujourd'hui.`,
                icon: '/favicon.ico'
              });
            }
          }
        }
      });
    }
  }, [tasks]); // Se déclenche uniquement lorsque les tâches changent

  // Suppression du useEffect qui charge automatiquement les données
  // ce sera fait par l'écran de démarrage maintenant

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

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    if (isEditing) {
      setIsEditing(false);
      setTaskToEdit(null);
    }
  };

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
      categories: newTask.categories.map((categoryId) =>
        categories.find((cat) => cat.id === categoryId)
      ),
    };
  
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    
    // Si la tâche est récurrente, créer les occurrences futures
    if (newTask.recurring && newTask.recurrenceInterval) {
      const occurrences = [];
      let currentDate = new Date(newTask.date_echeance);
      const endDate = newTask.recurrenceEndDate ? new Date(newTask.recurrenceEndDate) : null;
      
      // Limiter à 100 occurrences maximum pour éviter les boucles infinies
      for (let i = 0; i < 100; i++) {
        // Ajouter l'intervalle en jours
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + newTask.recurrenceInterval));
        
        // Arrêter si on dépasse la date de fin
        if (endDate && currentDate > endDate) break;
        
        const recurrenceTask = {
          ...newTaskWithId,
          id: tasks.length + occurrences.length + 1 + i,
          date_echeance: currentDate.toLocaleDateString('fr-FR'),
          recurring_parent_id: newTaskWithId.id, // Référence à la tâche parent
        };
        
        occurrences.push(recurrenceTask);
      }
      
      // Ajouter toutes les occurrences
      setTasks((prevTasks) => [...prevTasks, ...occurrences]);
    }
    
    setNewTask({
      title: '',
      description: '',
      date_echeance: '',
      urgent: false,
      done: false,
      categories: [],
      recurring: false,
      recurrenceInterval: null,
      recurrenceEndDate: '',
      contacts: []
    });
    closeTaskModal();
  };

  const addCategory = () => {
    // Assurez-vous que la couleur est bien présente
    const newCategoryWithId = {
      ...newCategory,
      id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
      // S'assurer que la couleur est définie, utiliser une valeur par défaut si elle ne l'est pas
      color: newCategory.color || "#cccccc"
    };
  
    // Ajoutez un log pour déboguer
    console.log("Nouvelle catégorie créée:", newCategoryWithId);
  
    setCategories((prevCategories) => [...prevCategories, newCategoryWithId]);
    setNewCategory({
      title: '',
      color: '#000000',
    });
    closeCategoryModal();
  };

  const handleCategoryClick = (categoryId) => {
    setFilteredCategory(categoryId);
  };

  const removeCategoryFromTask = (taskId, categoryId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              categories: task.categories.filter((cat) => cat.id !== categoryId),
            }
          : task
      )
    );
  };

  const sortTasks = (tasks, criteria) => {
    switch (criteria.type || criteria) {
      case 'date_late':
        return tasks.sort((a, b) => new Date(b.date_echeance.split('/').reverse().join('-')) - new Date(a.date_echeance.split('/').reverse().join('-')));
      case 'date_recent':
        return tasks.sort((a, b) => new Date(a.date_echeance.split('/').reverse().join('-')) - new Date(b.date_echeance.split('/').reverse().join('-')));
      case 'creation_recent':
        return tasks.sort((a, b) => new Date(b.date_creation.split('/').reverse().join('-')) - new Date(a.date_creation.split('/').reverse().join('-')));
      case 'creation_old':
        return tasks.sort((a, b) => new Date(a.date_creation.split('/').reverse().join('-')) - new Date(b.date_creation.split('/').reverse().join('-')));
      case 'alphabetical':
        return tasks.sort((a, b) => a.title.localeCompare(b.title));
      case 'category':
        return tasks.sort((a, b) => (a.categories[0]?.title || '').localeCompare(b.categories[0]?.title || ''));
      case 'contact':
        if (!criteria.value) return tasks;
        return tasks.filter((task) => (task.contacts || []).some(contact => contact.name === criteria.value));
      default:
        return tasks;
    }
  };

  const exportData = () => {
    const exportTasks = tasks.map(task => {
      const { categories, ...taskWithoutCategories } = task;
      return taskWithoutCategories;
    });
  
    // Créer les relations entre tâches et catégories
    const exportRelations = [];
    tasks.forEach(task => {
      task.categories.forEach(category => {
        exportRelations.push({
          tache: task.id,
          categorie: category.id
        });
      });
    });
  
    // Créer l'objet final à exporter
    const exportData = {
      taches: exportTasks,
      categories: categories,
      relations: exportRelations
    };
  
    // Convertir en JSON et créer un fichier téléchargeable
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Créer un élément <a> temporaire pour le téléchargement
    const exportFileDefaultName = 'todo_export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredTasks = tasks
  .filter((task) => showCompletedTasks || !task.done)
  .filter((task) => (filteredCategory ? task.categories.some((cat) => cat.id === filteredCategory) : true))
  .filter((task) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const dueDate = new Date(task.date_echeance.split('/').reverse().join('-'));
    
    return task.done || dueDate >= oneWeekAgo;
  })
  // Ajouter le filtre de recherche
  .filter((task) => {
    // Appliquer le filtre uniquement si au moins 3 caractères sont saisis
    if (searchQuery.length >= 3) {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true; 
  });

  const sortedTasks = sortTasks(filteredTasks, sortCriteria);

  const openTaskForEdit = (task) => {
    const dateParts = task.date_echeance.split('/');
    const formattedDate = dateParts.length === 3 
      ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 
      : task.date_echeance;
    
    const taskWithCategoryIds = {
      ...task,
      date_echeance: formattedDate,
      categories: task.categories.map(category => category.id)
    };
    
    setTaskToEdit(taskWithCategoryIds);
    setIsEditing(true);
    setIsTaskModalOpen(true);
  };

  const updateTask = (taskChanges) => {
    if (taskChanges) {
      const validCategoryIds = taskChanges.categories.filter(categoryId => 
        categories.some(cat => cat.id === categoryId)
      );
      
      const updatedTaskWithCategories = {
        ...taskChanges,
        categories: validCategoryIds.map(categoryId => 
          categories.find(cat => cat.id === categoryId)
        ),
        date_echeance: typeof taskChanges.date_echeance === 'string' && taskChanges.date_echeance.includes('-') 
          ? new Date(taskChanges.date_echeance).toLocaleDateString('fr-FR')
          : taskChanges.date_echeance
      };
  
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTaskWithCategories.id ? updatedTaskWithCategories : task
        )
      );
      
      setIsEditing(false);
      setTaskToEdit(null);
      closeTaskModal();
    } 
    else {
      const validCategoryIds = taskToEdit.categories.filter(categoryId => 
        categories.some(cat => cat.id === categoryId)
      );
      
      const updatedTaskWithCategories = {
        ...taskToEdit,
        categories: validCategoryIds.map(categoryId => 
          categories.find(cat => cat.id === categoryId)
        ),
        date_echeance: typeof taskToEdit.date_echeance === 'string' && taskToEdit.date_echeance.includes('-') 
          ? new Date(taskToEdit.date_echeance).toLocaleDateString('fr-FR')
          : taskToEdit.date_echeance
      };
  
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTaskWithCategories.id ? updatedTaskWithCategories : task
        )
      );
      
      setIsEditing(false);
      setTaskToEdit(null);
      closeTaskModal();
    }
  };

const areFiltersActive = () => {
  return filteredCategory !== null || 
         sortCriteria !== 'date_recent' || 
         searchQuery.length >= 3;
}

const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('darkMode', newMode);
  // Appliquer le mode au document
  if (newMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

  return isInitialized ? (
    <div>

<div className="theme-switcher">
    <label className="theme-switch">
      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
      <span className="theme-slider"></span>
    </label>
  </div>
      <Header
        totalTasks={totalTasks}
        ongoingTasks={ongoingTasks}
        completedTasks={completedTasks}
      />
      <div className="app-actions">
        <button className="export-button" onClick={exportData}>
          Exporter les données
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
<div className="search-container">
  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  <div className="filter-button-container">
  <button 
    className="filter-button" 
    onClick={() => setIsSortModalOpen(true)}
  >
    <i className="fas fa-filter"></i>
  </button>
  {filteredCategory || sortCriteria !== 'date_recent' ? (
    <button 
      className="remove-filter" 
      onClick={() => {
        setFilteredCategory(null);
        setSortCriteria('date_recent');
      }}
      title="Supprimer les filtres"
    >
      x
    </button>
  ) : null}
</div>
</div>
      {isSortModalOpen && (
        <SortModal
          closeModal={() => setIsSortModalOpen(false)}
          setSortCriteria={setSortCriteria}
          contacts={[...new Set(tasks.flatMap((task) => task.contacts || []).map((contact) => contact.name).filter((name) => name))]}
        />
      )}
      <Todo
        tasks={sortedTasks}
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
        removeCategoryFromTask={removeCategoryFromTask}
        handleCategoryClick={handleCategoryClick}
        openTaskForEdit={openTaskForEdit}
      />
      {isTaskModalOpen && (
        <TaskModal
          newTask={isEditing ? taskToEdit : newTask}
          setNewTask={isEditing ? setTaskToEdit : setNewTask}
          categories={categories}
          addTask={addTask}
          updateTask={updateTask}
          isEditing={isEditing}
          closeModal={closeTaskModal}
          existingContacts={[...new Set(tasks.flatMap(task => (task.contacts || []).map(contact => contact.name)))]}
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
    <div className="fab-modal">
      <div className="fab-modal-content">
        <div className="fab-modal-options">
          <button onClick={openTaskModal}>
            Ajouter une tâche
          </button>
          <button onClick={openCategoryModal}>
            Ajouter une catégorie
          </button>
        </div>
      </div>
    </div>
  )}
</div>
    </div>
  ) : (
    <StartScreen
      onStart={startWithEmptyData}
      onImport={startWithImportedData}
    />
  );
}

export default App;