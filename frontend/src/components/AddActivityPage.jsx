import { useState, useEffect } from "react"
import { FaFire } from "react-icons/fa"
import AutocompleteInput from "./AutocompleteInput"
import { exerciseService } from "../services/exerciseService"
import { activityService } from "../services/activityService"
import WorkoutForm from "./WorkoutForm"

function AddActivityPage({ exercises, onSaveWorkout, onSaveMeal, onCancel, defaultTab }) {
    const [activeForm, setActiveForm] = useState("workout")

    const [workoutType, setWorkoutType] = useState("")
    const [duration, setDuration] = useState("")
    const [intensity, setIntensity] = useState("medium")
    const [workoutDate, setWorkoutDate] = useState("")
    const [workoutTime, setWorkoutTime] = useState("")
    const [calculatedBurnedCalories, setCalculatedBurnedCalories] = useState(0)
    const [description, setDescription] = useState("")
    const [caloriesBurned, setCaloriesBurned] = useState("")
    const [isNewExercise, setIsNewExercise] = useState(false)
    const [baseExercise, setBaseExercise] = useState(null)

    const [foodItem, setFoodItem] = useState("")
    const [calorieContent, setCalorieContent] = useState("")
    const [mealDate, setMealDate] = useState("")
    const [mealTime, setMealTime] = useState("")
    const [calculatedGainedCalories, setCalculatedGainedCalories] = useState(0)

    const getTodayDate = () => new Date().toISOString().split("T")[0]
    const getCurrentTime = () => new Date().toTimeString().slice(0, 5)

    useEffect(() => {
        const today = getTodayDate()
        const now = getCurrentTime()
        setWorkoutDate(today)
        setWorkoutTime(now)
        setMealDate(today)
        setMealTime(now)

        if (defaultTab) {
            setActiveForm(defaultTab)
        }

        if (exercises && exercises.length > 0) {
            setWorkoutType(exercises[0].name)
        }
    }, [defaultTab, exercises])

    useEffect(() => {

        const found = exercises.find((ex) => ex.name.toLowerCase() === workoutType.toLowerCase())
        setIsNewExercise(!found)
        setBaseExercise(found || null)
        if (found) {
            setIntensity(found.intensity)
            setDescription(found.description || "")
            setDuration(found.duration)
            setCaloriesBurned(found.caloriesBurned)
        } else {
            setIntensity("medium")
            setDescription("")
            setDuration("")
            setCaloriesBurned("")
        }
    }, [workoutType, exercises])

    useEffect(() => {

        const durMinutes = Number.parseFloat(duration)
        const cals = Number.parseFloat(caloriesBurned)
        if (isNaN(durMinutes) || durMinutes <= 0 || isNaN(cals) || cals <= 0) {
            setCalculatedBurnedCalories(0)
            return
        }
        setCalculatedBurnedCalories(Math.round(cals))
    }, [duration, caloriesBurned])

    useEffect(() => {
        const totalCals = Number.parseFloat(calorieContent)
        if (isNaN(totalCals) || totalCals < 0) {
            setCalculatedGainedCalories(0)
        } else {
            setCalculatedGainedCalories(Math.round(totalCals))
        }
    }, [calorieContent])

    const handleWorkoutSave = async () => {
        if (!workoutType || !duration || !workoutDate || !workoutTime || !intensity || !caloriesBurned) {
            alert("Please fill in all workout fields.")
            return
        }
        let exerciseId = baseExercise?._id

        if (isNewExercise) {
            const newExercise = {
                name: workoutType,
                intensity,
                description,
                duration: Number.parseFloat(duration),
                caloriesBurned: Number.parseFloat(caloriesBurned),
            }
            const result = await exerciseService.addExercise(newExercise)

            const newEx = result?.data?.data || result?.data;
            if (result.success && newEx && newEx._id) {
                exerciseId = newEx._id
            } else {
                alert(result.error || "Failed to add new exercise")
                return
            }
        }

        const activityData = {
            type: workoutType,
            duration: Number.parseFloat(duration),
            intensity,
            calories: Number.parseFloat(caloriesBurned),
            date: workoutDate,
            time: workoutTime,
            exercise: exerciseId,
        }
        onSaveWorkout(activityData)

        setWorkoutType("")
        setDuration("")
        setIntensity("medium")
        setWorkoutDate(getTodayDate())
        setWorkoutTime(getCurrentTime())
        setDescription("")
        setCaloriesBurned("")
    }

    const handleMealSave = () => {
        if (!foodItem || !calorieContent || !mealDate || !mealTime) {
            alert("Please fill in all meal fields.")
            return
        }
        onSaveMeal({
            item: foodItem,
            calories: Number.parseFloat(calorieContent),
            date: mealDate,
            time: mealTime,
        })


        setFoodItem("")
        setCalorieContent("")
        setMealDate(getTodayDate())
        setMealTime(getCurrentTime())
    }

    return (
        <div className="main-activity-content">
            <div className="dual-button-container">
                <button
                    className={`dual-button ${activeForm === "workout" ? "active-toggle" : ""}`}
                    onClick={() => setActiveForm("workout")}
                >
                    New Workout
                </button>
                <button
                    className={`dual-button ${activeForm === "meal" ? "active-toggle" : ""}`}
                    onClick={() => setActiveForm("meal")}
                >
                    New Meal
                </button>
            </div>
            {activeForm === "workout" && (
                <WorkoutForm
                    exercises={exercises}
                    onSave={onSaveWorkout}
                    onCancel={onCancel}
                />
            )}

            {activeForm === "meal" && (
                <div className="activity-box">
                    <div className="activity-form">
                        <div className="form-group">
                            <label htmlFor="foodItem">Food Item</label>
                            <input
                                type="text"
                                id="foodItem"
                                placeholder="e.g., Chicken Breast, Apple"
                                value={foodItem}
                                onChange={(e) => setFoodItem(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="calorieContent">Calorie Content (kcal)</label>
                            <input
                                type="number"
                                id="calorieContent"
                                placeholder="Enter calories"
                                min="0"
                                value={calorieContent}
                                onChange={(e) => setCalorieContent(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mealDate">Date</label>
                            <input type="date" id="mealDateElem" value={mealDate} onChange={(e) => setMealDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mealTime">Time</label>
                            <input type="time" id="mealTimeElem" value={mealTime} onChange={(e) => setMealTime(e.target.value)} />
                        </div>
                        <div className="form-actions">
                            <button className="form-action-button" onClick={handleMealSave}>
                                Save
                            </button>
                            <button className="form-action-button cancel-button" onClick={onCancel}>
                                Cancel
                            </button>
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
            )}
        </div>
    )
}

export default AddActivityPage
