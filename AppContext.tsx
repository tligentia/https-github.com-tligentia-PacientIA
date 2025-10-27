
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useRef } from 'react';
import type { Patient, Message, UserType, LiveSessionStatus, AppContextType, LiveTranscription } from './types';
import { mockPatients, mockMessages } from './data';
import { analyzePatientData, classifyAndRespondToTextMessage, getDoctorSuggestion } from './services/geminiService';
import { fileToBase64, encode, decode, decodeAudioData } from './utils';
import { GoogleGenAI, Modality, Blob, LiveSession, LiveServerMessage } from '@google/genai';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


type PatientCreationData = Omit<Patient['details'], 'visitHistory'> & { 
    name: string; 
    avatarUrl?: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>(() => {
        try {
            const savedPatients = localStorage.getItem('pacientia-patients');
            return savedPatients ? JSON.parse(savedPatients) : mockPatients;
        } catch (error) {
            console.error("Error loading patients from localStorage", error);
            return mockPatients;
        }
    });

    const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
        try {
            const savedMessages = localStorage.getItem('pacientia-messages');
            return savedMessages ? JSON.parse(savedMessages) : mockMessages;
        } catch (error) {
            console.error("Error loading messages from localStorage", error);
            return mockMessages;
        }
    });

    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients[0]?.id || null);

    const [liveStatus, setLiveStatus] = useState<LiveSessionStatus>('idle');
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [liveTranscription, setLiveTranscription] = useState<LiveTranscription | null>(null);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');


    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    useEffect(() => {
        localStorage.setItem('pacientia-patients', JSON.stringify(patients));
    }, [patients]);

    useEffect(() => {
        localStorage.setItem('pacientia-messages', JSON.stringify(messages));
    }, [messages]);

    const selectPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
    };

    const sendMessage = useCallback(async (
        patientId: string,
        text: string,
        userType: UserType,
        file?: File
    ) => {
        const fileData = file ? await fileToBase64(file) : undefined;

        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            timestamp: new Date().toISOString(),
            userType,
            imageUrl: fileData,
        };

        setMessages(prev => ({
            ...prev,
            [patientId]: [...(prev[patientId] || []), newMessage],
        }));

        // IA response logic
        if (userType === 'patient') {
             const loadingMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Analizando...',
                timestamp: new Date().toISOString(),
                userType: 'ai',
                isLoading: true,
            };
            
            setMessages(prev => ({
                ...prev,
                [patientId]: [...prev[patientId], loadingMessage],
            }));

            try {
                let analysis: string;
                if (file) {
                    analysis = await analyzePatientData(text, { data: fileData!, mimeType: file.type });
                } else {
                    analysis = await classifyAndRespondToTextMessage(text);
                }

                const analysisMessage: Message = {
                    ...loadingMessage,
                    text: analysis,
                    isLoading: false,
                };
                 setMessages(prev => {
                    const patientMessages = prev[patientId].filter(m => m.id !== loadingMessage.id);
                    return { ...prev, [patientId]: [...patientMessages, analysisMessage] };
                });

            } catch (error) {
                 console.error("Error with AI analysis:", error);
                 const errorMessage: Message = {
                    ...loadingMessage,
                    text: "Error al contactar a la IA. Por favor, intente de nuevo.",
                    isLoading: false,
                };
                 setMessages(prev => {
                    const patientMessages = prev[patientId].filter(m => m.id !== loadingMessage.id);
                    return { ...prev, [patientId]: [...patientMessages, errorMessage] };
                });
            }
        }
    }, []);
    
    const generateDoctorSuggestion = useCallback(async (patientId: string): Promise<string> => {
        const patientMessages = messages[patientId] || [];
        if (patientMessages.length === 0) {
            return "No hay historial de mensajes para analizar.";
        }

        const formattedHistory = patientMessages.map(msg => {
            let user;
            switch(msg.userType) {
                case 'patient': user = 'Paciente'; break;
                case 'doctor': user = 'Doctor'; break;
                case 'ai': user = 'Asistente IA'; break;
                default: user = 'Desconocido';
            }
            let content = msg.text;
            if (msg.imageUrl) {
                content += " (Imagen adjunta)";
            }
            return `${user} (${new Date(msg.timestamp).toLocaleString('es-ES')}): ${content}`;
        }).join('\n');
        
        const suggestion = await getDoctorSuggestion(formattedHistory);
        return suggestion;
    }, [messages]);


    const createPatient = (patientData: PatientCreationData) => {
        const newPatient: Patient = {
            id: Date.now().toString(),
            name: patientData.name,
            avatarUrl: patientData.avatarUrl,
            lastMessage: 'Nuevo paciente añadido.',
            lastMessageTimestamp: new Date().toISOString(),
            details: {
                age: patientData.age,
                condition: patientData.condition,
                phone: patientData.phone,
                email: patientData.email,
                visitHistory: [{ date: new Date().toISOString(), summary: 'Creación de ficha de paciente.' }],
            },
        };
        setPatients(prev => [...prev, newPatient]);
        setMessages(prev => ({ ...prev, [newPatient.id]: [] }));
        setSelectedPatientId(newPatient.id);
    };

    const updatePatient = (updatedPatient: Patient) => {
        setPatients(prevPatients =>
            prevPatients.map(p => (p.id === updatedPatient.id ? updatedPatient : p))
        );
    };

    const resetData = () => {
        if (window.confirm('¿Está seguro de que desea eliminar todos los datos y restaurar la información de ejemplo? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('pacientia-patients');
            localStorage.removeItem('pacientia-messages');
            setPatients(mockPatients);
            setMessages(mockMessages);
            setSelectedPatientId(mockPatients[0]?.id || null);
        }
    };

    const stopLiveConversation = useCallback(() => {
        console.log('Stopping live conversation...');
        sessionPromiseRef.current?.then(session => session.close());
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();

        sessionPromiseRef.current = null;
        mediaStreamRef.current = null;
        scriptProcessorRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        nextStartTimeRef.current = 0;
        
        setIsAiSpeaking(false);
        setLiveTranscription(null);
        setLiveStatus('stopped');
    }, []);

    const startLiveConversation = useCallback(async () => {
        console.log('Starting live conversation...');
        setLiveStatus('connecting');
        setIsAiSpeaking(false);
        setLiveTranscription({ userInput: '', aiOutput: '', isComplete: false });
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            setIsAiSpeaking(true);
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(
                                decode(base64Audio),
                                outputCtx,
                                24000,
                                1,
                            );

                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                                if (audioSourcesRef.current.size === 0) {
                                    setIsAiSpeaking(false);
                                }
                            });

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }

                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current = message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current = message.serverContent.outputTranscription.text;
                        }

                        setLiveTranscription({
                            userInput: currentInputTranscriptionRef.current,
                            aiOutput: currentOutputTranscriptionRef.current,
                            isComplete: false,
                        });

                        if (message.serverContent?.turnComplete) {
                            console.log("Turn complete:", { input: currentInputTranscriptionRef.current, output: currentOutputTranscriptionRef.current });
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }


                        if (message.serverContent?.interrupted) {
                            audioSourcesRef.current.forEach(source => source.stop());
                            audioSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setIsAiSpeaking(false);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setLiveStatus('error');
                        stopLiveConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                         if (liveStatus !== 'stopped') {
                           stopLiveConversation();
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: 'Eres un asistente médico amigable y servicial llamado PacientIA. Responde de manera concisa y clara en español.',
                },
            });

            sessionPromiseRef.current = sessionPromise;

            sessionPromise.then(() => {
                setLiveStatus('active');
            }).catch(err => {
                 console.error("Failed to establish live session:", err);
                 setLiveStatus('error');
                 stopLiveConversation();
            });

        } catch (error) {
            console.error('Failed to get user media:', error);
            alert('No se pudo acceder al micrófono. Por favor, compruebe los permisos en su navegador.');
            setLiveStatus('error');
        }
    }, [stopLiveConversation, liveStatus]);

    const toggleLiveConversation = useCallback(() => {
        if (liveStatus === 'active' || liveStatus === 'connecting') {
            stopLiveConversation();
        } else {
            startLiveConversation();
        }
    }, [liveStatus, startLiveConversation, stopLiveConversation]);

    const value: AppContextType = {
        patients,
        messages,
        selectedPatientId,
        selectedPatient,
        selectPatient,
        sendMessage,
        createPatient,
        updatePatient,
        resetData,
        generateDoctorSuggestion,
        liveStatus,
        toggleLiveConversation,
        isAiSpeaking,
        liveTranscription,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};