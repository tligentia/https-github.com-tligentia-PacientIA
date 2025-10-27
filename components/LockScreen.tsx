
import React, { useState, useRef, useEffect } from 'react';
import { BotIcon } from './Icons';

interface LockScreenProps {
    onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const pinInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        pinInputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validPins = ['7887', 'STAR'];

        if (validPins.includes(pin.toUpperCase())) {
            setError('');
            onUnlock();
        } else {
            setError('PIN no válido. Inténtelo de nuevo.');
            setPin('');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 820); // Match animation duration
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8 text-indigo-600">
                    <BotIcon />
                    <span className="font-semibold text-2xl mt-2">Pacient<span className="text-red-600">IA</span></span>
                </div>
                <div className={`bg-white rounded-lg shadow-lg p-8 ${isShaking ? 'animate-shake' : ''}`}>
                    <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">Acceso Protegido</h2>
                    <p className="text-center text-gray-500 mb-6 text-sm">Por favor, ingrese su PIN para continuar.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                ref={pinInputRef}
                                type="password"
                                value={pin}
                                onChange={(e) => {
                                    setPin(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="****"
                                autoComplete="off"
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs text-center -my-3">{error}</p>
                        )}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                                disabled={!pin}
                            >
                                Desbloquear
                            </button>
                        </div>
                    </form>
                </div>
                <p className="text-center text-xs text-gray-400 mt-6">
                    Esta es una aplicación de demostración. Los PINs válidos son `7887` o `star`.
                </p>
            </div>
        </div>
    );
};
