import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FaPersonRunning } from 'react-icons/fa6';
import { FaChartBar, FaFire } from 'react-icons/fa';

function HomePage({ totalWorkouts, totalMeals, onAddActivity, userName }) {
  const dailyCaloriesChartRef = useRef(null);
  const monthlyWorkoutsChartRef = useRef(null);
  let dailyCaloriesChartInstance = useRef(null);
  let monthlyWorkoutsChartInstance = useRef(null);

  useEffect(() => {
    if (dailyCaloriesChartInstance.current) {
      dailyCaloriesChartInstance.current.destroy();
    }
    if (monthlyWorkoutsChartInstance.current) {
      monthlyWorkoutsChartInstance.current.destroy();
    }

    const dailyCaloriePlotData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories Burnt',
        data: [400, 550, 480, 620, 700, 900, 350],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 2,
        borderRadius: 5,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    };

    const dailyCaloriePlotOptions = {
      type: 'bar',
      data: dailyCaloriePlotData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#DC2626',
            borderWidth: 1,
            cornerRadius: 8,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(107, 114, 128, 0.5)' },
            ticks: { color: '#9CA3AF' }
          }
        }
      }
    };

    if (dailyCaloriesChartRef.current) {
      dailyCaloriesChartInstance.current = new Chart(dailyCaloriesChartRef.current.getContext('2d'), dailyCaloriePlotOptions);
    }

    const monthlyWorkoutPlotData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Total Workouts',
        data: [18, 22, 20, 25, 28, 23, 30, 27, 24, 26, 29, 32],
        fill: true,
        borderColor: 'rgba(220, 38, 38, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(220, 38, 38, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    };

    const monthlyWorkoutPlotOptions = {
      type: 'line',
      data: monthlyWorkoutPlotData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#DC2626',
            borderWidth: 1,
            cornerRadius: 8,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(107, 114, 128, 0.5)' },
            ticks: { color: '#9CA3AF', precision: 0 }
          }
        }
      }
    };

    if (monthlyWorkoutsChartRef.current) {
      monthlyWorkoutsChartInstance.current = new Chart(monthlyWorkoutsChartRef.current.getContext('2d'), monthlyWorkoutPlotOptions);
    }

    return () => {
      if (dailyCaloriesChartInstance.current) {
        dailyCaloriesChartInstance.current.destroy();
      }
      if (monthlyWorkoutsChartInstance.current) {
        monthlyWorkoutsChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="main-dashboard-content">
      <div className="dashboard-header">
        <div className="app-name">
          <span className="app-name-text">Pulse</span>
        </div>
        <div className="user-profile">
          <span className="user-greeting">Hello, {userName}</span>
        </div>
      </div>

      <section className="welcome-section">
        <h1 className="welcome-text">Welcome back!</h1>
      </section>

      <section className="quick-stats-section">
        <h2 className="section-title">Quick Stats</h2>
        <div className="quick-stats-action-buttons">
          <button className="general-button" onClick={() => onAddActivity('add-activity', 'workout')}>
            <i className="fas fa-plus"></i> Add Workout
          </button>
          <button className="general-button" onClick={() => onAddActivity('add-activity', 'meal')}>
            <i className="fas fa-utensils"></i> Add Meal
          </button>
        </div>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">
              <FaChartBar className="fas fa-chart-bar" />
            </div>
            <p className="stat-value" id="totalWorkouts">{totalWorkouts}</p>
            <p className="stat-label">Total Workouts Logged</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon">
              <FaFire className="fas fa-fire" />
            </div>
            <p className="stat-value" id="caloriesBurnt">850 <span className="kcal-unit">kcal</span></p>
            <p className="stat-label">Calories Burnt Today</p>
          </div>

          <div className="stat-box">
            <div className="stat-icon">
              <FaPersonRunning className="fas fa-running" />
            </div>
            <p className="stat-value" id="mostFrequentWorkout">Running</p>
            <p className="stat-label">Most Frequent Workout</p>
          </div>
        </div>
      </section>

      <section className="graphs-section">
        <h2 className="section-title">Your Progress</h2>
        <div className="graphs-grid">
          <div className="chart-container">
            <h3 className="chart-title">Daily Calories Burnt</h3>
            <canvas ref={dailyCaloriesChartRef} className="chart-canvas"></canvas>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Monthly Workouts</h3>
            <canvas ref={monthlyWorkoutsChartRef} className="chart-canvas"></canvas>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
