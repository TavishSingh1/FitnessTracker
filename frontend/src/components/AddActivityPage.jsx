"use client"

import { useState, useEffect } from "react"
import { FaFire } from "react-icons/fa"

function AddActivityPage({ exercises, onSaveWorkout, onSaveMeal, onCancel, defaultTab }) {
  const [activeForm, setActiveForm] = useState("workout")

  const [workoutType, setWorkoutType] = useState("")
  const [duration, setDuration] = useState("")
  const [intensity, setIntensity] = useState("medium")
  const [workoutDate, setWorkoutDate] = useState("")
  const [workoutTime, setWorkoutTime] = useState("")
  const [calculatedBurnedCalories, setCalculatedBurnedCalories] = useState(0)

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
    const durMinutes = Number.parseFloat(duration)
    if (isNaN(durMinutes) || durMinutes <= 0) {
      setCalculatedBurnedCalories(0)
      return
    }

    const selectedExercise = exercises.find((ex) => ex.name === workoutType)
    if (!selectedExercise) {
      setCalculatedBurnedCalories(0)
      return
    }

    let intensityFactor = 1
    switch (intensity) {
      case "slow":
        intensityFactor = 0.8
        break
      case "medium":
        intensityFactor = 1
        break
      case "intense":
        intensityFactor = 1.2
        break
      default:
        intensityFactor = 1
    }

    const baseCalories = selectedExercise.caloriesBurned
    const baseDuration = selectedExercise.duration
    const caloriesPerMinute = baseCalories / baseDuration

    const totalCalculatedCals = durMinutes * caloriesPerMinute * intensityFactor
    setCalculatedBurnedCalories(Math.round(totalCalculatedCals))
  }, [workoutType, duration, intensity, exercises])

  useEffect(() => {
    const totalCals = Number.parseFloat(calorieContent)
    if (isNaN(totalCals) || totalCals < 0) {
      setCalculatedGainedCalories(0)
    } else {
      setCalculatedGainedCalories(Math.round(totalCals))
    }
  }, [calorieContent])

  const handleWorkoutSave = () => {
    if (!workoutType || !duration || !workoutDate || !workoutTime) {
      alert("Please fill in all workout fields.")
      return
    }
    onSaveWorkout({
      type: workoutType,
      duration: Number.parseFloat(duration),
      intensity: intensity,
      calories: calculatedBurnedCalories,
      date: workoutDate,
      time: workoutTime,
    })

    // Reset form
    setWorkoutType(exercises.length > 0 ? exercises[0].name : "")
    setDuration("")
    setIntensity("medium")
    setWorkoutDate(getTodayDate())
    setWorkoutTime(getCurrentTime())
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

    // Reset form
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
        <div className="activity-box">
          <div className="activity-form">
            <div className="form-group">
              <label htmlFor="workoutType">Workout Type</label>
              <select id="workoutType" value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                {exercises.map((exercise) => (
                  <option key={exercise._id} value={exercise.name}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                placeholder="Enter duration"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="intensity">Intensity</label>
              <select id="intensity" value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="intense">Intense</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="workoutDate">Date</label>
              <input
                type="date"
                id="workoutDateElem"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="workoutTime">Time</label>
              <input
                type="time"
                id="workoutTimeElem"
                value={workoutTime}
                onChange={(e) => setWorkoutTime(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="form-action-button" onClick={handleWorkoutSave}>
                Save
              </button>
              <button className="form-action-button cancel-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
          <div className="activity-result">
            <div className="activity-result-label">Calories Burnt</div>
            <div className="calories-display-wrapper">
              <FaFire className="fire-icon" />
              <div className="calories-value">{calculatedBurnedCalories}</div>
            </div>
          </div>
        </div>
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
