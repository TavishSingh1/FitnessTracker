"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom"

import "./App.css"
import Sidebar from "./components/Sidebar"
import HomePage from "./components/HomePage"
import AddActivityPage from "./components/AddActivityPage"
import HistoryPage from "./components/HistoryPage"
import EditWorkoutPage from "./components/EditWorkoutPage"
import EditMealPage from "./components/EditMealPage"
import ConfirmationModal from "./components/ConfirmationModal"

import { activityService } from "./services/activityService"
import { foodService } from "./services/foodService"
import { exerciseService } from "./services/exerciseService"

export default function App({ userName, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [activities, setActivities] = useState([])
  const [foods, setFoods] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState("")

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load exercises
      const exercisesResult = await exerciseService.getAllExercises()
      if (exercisesResult.success) {
        setExercises(exercisesResult.data)
      }

      // Load activities
      const activitiesResult = await activityService.getAllActivities()
      if (activitiesResult.success) {
        setActivities(activitiesResult.data)
      }

      // Load foods
      const foodsResult = await foodService.getAllFoods()
      if (foodsResult.success) {
        setFoods(foodsResult.data)
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigation = (page, defaultTab = "workout") => {
    switch (page) {
      case "home":
        navigate("/")
        break
      case "add-activity":
        navigate(`/add-activity/${defaultTab}`)
        break
      case "history":
        navigate("/history")
        break
      default:
        navigate("/")
        break
    }
  }

  const handleSaveWorkout = async (newWorkout) => {
    try {
      // Find the exercise by type
      const exercise = exercises.find((ex) => ex.name.toLowerCase() === newWorkout.type.toLowerCase())

      if (!exercise) {
        alert("Exercise type not found")
        return
      }

      const activityData = {
        user: "current-user-id", // You'll need to get the actual user ID
        exercise: exercise._id,
        duration: newWorkout.duration,
        date: new Date(`${newWorkout.date}T${newWorkout.time}`),
      }

      const result = await activityService.addActivity(activityData)
      if (result.success) {
        await loadInitialData() // Reload data
        navigate("/history")
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert("Failed to save workout")
    }
  }

  const handleSaveMeal = async (newMeal) => {
    try {
      const foodData = {
        user: "current-user-id", // You'll need to get the actual user ID
        name: newMeal.item,
        calories: newMeal.calories,
        date: new Date(`${newMeal.date}T${newMeal.time}`),
      }

      const result = await foodService.addFood(foodData)
      if (result.success) {
        await loadInitialData() // Reload data
        navigate("/history")
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert("Failed to save meal")
    }
  }

  const handleSaveWorkoutEdit = async (updatedWorkout) => {
    try {
      const result = await activityService.updateActivity(updatedWorkout._id, updatedWorkout)
      if (result.success) {
        await loadInitialData() // Reload data
        navigate("/history")
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert("Failed to update workout")
    }
  }

  const handleSaveMealEdit = async (updatedMeal) => {
    try {
      const result = await foodService.updateFood(updatedMeal._id, updatedMeal)
      if (result.success) {
        await loadInitialData() // Reload data
        navigate("/history")
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert("Failed to update meal")
    }
  }

  const handleDeleteClick = (id, type) => {
    setItemToDelete({ id, type })
    setDeleteType(type)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        let result
        if (itemToDelete.type === "workout") {
          result = await activityService.deleteActivity(itemToDelete.id)
        } else {
          result = await foodService.deleteFood(itemToDelete.id)
        }

        if (result.success) {
          await loadInitialData() // Reload data
          alert(`The ${itemToDelete.type} entry has been deleted.`)
        } else {
          alert(result.error)
        }
      } catch (error) {
        alert(`Failed to delete ${itemToDelete.type}`)
      }
    }
    setShowDeleteModal(false)
    setItemToDelete(null)
    setDeleteType("")
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
    setDeleteType("")
  }

  const currentPage = (() => {
    if (location.pathname.startsWith("/add-activity")) return "add-activity"
    if (location.pathname.startsWith("/edit-workout")) return "edit-workout"
    if (location.pathname.startsWith("/edit-meal")) return "edit-meal"
    switch (location.pathname) {
      case "/history":
        return "history"
      case "/":
        return "home"
      default:
        return "home"
    }
  })()

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to bottom right, #1f2937, #111827, #000000)",
          color: "#f3f4f6",
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigation} onLogout={onLogout} />
      <main className="main-content-wrapper">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                totalWorkouts={activities.length}
                totalMeals={foods.length}
                userName={userName}
                onAddActivity={handleNavigation}
                activities={activities}
                foods={foods}
              />
            }
          />
          <Route
            path="/add-activity/:tab?"
            element={
              <AddActivityRoute
                exercises={exercises}
                onSaveWorkout={handleSaveWorkout}
                onSaveMeal={handleSaveMeal}
                onCancel={() => navigate("/")}
              />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage
                workouts={activities}
                meals={foods}
                onAddActivity={handleNavigation}
                onEdit={(id, type) => navigate(type === "workout" ? `/edit-workout/${id}` : `/edit-meal/${id}`)}
                onDelete={handleDeleteClick}
              />
            }
          />
          <Route
            path="/edit-workout/:id"
            element={
              <EditWorkoutRoute
                workouts={activities}
                exercises={exercises}
                onSaveEdit={handleSaveWorkoutEdit}
                onCancelEdit={() => navigate("/history")}
              />
            }
          />
          <Route
            path="/edit-meal/:id"
            element={
              <EditMealRoute meals={foods} onSaveEdit={handleSaveMealEdit} onCancelEdit={() => navigate("/history")} />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ConfirmationModal
        isVisible={showDeleteModal}
        message={`Are you sure you want to delete this ${deleteType} entry? Once deleted, it cannot be retrieved.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

function AddActivityRoute({ exercises, onSaveWorkout, onSaveMeal, onCancel }) {
  const { tab } = useParams()
  return (
    <AddActivityPage
      exercises={exercises}
      onSaveWorkout={onSaveWorkout}
      onSaveMeal={onSaveMeal}
      onCancel={onCancel}
      defaultTab={tab || "workout"}
    />
  )
}

function EditWorkoutRoute({ workouts, exercises, onSaveEdit, onCancelEdit }) {
  const { id } = useParams()
  const workout = workouts.find((w) => w._id === id)
  return (
    <EditWorkoutPage initialData={workout} exercises={exercises} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} />
  )
}

function EditMealRoute({ meals, onSaveEdit, onCancelEdit }) {
  const { id } = useParams()
  const meal = meals.find((m) => m._id === id)
  return <EditMealPage initialData={meal} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} />
}
