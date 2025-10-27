
import React, { useState, useRef, useMemo } from 'react';
import { PaperclipIcon, SendIcon, XIcon, SparklesIcon, SpinnerIcon, MicrophoneIcon, SpeakerIcon } from './Icons';
import type { UserType } from '../types';
import { fileToBase64 } from '../utils';
import { useAppContext } from '../AppContext';

interface MessageInputProps {
    onSendMessage: (text: string, file?: File) => void;
    userType: UserType;
    onGenerateSuggestion?: () => Promise<string>;
}

interface PreviewFile {
    dataUrl: string;
    name: string;
    nativeFile: File;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, userType, onGenerateSuggestion }) => {
    const { liveStatus, toggleLiveConversation, isAiSpeaking } = useAppContext();
    const [text, setText] = useState('');
    const [file, setFile] = useState<PreviewFile | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const base64Data = await fileToBase64(selectedFile);
            setFile({
                dataUrl: base64Data,
                name: selectedFile.name,
                nativeFile: selectedFile,
            });
        }
        event.target.value = ''; // Reset file input
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (text.trim() || file) {
            onSendMessage(text, file?.nativeFile);
            setText('');
            setFile(null);
        }
    };

    const handleSuggestionClick = async () => {
        if (!onGenerateSuggestion) return;
        setIsSuggesting(true);
        try {
            const suggestion = await onGenerateSuggestion();
            setText(suggestion);
        } catch (error) {
            console.error("Failed to get suggestion", error);
            setText("No se pudo generar una sugerencia.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const liveButtonClass = useMemo(() => {
        if (liveStatus === 'connecting') {
            return 'bg-yellow-400 text-white';
        }
        if (liveStatus === 'active') {
            return isAiSpeaking ? 'bg-blue-500 text-white' : 'bg-red-500 text-white animate-pulse';
        }
        return 'text-gray-500 hover:text-indigo-600';
    }, [liveStatus, isAiSpeaking]);

    const liveButtonTitle = useMemo(() => {
        if (liveStatus === 'active') {
            return isAiSpeaking ? 'IA está hablando...' : 'Detener conversación';
        }
        if (liveStatus === 'connecting') {
            return 'Conectando...';
        }
        return 'Iniciar conversación por voz';
    }, [liveStatus, isAiSpeaking]);

    const bgColorClass = useMemo(() => {
        switch (userType) {
            case 'doctor':
                return 'bg-blue-50';
            case 'patient':
                return 'bg-green-50';
            default:
                return 'bg-gray-100';
        }
    }, [userType]);


    return (
        <form onSubmit={handleSubmit} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${bgColorClass}`}>
             <button
                type="button"
                onClick={toggleLiveConversation}
                className={`p-2 rounded-full transition-colors duration-300 ease-in-out ${liveButtonClass}`}
                title={liveButtonTitle}
            >
                {liveStatus === 'connecting' ? <SpinnerIcon /> : isAiSpeaking ? <SpeakerIcon className="h-5 w-5"/> : <MicrophoneIcon className="h-5 w-5" />}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            {userType === 'patient' && (
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Adjuntar imagen"
                >
                    <PaperclipIcon />
                </button>
            )}
           
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escriba su mensaje..."
                className="flex-1 bg-transparent focus:outline-none px-2 text-gray-800 placeholder-gray-500"
            />
             {file && (
                <div className="flex items-center space-x-2 p-1 bg-indigo-100 rounded-full flex-shrink-0">
                    <img src={file.dataUrl} alt="Vista previa" className="w-6 h-6 rounded-full object-cover"/>
                    <span className="text-xs text-indigo-800 truncate max-w-[100px]">{file.name}</span>
                    <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="p-0.5 bg-indigo-200 text-indigo-700 hover:bg-indigo-300 rounded-full"
                        title="Quitar imagen"
                    >
                        <XIcon className="h-3 w-3" />
                    </button>
                </div>
            )}
             {userType === 'doctor' && onGenerateSuggestion && (
                 <button
                    type="button"
                    onClick={handleSuggestionClick}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    title="Generar sugerencia con IA"
                    disabled={isSuggesting}
                >
                    {isSuggesting ? <SpinnerIcon /> : <SparklesIcon />}
                </button>
            )}
            <button
                type="submit"
                className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                disabled={!text.trim() && !file}
                title="Enviar mensaje"
            >
                <SendIcon />
            </button>
        </form>
    );
};
