import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'

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
                borderRadius: '4px',
                width: '75vw',
                position:'relative'
            }}>
                <button onClick={onClose} className='absolute top-4 right-4'><XMarkIcon className='size-6'></XMarkIcon></button>
                <div>{content}</div>
            </div>
        </div>
    );
};

export default Modal;
