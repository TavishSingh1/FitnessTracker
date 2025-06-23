import React from 'react';

function ConfirmationModal({ isVisible, message, onConfirm, onCancel }) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="form-action-button" onClick={onConfirm}>Yes, Delete</button>
                    <button className="form-action-button cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;