
export type UserType = 'patient' | 'doctor' | 'ai';

export interface Visit {
    date: string;
    summary: string;
}

export interface Patient {
    id: string;
    name: string;
    avatarUrl?: string;
    lastMessage: string;
    lastMessageTimestamp: string;
    details: {
        age: number;
        condition: string;
        visitHistory: Visit[];
        phone?: string;
        email?: string;
    };
}

export interface Message {
    id: string;
    text: string;
    timestamp: string;
    userType: UserType;
    imageUrl?: string;
    isLoading?: boolean;
}

export type Currency = 'USD' | 'EUR' | 'GBP';

export type LiveSessionStatus = 'idle' | 'connecting' | 'active' | 'error' | 'stopped';

export interface LiveTranscription {
    userInput: string;
    aiOutput: string;
    isComplete: boolean;
}

export interface AppContextType {
    patients: Patient[];
    messages: Record<string, Message[]>;
    selectedPatientId: string | null;
    selectedPatient: Patient | undefined;
    selectPatient: (patientId: string) => void;
    sendMessage: (patientId: string, text: string, userType: UserType, file?: File) => void;
    createPatient: (patientData: Omit<Patient['details'], 'visitHistory'> & { name: string; avatarUrl?: string; }) => void;
    updatePatient: (updatedPatient: Patient) => void;
    resetData: () => void;
    generateDoctorSuggestion: (patientId: string) => Promise<string>;
    liveStatus: LiveSessionStatus;
    toggleLiveConversation: () => void;
    isAiSpeaking: boolean;
    liveTranscription: LiveTranscription | null;
}