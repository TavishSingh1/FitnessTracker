import React, { useState } from 'react';
import HistoryCard from './HistoryCard';

function HistoryPage({ workouts, meals, onAddActivity, onEdit, onDelete }) {
    const [activeHistoryList, setActiveHistoryList] = useState('workout');

    const totalEntries = activeHistoryList === 'workout' ? workouts.length : meals.length;

    return (
        <div className="main-history-content">
            <div className="history-header">
                <div className="history-title-group">
                    <h1 className="history-page-title">
                        {activeHistoryList === 'workout' ? 'Workout History' : 'Meal History'}
                    </h1>
                    <p className="history-subtitle">Track your fitness journey and celebrate your progress</p>
                </div>
                <div className="total-count">
                    {totalEntries} Total {activeHistoryList === 'workout' ? 'Workouts' : 'Meals'}
                </div>
            </div>

            <div className="history-controls">
                <div className="history-type-toggle">
                    <button
                        className={`dual-button ${activeHistoryList === 'workout' ? 'active-toggle' : ''}`}
                        onClick={() => setActiveHistoryList('workout')}
                    >
                        Workout
                    </button>
                    <button
                        className={`dual-button ${activeHistoryList === 'meal' ? 'active-toggle' : ''}`}
                        onClick={() => setActiveHistoryList('meal')}
                    >
                        Meal
                    </button>
                </div>
                <button
                    className="history-add-button"
                    onClick={() => onAddActivity('add-activity', activeHistoryList)}
                >
                    <i className="fas fa-plus-circle"></i>{' '}
                    {activeHistoryList === 'workout' ? 'Add New Workout' : 'Add New Meal'}
                </button>
            </div>

            <div className="history-list">
                {activeHistoryList === 'workout' ? (
                    workouts.length > 0 ? (
                        workouts.map(workout => (
                            <HistoryCard
                                key={workout.id}
                                data={workout}
                                type="workout"
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <p style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '2rem' }}>No workouts logged yet. Add one!</p>
                    )
                ) : (
                    meals.length > 0 ? (
                        meals.map(meal => (
                            <HistoryCard
                                key={meal.id}
                                data={meal}
                                type="meal"
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <p style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '2rem' }}>No meals logged yet. Add one!</p>
                    )
                )}
            </div>
        </div>
    );
}

export default HistoryPage;