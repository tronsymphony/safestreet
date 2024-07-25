// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                width: '50%',
            }}>
                <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>Close</button>
                <div>{content}</div>
            </div>
        </div>
    );
};

export default Modal;
