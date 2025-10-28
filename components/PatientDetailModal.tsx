
import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';
import { XIcon, BotIcon, PatientIcon, DoctorIcon, EditIcon, PhoneIcon, EmailIcon, WhatsAppIcon, CalendarIcon, BellIcon } from './Icons';
import { useAppContext } from '../AppContext';
import { parseTextToHTML, formatDateToSpanish } from '../utils';
import { Avatar } from './Avatar';

interface PatientDetailModalProps {
    patient: Patient | null;
    onClose: () => void;
    onOpenEditModal: (patient: Patient) => void;
}

const ReminderSection: React.FC<{ patient: Patient }> = ({ patient }) => {
    const { scheduleReminder, cancelReminder } = useAppContext();
    const [reminderDate, setReminderDate] = useState('');
    const [reminderMessage, setReminderMessage] = useState('Por favor, envíe una nueva foto de su herida.');
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (!patient.reminder) {
             setIsFormVisible(false);
             setReminderMessage('Por favor, envíe una nueva foto de su herida.');
             setReminderDate('');
        }
    }, [patient.reminder]);

    const handleSchedule = () => {
        if (patient && reminderDate) {
            scheduleReminder(patient.id, new Date(reminderDate).toISOString(), reminderMessage);
            setIsFormVisible(false);
        }
    };

    const handleCancel = () => {
        if (patient) {
            cancelReminder(patient.id);
        }
    };

    const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

    return (
        <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left flex items-center gap-2">
                <BellIcon /> Recordatorio de Seguimiento
            </h3>
            {patient.reminder ? (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-sm">
                    <p className="font-semibold text-indigo-800">Hay un recordatorio programado para:</p>
                    <p className="text-indigo-700 font-mono my-1">{new Date(patient.reminder.datetime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    <p className="text-indigo-700 mt-2"><strong>Mensaje:</strong> "{patient.reminder.message}"</p>
                    <button onClick={handleCancel} className="mt-3 text-sm font-semibold text-red-600 hover:text-red-800">
                        Cancelar Recordatorio
                    </button>
                </div>
            ) : (
                <div>
                    {!isFormVisible ? (
                         <button onClick={() => setIsFormVisible(true)} className="w-full text-left bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
                            + Programar nuevo recordatorio
                        </button>
                    ) : (
                        <div className="space-y-3 text-sm">
                             <div>
                                <label htmlFor="reminder-date" className="font-medium text-gray-600">Fecha y Hora</label>
                                <input
                                    id="reminder-date"
                                    type="datetime-local"
                                    value={reminderDate}
                                    onChange={(e) => setReminderDate(e.target.value)}
                                    min={minDateTime}
                                    className="mt-1 w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="reminder-message" className="font-medium text-gray-600">Mensaje del Recordatorio</label>
                                <textarea
                                    id="reminder-message"
                                    value={reminderMessage}
                                    onChange={(e) => setReminderMessage(e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full p-2 border rounded-md"
                                ></textarea>
                            </div>
                            <div className="flex space-x-2 justify-end">
                                <button onClick={() => setIsFormVisible(false)} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button onClick={handleSchedule} disabled={!reminderDate} className="bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                                    Programar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose, onOpenEditModal }) => {
    const { messages } = useAppContext();

    if (!patient) {
        return null;
    }

    const messageHistory = messages[patient.id] || [];
    const latestVisit = patient.details.visitHistory?.[0];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all flex flex-col m-4 max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0 relative">
                     <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <XIcon />
                    </button>
                    
                    <div className="flex flex-col items-center text-center">
                        <Avatar name={patient.name} avatarUrl={patient.avatarUrl} className="w-24 h-24 mb-4 ring-4 ring-indigo-100 text-4xl"/>
                        <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Details */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 text-left">Detalles del Paciente</h3>
                            <button 
                                onClick={() => onOpenEditModal(patient)} 
                                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                                <EditIcon />
                                <span>Editar</span>
                            </button>
                        </div>
                        <ul className="space-y-3 text-sm text-left">
                            <li className="flex justify-between items-center"><span className="font-medium text-gray-500">Edad:</span><span className="text-gray-800 font-semibold">{patient.details.age} años</span></li>
                            <li className="flex justify-between items-start"><span className="font-medium text-gray-500 pr-4">Condición:</span><span className="text-gray-800 font-semibold text-right">{patient.details.condition}</span></li>
                            {latestVisit && (
                                <li className="flex justify-between items-center">
                                    <span className="font-medium text-gray-500">Última Visita:</span>
                                    <span className="text-gray-800 font-semibold">{formatDateToSpanish(latestVisit.date)}</span>
                                </li>
                            )}
                            {patient.details.phone && (<li className="flex justify-between items-center"><span className="font-medium text-gray-500 flex items-center gap-2"><PhoneIcon/>Teléfono:</span><a href={`https://wa.me/${patient.details.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline flex items-center gap-2">{patient.details.phone} <WhatsAppIcon/></a></li>)}
                            {patient.details.email && (<li className="flex justify-between items-center"><span className="font-medium text-gray-500 flex items-center gap-2"><EmailIcon/>Email:</span><a href={`mailto:${patient.details.email}`} className="text-indigo-600 font-semibold hover:underline truncate">{patient.details.email}</a></li>)}
                        </ul>
                    </div>

                    <ReminderSection patient={patient} />

                    {/* Visit History */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left flex items-center gap-2"><CalendarIcon /> Historial de Visitas</h3>
                        <div className="space-y-4">
                            {patient.details.visitHistory && patient.details.visitHistory.length > 0 ? (
                                patient.details.visitHistory.map((visit, index) => (
                                    <div key={index} className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white ring-2 ring-indigo-300"></div>
                                        {index < patient.details.visitHistory.length - 1 && (
                                             <div className="absolute left-[5px] top-[18px] w-px h-full bg-gray-200"></div>
                                        )}
                                        <p className="text-sm font-semibold text-gray-700">
                                            {formatDateToSpanish(visit.date)}
                                        </p>
                                        <p className="text-sm text-gray-600">{visit.summary}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No hay historial de visitas para este paciente.</p>
                            )}
                        </div>
                    </div>

                    {/* Conversation History */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left">Historial de Conversación</h3>
                        <div className="space-y-4">
                            {messageHistory.length > 0 ? (
                                messageHistory.map(msg => {
                                    let icon, bgColor, textColor;

                                    switch (msg.userType) {
                                        case 'patient':
                                            icon = <PatientIcon />;
                                            bgColor = 'bg-green-100';
                                            textColor = 'text-green-700';
                                            break;
                                        case 'doctor':
                                            icon = <DoctorIcon />;
                                            bgColor = 'bg-blue-100';
                                            textColor = 'text-blue-700';
                                            break;
                                        case 'ai':
                                            icon = <BotIcon />;
                                            bgColor = 'bg-indigo-100';
                                            textColor = 'text-indigo-700';
                                            break;
                                        default:
                                            icon = null;
                                            bgColor = 'bg-gray-100';
                                            textColor = 'text-gray-700';
                                    }

                                    return (
                                        <div key={msg.id} className="flex items-start space-x-3">
                                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor} ${textColor}`}>
                                                {icon}
                                            </div>
                                            <div className="flex-1 text-left bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <div className="text-sm text-gray-700" dangerouslySetInnerHTML={parseTextToHTML(msg.text)} />
                                                {msg.imageUrl && (<img src={msg.imageUrl} alt="Imagen de reporte" className="mt-2 rounded-lg max-w-full h-auto" />)}
                                                <p className="text-xs text-gray-400 mt-2 text-right">{new Date(msg.timestamp).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No hay mensajes previos para este paciente.</p>
                            )}
                        </div>
                    </div>
                </div>

                 {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
                     <button onClick={onClose} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cerrar</button>
                </div>
            </div>
        </div>
    );
};