import React from 'react';

function HistoryCard({ data, type, onEdit, onDelete }) {
    const isWorkout = type === 'workout';

    const formatDate = (dateStr, timeStr) => {
        let date;
        if (dateStr && !timeStr && !isNaN(Date.parse(dateStr))) {
            // dateStr is a full ISO string
            date = new Date(dateStr);
        } else if (dateStr && timeStr) {
            date = new Date(`${dateStr}T${timeStr}`);
        } else {
            date = new Date(dateStr); // fallback
        }
        if (isNaN(date.getTime())) return "Invalid date";
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${formattedDate} • ${formattedTime}`;
    };

    const getIcon = () => {
        if (isWorkout) {
            const workoutType = data.type || (data.exercise && data.exercise.name) || '';
            switch (workoutType) {
                case 'Running': return <i className="fas fa-running card-icon"></i>;
                case 'Yoga': return <i className="fas fa-child card-icon"></i>;
                case 'Strength Training': return <i className="fas fa-dumbbell card-icon"></i>;
                case 'Weight Lifting': return <i className="fas fa-dumbbell card-icon"></i>;
                case 'Swimming': return <i className="fas fa-swimmer card-icon"></i>;
                default: return <i className="fas fa-dumbbell card-icon"></i>;
            }
        } else {
            return <i className="fas fa-utensils card-icon"></i>;
        }
    };

    const getTitle = () => {
        if (isWorkout) {
            // Prefer data.type, then data.exercise.name, fallback to 'Workout'
            const typeVal = data.type && data.type.trim() ? data.type : (data.exercise && data.exercise.name && data.exercise.name.trim() ? data.exercise.name : "Workout");
            // Prefer data.intensity, then data.exercise.intensity, fallback to 'Medium'
            const intensityVal = data.intensity && data.intensity.trim() ? data.intensity : (data.exercise && data.exercise.intensity && data.exercise.intensity.trim() ? data.exercise.intensity : "Medium");
            return `${typeVal} - ${intensityVal} Intensity`;
        } else {
            return data.name || data.item || "Meal";
        }
    };

    const getCaloriesValue = () => {
        // Prefer data.calories, then data.caloriesBurned, then data.exercise.caloriesBurned, fallback to 0
        if (typeof data.calories === "number" && !isNaN(data.calories)) return data.calories;
        if (typeof data.caloriesBurned === "number" && !isNaN(data.caloriesBurned)) return data.caloriesBurned;
        if (data.exercise && typeof data.exercise.caloriesBurned === "number" && !isNaN(data.exercise.caloriesBurned)) return data.exercise.caloriesBurned;
        return 0;
    };

    const getCaloriesLabel = () => {
        return isWorkout ? 'kilocalories burnt' : 'kilocalories gained';
    };

    return (
        <div className="history-card">
            <div className="card-header">
                <div className="card-icon-standalone">
                    {getIcon()}
                </div>

                <div className="card-title-group">
                    <h3 className="card-title">{getTitle()}</h3>
                    <p className="card-subtitle">{formatDate(data.date, data.time)}</p>
                </div>
                <div className="calories-burnt-display">
                    <span className="calories-burnt-value">{getCaloriesValue()}</span>
                    <span className="calories-burnt-label">{getCaloriesLabel()}</span>
                </div>
            </div>
            <div className="card-footer">
                <div className="card-actions">
                    <button className="card-action-button edit-btn" onClick={() => onEdit(data._id, type)}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="card-action-button delete-btn" onClick={() => onDelete(data._id, type)}>
                        <i className="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;