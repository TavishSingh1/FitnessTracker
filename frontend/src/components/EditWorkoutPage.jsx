import React from 'react';
import WorkoutForm from './WorkoutForm';

function EditWorkoutPage({ initialData, exercises, onSaveEdit, onCancelEdit }) {
    return (
        <div className="main-activity-content">
            <WorkoutForm
                exercises={exercises}
                initialData={initialData}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                isEdit={true}
            />
        </div>
    );
}

export default EditWorkoutPage;