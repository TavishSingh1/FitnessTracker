import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
    useParams,
} from 'react-router-dom';

import './App.css';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import AddActivityPage from './components/AddActivityPage';
import HistoryPage from './components/HistoryPage';
import EditWorkoutPage from './components/EditWorkoutPage';
import EditMealPage from './components/EditMealPage';
import ConfirmationModal from './components/ConfirmationModal';

export default function App() {
    const [workouts, setWorkouts] = useState([
        { id: 'w1', type: 'Running', intensity: 'Medium', duration: 34, calories: 340, date: '2024-12-11', time: '07:30' },
        { id: 'w2', type: 'Yoga', intensity: 'Slow', duration: 49, calories: 147, date: '2024-12-10', time: '08:00' },
        { id: 'w3', type: 'Weight Lifting', intensity: 'Intense', duration: 65, calories: 520, date: '2024-12-09', time: '17:30' },
    ]);

    const [meals, setMeals] = useState([
        { id: 'm1', item: 'Oatmeal with Berries', calories: 320, date: '2024-12-11', time: '08:00' },
        { id: 'm2', item: 'Chicken Salad Sandwich', calories: 450, date: '2024-12-11', time: '13:00' },
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(''); 

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (page, defaultTab = 'workout') => {
        switch (page) {
            case 'home': navigate('/'); break;
            case 'add-activity': navigate(`/add-activity/${defaultTab}`); break;
            case 'history': navigate('/history'); break;
            default: navigate('/'); break;
        }
    };

    const handleSaveWorkout = (newWorkout) => {
        setWorkouts(prev => [...prev, { ...newWorkout, id: `w${prev.length + 1}` }]);
        navigate('/history');
    };

    const handleSaveMeal = (newMeal) => {
        setMeals(prev => [...prev, { ...newMeal, id: `m${prev.length + 1}` }]);
        navigate('/history');
    };

    const handleSaveWorkoutEdit = (updatedWorkout) => {
        setWorkouts(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
        navigate('/history');
    };

    const handleSaveMealEdit = (updatedMeal) => {
        setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
        navigate('/history');
    };

    const handleDeleteClick = (id, type) => {
        setItemToDelete({ id, type });
        setDeleteType(type);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.type === 'workout') {
                setWorkouts(prev => prev.filter(w => w.id !== itemToDelete.id));
            } else {
                setMeals(prev => prev.filter(m => m.id !== itemToDelete.id));
            }
            alert(`The ${itemToDelete.type} entry has been deleted.`);
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

    const currentPage = (() => {
        if (location.pathname.startsWith('/add-activity')) return 'add-activity';
        if (location.pathname.startsWith('/edit-workout')) return 'edit-workout';
        if (location.pathname.startsWith('/edit-meal')) return 'edit-meal';
        switch (location.pathname) {
            case '/history': return 'history';
            case '/': return 'home';
            default: return 'home';
        }
    })();

    return (
        <>
            <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />

            <main className="main-content-wrapper">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                totalWorkouts={workouts.length}
                                totalMeals={meals.length}
                                onAddActivity={handleNavigation}
                            />
                        }
                    />

                    <Route
                        path="/add-activity/:tab?"
                        element={<AddActivityRoute
                            onSaveWorkout={handleSaveWorkout}
                            onSaveMeal={handleSaveMeal}
                            onCancel={() => navigate('/')}
                        />}
                    />

                    <Route
                        path="/history"
                        element={
                            <HistoryPage
                                workouts={workouts}
                                meals={meals}
                                onAddActivity={handleNavigation}
                                onEdit={(id, type) =>
                                    navigate(type === 'workout' ? `/edit-workout/${id}` : `/edit-meal/${id}`)}
                                onDelete={handleDeleteClick}
                            />
                        }
                    />

                    <Route
                        path="/edit-workout/:id"
                        element={<EditWorkoutRoute
                            workouts={workouts}
                            onSaveEdit={handleSaveWorkoutEdit}
                            onCancelEdit={() => navigate('/history')}
                        />}
                    />

                    <Route
                        path="/edit-meal/:id"
                        element={<EditMealRoute
                            meals={meals}
                            onSaveEdit={handleSaveMealEdit}
                            onCancelEdit={() => navigate('/history')}
                        />}
                    />

                    <Route path="*" element={<HomePage
                        totalWorkouts={workouts.length}
                        totalMeals={meals.length}
                        onAddActivity={handleNavigation}
                    />} />
                </Routes>
            </main>

            <ConfirmationModal
                isVisible={showDeleteModal}
                message={`Are you sure you want to delete this ${deleteType} entry? Once deleted, it cannot be retrieved.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </>
    );
}

function AddActivityRoute({ onSaveWorkout, onSaveMeal, onCancel }) {
    const { tab } = useParams();
    return (
        <AddActivityPage
            onSaveWorkout={onSaveWorkout}
            onSaveMeal={onSaveMeal}
            onCancel={onCancel}
            defaultTab={tab || 'workout'}
        />
    );
}

function EditWorkoutRoute({ workouts, onSaveEdit, onCancelEdit }) {
    const { id } = useParams();
    const workout = workouts.find(w => w.id === id);
    return (
        <EditWorkoutPage
            initialData={workout}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
        />
    );
}

function EditMealRoute({ meals, onSaveEdit, onCancelEdit }) {
    const { id } = useParams();
    const meal = meals.find(m => m.id === id);
    return (
        <EditMealPage
            initialData={meal}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
        />
    );
}
