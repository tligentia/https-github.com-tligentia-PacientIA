
import React, { useState, useMemo } from 'react';
import type { Patient } from '../types';
import { XIcon, InfoIcon, AddUserIcon, TrashIcon, SearchIcon, BotIcon } from './Icons';
import { useAppContext } from '../AppContext';
import { formatDateToSpanish } from '../utils';
import { Avatar } from './Avatar';

interface PatientListProps {
    onShowDetails: (patient: Patient) => void;
    onOpenCreateModal: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const PatientCard: React.FC<{ 
    patient: Patient; 
    isSelected: boolean; 
    onClick: () => void;
    onShowDetails: (patient: Patient) => void;
}> = ({ patient, isSelected, onClick, onShowDetails }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-all duration-200 border ${
            isSelected 
                ? 'bg-indigo-100 border-indigo-300 shadow-sm' 
                : 'border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm'
        }`}
    >
        <Avatar name={patient.name} avatarUrl={patient.avatarUrl} className="w-12 h-12 mr-4 text-xl" />
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className={`font-semibold truncate ${isSelected ? 'text-indigo-800' : 'text-gray-900'}`}>{patient.name}</h3>
                <div className="flex items-center space-x-2">
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShowDetails(patient);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                        title="Ver detalles del paciente"
                    >
                        <InfoIcon />
                    </button>
                    <p className={`text-xs ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {formatDateToSpanish(patient.lastMessageTimestamp)}
                    </p>
                </div>
            </div>
            <p className={`text-sm truncate ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>{patient.lastMessage}</p>
        </div>
    </li>
);

const DataManagementPanel: React.FC<{ onOpenCreateModal: () => void }> = ({ onOpenCreateModal }) => {
    const { resetData } = useAppContext();

    return (
        <div className="p-4">
            <div className="flex space-x-2">
                <button 
                    onClick={onOpenCreateModal} 
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white p-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <AddUserIcon/>
                    <span>Nuevo Paciente</span>
                </button>
                <button 
                    onClick={resetData} 
                    title="Limpiar y Reiniciar Datos" 
                    className="flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                    <TrashIcon/>
                </button>
            </div>
        </div>
    );
};


export const PatientList: React.FC<PatientListProps> = ({ onShowDetails, onOpenCreateModal, isOpen, onClose }) => {
    const { patients, selectedPatientId, selectPatient } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => 
        patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [patients, searchTerm]);

    return (
        <aside className={`h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 absolute md:relative z-20 w-full md:w-auto`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 h-[73px]">
                <div className="flex items-center space-x-2 text-indigo-600">
                    <BotIcon />
                    <span className="font-semibold text-lg">Pacient<span className="text-red-600">IA</span></span>
                </div>
                 <button onClick={onClose} className="p-2 md:hidden text-gray-600 hover:text-gray-900">
                    <XIcon />
                </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 h-[73px] flex items-center">
                 <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')} 
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            title="Limpiar búsqueda"
                        >
                            <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600"/>
                        </button>
                    )}
                </div>
            </div>

            <DataManagementPanel onOpenCreateModal={onOpenCreateModal} />

            <div className="flex-1 overflow-y-auto p-2">
                {filteredPatients.length > 0 ? (
                    <ul className="space-y-2">
                        {filteredPatients.map(patient => (
                            <PatientCard 
                                key={patient.id}
                                patient={patient}
                                isSelected={patient.id === selectedPatientId}
                                onClick={() => selectPatient(patient.id)}
                                onShowDetails={onShowDetails}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 p-4">
                        {patients.length > 0 ? 'No se encontraron pacientes.' : 'No hay pacientes. Cree uno nuevo para comenzar.'}
                    </p>
                )}
            </div>
        </aside>
    );
};