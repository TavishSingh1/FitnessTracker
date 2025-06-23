import React from 'react';

function HistoryCard({ data, type, onEdit, onDelete }) {
    const isWorkout = type === 'workout';

    const formatDate = (dateStr, timeStr) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${formattedDate} • ${formattedTime}`;
    };

    const getIcon = () => {
        if (isWorkout) {
            switch (data.type) {
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
            return `${data.type} - ${data.intensity} Intensity`;
        } else {
            return data.item;
        }
    };

    const getCaloriesLabel = () => {
        return isWorkout ? 'calories burnt' : 'calories gained';
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
                    <span className="calories-burnt-value">{data.calories}</span>
                    <span className="calories-burnt-label">{getCaloriesLabel()}</span>
                </div>
            </div>
            <div className="card-footer">
                <div className="card-actions">
                    <button className="card-action-button edit-btn" onClick={() => onEdit(data.id, type)}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="card-action-button delete-btn" onClick={() => onDelete(data.id, type)}>
                        <i className="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;