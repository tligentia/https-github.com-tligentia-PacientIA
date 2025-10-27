
import React from 'react';
import type { Message } from '../types';
import { BotIcon, DoctorIcon, PatientIcon, SpinnerIcon } from './Icons';
import { parseTextToHTML } from '../utils';

interface MessageBubbleProps {
    message: Message;
}

const UserAvatar: React.FC<{ userType: 'patient' | 'doctor' | 'ai' }> = ({ userType }) => {
    const iconMap = {
        patient: <PatientIcon />,
        doctor: <DoctorIcon />,
        ai: <BotIcon />,
    };

    const colorMap = {
        patient: 'bg-green-100 text-green-700',
        doctor: 'bg-blue-100 text-blue-700',
        ai: 'bg-indigo-100 text-indigo-700',
    };

    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[userType]}`}>
            {iconMap[userType]}
        </div>
    );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isDoctor = message.userType === 'doctor';
    const isAI = message.userType === 'ai';

    const alignment = isDoctor ? 'justify-end' : 'justify-start';
    const bubbleColor = isDoctor ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800';
    const bubblePosition = isDoctor ? 'flex-row-reverse' : 'flex-row';

    if (isAI) {
        return (
            <div className="flex items-start space-x-3">
                <UserAvatar userType="ai" />
                <div className="flex-1 max-w-xl p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                    {message.isLoading ? (
                        <div className="flex items-center space-x-2 text-indigo-700">
                           <SpinnerIcon />
                           <span>{message.text}</span>
                        </div>
                    ) : (
                         <div className="text-sm text-indigo-900" dangerouslySetInnerHTML={parseTextToHTML(message.text)} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${alignment} w-full`}>
            <div className={`flex items-start ${bubblePosition} space-x-3 max-w-xl`}>
                <UserAvatar userType={message.userType} />
                <div className={`p-4 rounded-lg shadow-sm ${bubbleColor}`}>
                    {message.text && <p className="text-sm" dangerouslySetInnerHTML={parseTextToHTML(message.text)} />}
                    {message.imageUrl && (
                        <div className="mt-2">
                            <img src={message.imageUrl} alt="Imagen de herida" className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer" onClick={()=> window.open(message.imageUrl, '_blank')} />
                        </div>
                    )}
                     <p className={`text-xs mt-2 ${isDoctor ? 'text-indigo-200' : 'text-gray-400'} text-right`}>
                        {new Date(message.timestamp).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    );
};
