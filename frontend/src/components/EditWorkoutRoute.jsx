import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditWorkoutPage from './EditWorkoutPage';
import { activityService } from '../services/activityService';

function EditWorkoutRoute({ exercises, onSaveEdit, onCancelEdit }) {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchWorkout() {
            setLoading(true);
            setError(null);
            try {
                const response = await activityService.getActivityById(id);
                if (response.success) {
                    setWorkout(response.data);
                } else {
                    setError(response.error || 'Failed to fetch workout');
                }
            } catch (err) {
                setError('Failed to fetch workout');
            } finally {
                setLoading(false);
            }
        }
        fetchWorkout();
    }, [id]);

    if (loading) return <div>Loading workout...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!workout) return <div>Workout not found</div>;

    return (
        <EditWorkoutPage initialData={workout} exercises={exercises} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} />
    );
}

export default EditWorkoutRoute;
