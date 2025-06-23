import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import the CSS file
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AddActivityPage from './components/AddActivityPage';
import HistoryPage from './components/HistoryPage';
import EditWorkoutPage from './components/EditWorkoutPage';
import EditMealPage from './components/EditMealPage';
import ConfirmationModal from './components/ConfirmationModal';


function App() {
    // State to manage the currently active page
    const [currentPage, setCurrentPage] = useState('home');
    // NEW STATE: To hold the default tab for the AddActivityPage
    const [addActivityDefaultTab, setAddActivityDefaultTab] = useState('workout'); // Default to 'workout'


    // State to manage workouts and meals data
    const [workouts, setWorkouts] = useState([
        { id: 'w1', type: 'Running', intensity: 'Medium', duration: 34, calories: 340, date: '2024-12-11', time: '07:30' },
        { id: 'w2', type: 'Yoga', intensity: 'Slow', duration: 49, calories: 147, date: '2024-12-10', time: '08:00' },
        { id: 'w3', type: 'Weight Lifting', intensity: 'Intense', duration: 65, calories: 520, date: '2024-12-09', time: '17:30' },
    ]);
    const [meals, setMeals] = useState([
        { id: 'm1', item: 'Oatmeal with Berries', calories: 320, date: '2024-12-11', time: '08:00' },
        { id: 'm2', item: 'Chicken Salad Sandwich', calories: 450, date: '2024-12-11', time: '13:00' },
    ]);


    // State for the delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState('');


    // State for editing
    const [editItemData, setEditItemData] = useState(null);
    const [editItemType, setEditItemType] = useState(null);


    // Function to change the current page and potentially set a default tab
    const handleNavigation = (page, defaultTab = 'workout') => { // Added defaultTab parameter
        setCurrentPage(page);
        if (page === 'add-activity') {
            setAddActivityDefaultTab(defaultTab); // Set the default tab when navigating to add-activity
        }
    };


    // --- Add Activity Handlers ---
    const handleSaveWorkout = (newWorkout) => {
        setWorkouts(prev => [...prev, { ...newWorkout, id: `w${prev.length + 1}` }]);
        setCurrentPage('history');
    };


    const handleSaveMeal = (newMeal) => {
        setMeals(prev => [...prev, { ...newMeal, id: `m${prev.length + 1}` }]);
        setCurrentPage('history');
    };


    // --- Edit Activity Handlers ---
    const handleEdit = (id, type) => {
        if (type === 'workout') {
            const workoutToEdit = workouts.find(w => w.id === id);
            setEditItemData(workoutToEdit);
            setEditItemType('workout');
            setCurrentPage('edit-workout');
        } else if (type === 'meal') {
            const mealToEdit = meals.find(m => m.id === id);
            setEditItemData(mealToEdit);
            setEditItemType('meal');
            setCurrentPage('edit-meal');
        }
    };


    const handleSaveWorkoutEdit = (updatedWorkout) => {
        setWorkouts(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
        setEditItemData(null);
        setEditItemType(null);
        setCurrentPage('history');
    };


    const handleSaveMealEdit = (updatedMeal) => {
        setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
        setEditItemData(null);
        setEditItemType(null);
        setCurrentPage('history');
    };


    const handleCancelEdit = () => {
        setEditItemData(null);
        setEditItemType(null);
        setCurrentPage('history');
    };


    // --- Delete Confirmation Handlers ---
    const handleDeleteClick = (id, type) => {
        setItemToDelete({ id, type });
        setDeleteType(type);
        setShowDeleteModal(true);
    };


    const confirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.type === 'workout') {
                setWorkouts(prev => prev.filter(w => w.id !== itemToDelete.id));
            } else if (itemToDelete.type === 'meal') {
                setMeals(prev => prev.filter(m => m.id !== itemToDelete.id));
            }
            alert(`The ${itemToDelete.type} entry has been deleted.`); // Changed from confirm to alert
        }
        setShowDeleteModal(false);
        setItemToDelete(null);
        setDeleteType('');
    };


    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
        setDeleteType('');
    };


    // Calculate total workouts/meals for quick stats on HomePage
    const totalWorkouts = workouts.length;
    const totalMeals = meals.length;


    // Render the active page based on `currentPage` state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage
                    totalWorkouts={totalWorkouts}
                    totalMeals={totalMeals}
                    onAddActivity={handleNavigation} // This now correctly passes the type
                />;
            case 'add-activity':
                return <AddActivityPage
                    onSaveWorkout={handleSaveWorkout}
                    onSaveMeal={handleSaveMeal}
                    onCancel={() => handleNavigation('home')}
                    defaultTab={addActivityDefaultTab} // NEW: Pass the default tab as a prop
                />;
            case 'history':
                return <HistoryPage
                    workouts={workouts}
                    meals={meals}
                    onAddActivity={handleNavigation}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />;
            case 'edit-workout':
                return <EditWorkoutPage
                    initialData={editItemData}
                    onSaveEdit={handleSaveWorkoutEdit}
                    onCancelEdit={handleCancelEdit}
                />;
            case 'edit-meal':
                return <EditMealPage
                    initialData={editItemData}
                    onSaveEdit={handleSaveMealEdit}
                    onCancelEdit={handleCancelEdit}
                />;
            default:
                return <HomePage
                    totalWorkouts={totalWorkouts}
                    totalMeals={totalMeals}
                    onAddActivity={handleNavigation}
                />;
        }
    };


    return (
        <div className="App">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
            <main className="main-content-wrapper">
                {renderPage()}
            </main>

            <ConfirmationModal
                isVisible={showDeleteModal}
                message={`Are you sure you want to delete this ${deleteType} entry? Once deleted, it cannot be retrieved.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}


export default App;