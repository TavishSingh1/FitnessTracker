import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';

function EditWorkoutPage({ initialData, onSaveEdit, onCancelEdit }) {
    const [workoutType, setWorkoutType] = useState(initialData?.type || 'running');
    const [duration, setDuration] = useState(String(initialData?.duration || ''));
    const [intensity, setIntensity] = useState(initialData?.intensity || 'medium');
    const [workoutDate, setWorkoutDate] = useState(initialData?.date || '');
    const [workoutTime, setWorkoutTime] = useState(initialData?.time || '');

    const [displayedCalories, setDisplayedCalories] = useState(initialData?.calories || 0);

    const calculateCaloriesValue = (type, dur, intens) => {
        const durMinutes = parseFloat(dur);
        if (isNaN(durMinutes) || durMinutes <= 0) {
            return 0;
        }

        const lowerCaseType = type.toLowerCase();

        let calsPerMin = 0;
        switch (lowerCaseType) {
            case 'running': calsPerMin = 8; break;
            case 'yoga': calsPerMin = 3; break;
            case 'strength training': calsPerMin = 7; break;
            case 'weight lifting': calsPerMin = 7; break;
            case 'swimming': calsPerMin = 7; break;
            case 'cycling': calsPerMin = 6; break;
            default: calsPerMin = 0;
        }

        let intensityFactor = 1;
        switch (intens) {
            case 'slow': intensityFactor = 0.8; break;
            case 'medium': intensityFactor = 1; break;
            case 'intense': intensityFactor = 1.2; break;
            default: intensityFactor = 1;
        }

        const totalCalculatedCals = durMinutes * calsPerMin * intensityFactor;
        return Math.round(totalCalculatedCals);
    };

    useEffect(() => {
        if (initialData) {
            setWorkoutType(initialData.type || 'running');
            setDuration(String(initialData.duration || ''));
            setIntensity(initialData.intensity || 'medium');
            setWorkoutDate(initialData.date || '');
            setWorkoutTime(initialData.time || '');
            setDisplayedCalories(initialData.calories || 0);
        } else {
            setWorkoutType('running');
            setDuration('');
            setIntensity('medium');
            setWorkoutDate('');
            setWorkoutTime('');
            setDisplayedCalories(0);
        }
    }, [initialData]);

    useEffect(() => {
        const newCalculatedCals = calculateCaloriesValue(workoutType, duration, intensity);
        setDisplayedCalories(newCalculatedCals);
    }, [workoutType, duration, intensity]);

    const handleSave = () => {
        if (!duration || parseFloat(duration) <= 0 || !workoutDate || !workoutTime) {
            alert('Please fill in all workout fields correctly (duration must be greater than 0).');
            return;
        }

        onSaveEdit({
            ...initialData,
            type: workoutType,
            duration: parseFloat(duration),
            intensity: intensity,
            calories: displayedCalories,
            date: workoutDate,
            time: workoutTime
        });
    };

    return (
        <div className="main-edit-content">
            <h1 className="history-page-title">Edit Your Workout</h1>
            <div className="activity-box custom-dark-shadow">
                <div className="activity-form">
                    <div className="form-group">
                        <label htmlFor="editWorkoutType">Workout Type</label>
                        <select
                            id="editWorkoutType"
                            value={workoutType}
                            onChange={(e) => setWorkoutType(e.target.value)}
                        >
                            <option value="Running">Running</option>
                            <option value="Yoga">Yoga</option>
                            <option value="Strength Training">Strength Training</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Cycling">Cycling</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="editDuration">Duration (minutes)</label>
                        <input
                            type="number"
                            id="editDuration"
                            placeholder="Enter duration"
                            min="0"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editIntensity">Intensity</label>
                        <select
                            id="editIntensity"
                            value={intensity}
                            onChange={(e) => setIntensity(e.target.value)}
                        >
                            <option value="slow">Slow</option>
                            <option value="medium">Medium</option>
                            <option value="intense">Intense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="editWorkoutDate">Date</label>
                        <input
                            type="date"
                            id="editWorkoutDateElem"
                            value={workoutDate}
                            onChange={(e) => setWorkoutDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editWorkoutTime">Time</label>
                        <input
                            type="time"
                            id="editWorkoutTimeElem"
                            value={workoutTime}
                            onChange={(e) => setWorkoutTime(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button className="form-action-button" onClick={handleSave}>Save Changes</button>
                        <button className="form-action-button cancel-button" onClick={onCancelEdit}>Cancel</button>
                    </div>
                </div>
                <div className="activity-result">
                    <div className="activity-result-label">Calories Burnt</div>
                    <div className="calories-display-wrapper">
                        <FaFire className="fire-icon" />
                        <div className="calories-value">{displayedCalories}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditWorkoutPage;