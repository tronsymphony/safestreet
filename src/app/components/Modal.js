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
            zIndex:100,
        }}>
            <div
            className='max-w-4xl'
            style={{
                background: '#fff',
                borderRadius: '4px',
                position:'relative'
            }}>
                <button onClick={onClose} className='absolute top-4 right-4 bg-white hover:bg-yellow-400 z-20'><XMarkIcon className='size-6'></XMarkIcon></button>
                <div className='relative z-10'>{content}</div>
            </div>
        </div>
    );
};

export default Modal;
