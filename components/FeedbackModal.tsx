
import React, { useState, useEffect } from 'react';
import { XIcon, StarIcon } from './Icons';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal is closed
            setTimeout(() => {
                setRating(0);
                setComment('');
                setSubmitted(false);
                setError('');
            }, 300); // Delay to allow closing animation
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (rating === 0) {
            setError('Por favor, seleccione una calificación de estrellas.');
            return;
        }
        
        setError('');
        console.log('Feedback submitted:', { rating, comment });
        setSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 2000); // Close modal after 2 seconds
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md relative transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Enviar Feedback</h2>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                        aria-label="Cerrar modal"
                    >
                        <XIcon />
                    </button>
                </div>
                
                {submitted ? (
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-800">¡Gracias por tu opinión!</h3>
                        <p className="text-gray-600 mt-2">Valoramos tus comentarios para mejorar PacientIA.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Calificación*</label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none"
                                        >
                                            <StarIcon 
                                                className={`h-8 w-8 cursor-pointer transition-colors ${
                                                    (hoverRating || rating) >= star 
                                                        ? 'text-yellow-400' 
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comentarios (Opcional)</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="¿Qué te gusta? ¿Qué podríamos mejorar?"
                                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                                disabled={rating === 0}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
