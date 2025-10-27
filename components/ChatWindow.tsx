

import React, { useRef, useEffect } from 'react';
import type { Patient } from '../types';
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { useAppContext } from '../AppContext';

interface ChatWindowProps {
    patient: Patient;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ patient }) => {
    const { messages, sendMessage, generateDoctorSuggestion } = useAppContext();
    const patientMessages = messages[patient.id] || [];
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [patientMessages]);

    const handleSendMessage = (text: string, file?: File) => {
        sendMessage(patient.id, text, 'doctor', file);
    };

    // This function is for simulating a patient sending a message for demo purposes
    const handlePatientSendMessage = (text: string, file?: File) => {
        sendMessage(patient.id, text, 'patient', file);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <div className="space-y-6">
                    {patientMessages.map((msg, index) => (
                        <MessageBubble key={msg.id || index} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                {/* For this demo, we'll have two input boxes to simulate both sides of the conversation */}
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-gray-600">Respuesta del Doctor</label>
                        <MessageInput 
                            onSendMessage={handleSendMessage} 
                            userType="doctor"
                            onGenerateSuggestion={() => generateDoctorSuggestion(patient.id)}
                        />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-gray-600">Simular Reporte del Paciente</label>
                        <MessageInput onSendMessage={handlePatientSendMessage} userType="patient" />
                     </div>
                </div>
            </div>
        </div>
    );
};
