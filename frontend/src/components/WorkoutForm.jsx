import { useState, useEffect, useRef } from "react"
import { FaFire } from "react-icons/fa"
import AutocompleteInput from "./AutocompleteInput"
import { exerciseService } from "../services/exerciseService"

function WorkoutForm({ exercises, initialData = {}, onSave, onCancel, isEdit = false }) {
  // Helper to get value from initialData or its exercise
  const getInitial = (field, fallback = "") => {
    if (initialData[field] !== undefined && initialData[field] !== null && initialData[field] !== "") return initialData[field]
    if (initialData.exercise && initialData.exercise[field] !== undefined && initialData.exercise[field] !== null && initialData.exercise[field] !== "") return initialData.exercise[field]
    return fallback
  }

  // Default date/time for add mode
  const getTodayDate = () => new Date().toISOString().split("T")[0]
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5)

  // Track if user has manually edited a field
  const userEdited = useRef({})

  const [workoutType, setWorkoutType] = useState(getInitial("type", ""))
  const [duration, setDuration] = useState(getInitial("duration", isEdit ? "" : ""))
  const [intensity, setIntensity] = useState(getInitial("intensity", isEdit ? "medium" : "medium"))
  const [workoutDate, setWorkoutDate] = useState(isEdit ? (initialData.date ? initialData.date.split("T")[0] : "") : getTodayDate())
  const [workoutTime, setWorkoutTime] = useState(isEdit ? (initialData.date ? new Date(initialData.date).toTimeString().slice(0,5) : "") : getCurrentTime())
  const [description, setDescription] = useState(getInitial("description", ""))
  const [caloriesBurned, setCaloriesBurned] = useState(getInitial("caloriesBurned", getInitial("calories", "")))
  const [isNewExercise, setIsNewExercise] = useState(false)
  const [baseExercise, setBaseExercise] = useState(null)
  const [calculatedBurnedCalories, setCalculatedBurnedCalories] = useState(0)

  // When initialData changes (e.g. after fetch), update all fields (edit mode only)
  useEffect(() => {
    if (isEdit) {
      setWorkoutType(getInitial("type", ""))
      setDuration(getInitial("duration", ""))
      setIntensity(getInitial("intensity", "medium"))
      setDescription(getInitial("description", ""))
      setCaloriesBurned(getInitial("caloriesBurned", getInitial("calories", "")))
      setWorkoutDate(initialData.date ? initialData.date.split("T")[0] : "")
      setWorkoutTime(initialData.date ? new Date(initialData.date).toTimeString().slice(0,5) : "")
    }
  }, [initialData, isEdit])

  // Only update fields from exercise if user hasn't edited them yet
  useEffect(() => {
    const found = exercises.find((ex) => ex.name.toLowerCase() === workoutType.toLowerCase())
    setIsNewExercise(!found)
    setBaseExercise(found || null)
    if (found) {
      if (!userEdited.current["intensity"]) setIntensity(found.intensity)
      if (!userEdited.current["description"]) setDescription(found.description || "")
      if (!userEdited.current["duration"]) setDuration(found.duration ? String(found.duration) : "")
      if (!userEdited.current["caloriesBurned"]) setCaloriesBurned(found.caloriesBurned)
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

  // Mark field as edited by user
  const handleFieldChange = (setter, field) => (val) => {
    userEdited.current[field] = true
    setter(val)
  }

  const handleSave = async () => {
    if (!workoutType || !duration || !workoutDate || !workoutTime || !intensity || !caloriesBurned) {
      alert("Please fill in all workout fields.")
      return
    }
    let exerciseId = baseExercise?._id || (initialData.exercise && initialData.exercise._id)
    // If editing an existing exercise, update it
    if (!isNewExercise && exerciseId) {
      const updatedExercise = {
        name: workoutType,
        intensity,
        description,
        duration: Number.parseFloat(duration),
        caloriesBurned: Number.parseFloat(caloriesBurned),
      }
      const result = await exerciseService.updateExercise(exerciseId, updatedExercise)
      if (!result.success) {
        alert(result.error || "Failed to update exercise")
        return
      }
    }
    // If new, create exercise first
    if (isNewExercise) {
      const newExercise = {
        name: workoutType,
        intensity,
        description,
        duration: Number.parseFloat(duration),
        caloriesBurned: Number.parseFloat(caloriesBurned),
      }
      const result = await exerciseService.addExercise(newExercise)
      const newEx = result?.data?.data || result?.data
      if (result.success && newEx && newEx._id) {
        exerciseId = newEx._id
      } else {
        alert(result.error || "Failed to add new exercise")
        return
      }
    }
    onSave({
      ...initialData,
      type: workoutType,
      duration: Number.parseFloat(duration),
      intensity,
      description,
      calories: Number.parseFloat(caloriesBurned),
      date: workoutDate,
      time: workoutTime,
      exercise: exerciseId,
    })
  }

  return (
    <div className="activity-box">
      <div className="activity-form">
        <div className="form-group">
          <label htmlFor="workoutType">Workout Type</label>
          <AutocompleteInput
            id="workoutType"
            options={exercises.map((ex) => ex.name)}
            value={workoutType}
            onChange={handleFieldChange(setWorkoutType, "workoutType")}
            placeholder="Type or select workout type"
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            placeholder="Enter duration"
            min="0"
            value={duration}
            onChange={e => handleFieldChange(setDuration, "duration")(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="intensity">Intensity</label>
          <select id="intensity" value={intensity} onChange={e => handleFieldChange(setIntensity, "intensity")(e.target.value)}>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="intense">Intense</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Optional description"
            value={description}
            onChange={e => handleFieldChange(setDescription, "description")(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="caloriesBurned">Calories Burned (kcal)</label>
          <input
            type="number"
            id="caloriesBurned"
            placeholder="Enter calories burned"
            min="0"
            value={caloriesBurned}
            onChange={e => handleFieldChange(setCaloriesBurned, "caloriesBurned")(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="workoutDate">Date</label>
          <input
            type="date"
            id="workoutDateElem"
            value={workoutDate}
            onChange={e => handleFieldChange(setWorkoutDate, "workoutDate")(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="workoutTime">Time</label>
          <input
            type="time"
            id="workoutTimeElem"
            value={workoutTime}
            onChange={e => handleFieldChange(setWorkoutTime, "workoutTime")(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button className="form-action-button" onClick={handleSave}>
            {isEdit ? "Save Changes" : "Save"}
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
  )
}

export default WorkoutForm
