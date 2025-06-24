import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';

function parseDateTimeFromISO(isoString) {
    if (!isoString) return { date: '', time: '' };
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '', time: '' };
    const date = d.toISOString().slice(0, 10);
    const time = d.toTimeString().slice(0, 5);
    return { date, time };
}

function EditMealPage({ initialData, onSaveEdit, onCancelEdit }) {

    const mealName = initialData?.name || initialData?.item || '';

    let dateVal = initialData?.date || '';
    let timeVal = initialData?.time || '';
    if (dateVal && !timeVal && typeof dateVal === 'string' && dateVal.includes('T')) {
        const parsed = parseDateTimeFromISO(dateVal);
        dateVal = parsed.date;
        timeVal = parsed.time;
    }
    const [foodItem, setFoodItem] = useState(mealName);
    const [calorieContent, setCalorieContent] = useState(initialData?.calories || '');
    const [mealDate, setMealDate] = useState(dateVal);
    const [mealTime, setMealTime] = useState(timeVal);

    const [calculatedGainedCalories, setCalculatedGainedCalories] = useState(initialData?.calories || 0);

    useEffect(() => {
        if (initialData) {
            setFoodItem(initialData.name || initialData.item || '');
            setCalorieContent(initialData.calories);
            let dateVal = initialData.date || '';
            let timeVal = initialData.time || '';
            if (dateVal && !timeVal && typeof dateVal === 'string' && dateVal.includes('T')) {
                const parsed = parseDateTimeFromISO(dateVal);
                dateVal = parsed.date;
                timeVal = parsed.time;
            }
            setMealDate(dateVal);
            setMealTime(timeVal);
            setCalculatedGainedCalories(initialData.calories);
        }
    }, [initialData]);

    useEffect(() => {
        const totalCals = parseFloat(calorieContent);
        setCalculatedGainedCalories(isNaN(totalCals) || totalCals < 0 ? 0 : Math.round(totalCals));
    }, [calorieContent]);

    const handleSave = () => {
        if (!foodItem || !calorieContent || !mealDate || !mealTime) {
            alert('Please make sure all meal fields are filled in.');
            return;
        }
        onSaveEdit({
            ...initialData,
            item: foodItem,
            calories: parseFloat(calorieContent),
            date: mealDate,
            time: mealTime
        });
    };

    return (
        <div className="main-edit-content">
            <h1 className="history-page-title">Edit Your Meal</h1>
            <div className="activity-box">
                <div className="activity-form">
                    <div className="form-group">
                        <label htmlFor="editFoodItem">Food Item</label>
                        <input
                            type="text"
                            id="editFoodItem"
                            placeholder="e.g., Chicken Breast, Apple"
                            value={foodItem}
                            onChange={e => setFoodItem(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editCalorieContent">Calorie Content (kcal)</label>
                        <input
                            type="number"
                            id="editCalorieContent"
                            placeholder="Enter calories"
                            min="0"
                            value={calorieContent}
                            onChange={e => setCalorieContent(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editMealDate">Date</label>
                        <input type="date" id="editMealDateElem" value={mealDate} onChange={e => setMealDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editMealTime">Time</label>
                        <input type="time" id="editMealTimeElem" value={mealTime} onChange={e => setMealTime(e.target.value)} />
                    </div>
                    <div className="form-actions">
                        <button className="form-action-button" onClick={handleSave}>Save Changes</button>
                        <button className="form-action-button cancel-button" onClick={onCancelEdit}>Cancel</button>
                    </div>
                </div>
                <div className="activity-result">
                    <div className="activity-result-label">Calories Gained</div>
                    <div className="calories-display-wrapper">
                        <FaFire className="fire-icon" />
                        <div className="calories-value">{calculatedGainedCalories}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditMealPage;