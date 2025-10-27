
import React, { useState, useEffect, useRef } from 'react';
import type { Patient } from '../types';
import { useAppContext } from '../AppContext';
import { fileToBase64 } from '../utils';
import { XIcon, CameraIcon, ExclamationCircleIcon } from './Icons';
import { Avatar } from './Avatar';

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    patientToEdit: Patient | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({ isOpen, onClose, mode, patientToEdit }) => {
    const { createPatient, updatePatient } = useAppContext();
    
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [condition, setCondition] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && patientToEdit) {
                setName(patientToEdit.name);
                setAge(patientToEdit.details.age);
                setCondition(patientToEdit.details.condition);
                setPhone(patientToEdit.details.phone || '');
                setEmail(patientToEdit.details.email || '');
                setAvatarUrl(patientToEdit.avatarUrl || '');
            } else {
                // Reset for 'create' mode
                setName('');
                setAge('');
                setCondition('');
                setPhone('');
                setEmail('');
                setAvatarUrl('');
            }
             setError('');
        }
    }, [isOpen, mode, patientToEdit]);

    useEffect(() => {
        if (name.trim() && age !== '' && condition.trim()) {
            setError('');
        }
    }, [name, age, condition]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setAvatarUrl(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || age === '' || !condition.trim()) {
            setError('Por favor, complete los campos obligatorios: Nombre, Edad y Condición.');
            return;
        }

        if (mode === 'edit' && patientToEdit) {
            const updatedPatient: Patient = {
                ...patientToEdit,
                name,
                avatarUrl,
                details: {
                    ...patientToEdit.details,
                    age: age as number,
                    condition,
                    phone,
                    email,
                }
            };
            updatePatient(updatedPatient);
        } else {
             createPatient({ name, age: age as number, condition, phone, email, avatarUrl });
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                    <XIcon />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6">{mode === 'edit' ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center">
                         <div className="relative group">
                            <Avatar name={name} avatarUrl={avatarUrl} className="w-24 h-24 ring-4 ring-gray-200 text-4xl" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Cambiar foto de perfil"
                            >
                                <CameraIcon />
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-600">Nombre completo</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="age" className="text-sm font-medium text-gray-600">Edad</label>
                        <input id="age" type="number" value={age} onChange={e => setAge(parseInt(e.target.value, 10) || '')} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="condition" className="text-sm font-medium text-gray-600">Condición</label>
                        <input id="condition" type="text" value={condition} onChange={e => setCondition(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="text-sm font-medium text-gray-600">Teléfono (Opcional)</label>
                        <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email (Opcional)</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    
                    {error && (
                        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">
                            <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">{mode === 'edit' ? 'Guardar Cambios' : 'Crear Paciente'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};