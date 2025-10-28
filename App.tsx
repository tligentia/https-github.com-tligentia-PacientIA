
import React, { useState, useMemo, useEffect } from 'react';
import { PatientList } from './components/PatientList';
import { ChatWindow } from './components/ChatWindow';
import type { Patient, Currency } from './types';
import { BotIcon, MenuIcon, XIcon } from './components/Icons';
import { PatientDetailModal } from './components/PatientDetailModal';
import { PatientFormModal } from './components/PatientFormModal';
import { Footer } from './components/Footer';
import { useAppContext } from './AppContext';
import { PrivacyModal } from './components/PrivacyModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LiveTranscription } from './components/LiveTranscription';
import { Avatar } from './components/Avatar';
import { LockScreen } from './components/LockScreen';

const App: React.FC = () => {
    const { selectedPatient, messages, patients, selectPatient } = useAppContext();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
    const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
    const [userIp, setUserIp] = useState<string | null>(null);
    const [currency, setCurrency] = useState<Currency>('EUR');
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSpecialIp, setIsSpecialIp] = useState(false);

    const handleShowDetails = (patient: Patient) => {
        setDetailPatient(patient);
    };

    const handleCloseDetails = () => {
        setDetailPatient(null);
    };

    const handleOpenCreateModal = () => {
        setFormModalMode('create');
        setPatientToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (patient: Patient) => {
        setDetailPatient(null); // Close detail modal first
        setFormModalMode('edit');
        setPatientToEdit(patient);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setPatientToEdit(null);
    };
    
    const handleManageCookies = () => {
        setIsPrivacyModalOpen(true);
    };

    React.useEffect(() => {
        if (selectedPatient && window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [selectedPatient]);

    useEffect(() => {
        const specialIPs = ['79.116.44.133', '37.223.15.63'];
        const fetchIp = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setUserIp(data.ip);

                if (specialIPs.includes(data.ip)) {
                    setIsSpecialIp(true);
                    setIsAuthenticated(true); // Bypass lock screen
                }
            } catch (error) {
                console.warn('Failed to fetch IP address:', error);
                setUserIp('N/A');
            }
        };
        fetchIp();
    }, []);

    // Effect for handling notifications
    useEffect(() => {
        if (!isAuthenticated) return;

        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    
        const checkReminders = () => {
            const now = new Date();
            patients.forEach(patient => {
                if (patient.reminder) {
                    const reminderTime = new Date(patient.reminder.datetime);
                    const notificationKey = `notified-${patient.id}-${patient.reminder.datetime}`;
    
                    if (reminderTime <= now && !sessionStorage.getItem(notificationKey)) {
                        console.log(`Firing reminder for ${patient.name}`);
                        if (Notification.permission === 'granted') {
                            const notification = new Notification('Recordatorio de PacientIA', {
                                body: `Seguimiento para ${patient.name}: ${patient.reminder.message}`,
                                icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><rect width=%2220%22 height=%2220%22 rx=%224%22 fill=%22%234f46e5%22 /><path fill=%22%23ffffff%22 d=%22M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z%22 /></svg>"
                            });
                            notification.onclick = () => {
                                window.focus();
                                selectPatient(patient.id);
                            };
                        } else {
                            // Fallback for browsers/permissions
                            alert(`Recordatorio para ${patient.name}: ${patient.reminder.message}`);
                        }
                        sessionStorage.setItem(notificationKey, 'true');
                    }
                }
            });
        };
    
        const intervalId = setInterval(checkReminders, 30000); // Check every 30 seconds
    
        return () => clearInterval(intervalId);
    }, [isAuthenticated, patients, selectPatient]);


    const tokenCount = useMemo(() => {
        return Object.values(messages)
            .flat()
            .filter(m => m.userType === 'ai' && !m.isLoading)
            .reduce((acc, msg) => acc + Math.floor(msg.text.length / 3.5), 0);
    }, [messages]);

    const totalCostUSD = useMemo(() => {
        const costPerToken = 0.0013 / 1000;
        return tokenCount * costPerToken;
    }, [tokenCount]);

    if (!isAuthenticated) {
        return <LockScreen onUnlock={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="relative flex flex-col h-screen font-sans text-gray-800 antialiased">
            <div className="flex flex-1 overflow-hidden">
                <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full md:w-80' : 'w-0'} md:block md:w-80 flex-shrink-0`}>
                     <PatientList
                        onShowDetails={handleShowDetails}
                        onOpenCreateModal={handleOpenCreateModal}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </div>

                <main className="flex-1 flex flex-col bg-white">
                    <header className="flex items-center p-4 border-b border-gray-200 bg-gray-50 h-[73px] flex-shrink-0">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 md:hidden text-gray-600 hover:text-gray-900 mr-2">
                            {isSidebarOpen ? <XIcon/> : <MenuIcon />}
                        </button>
                        {selectedPatient && (
                            <div className="flex items-center space-x-4">
                                <Avatar name={selectedPatient.name} avatarUrl={selectedPatient.avatarUrl} className="w-12 h-12 text-xl" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedPatient.details.condition} - {selectedPatient.details.age} años
                                    </p>
                                </div>
                            </div>
                        )}
                    </header>

                    {selectedPatient ? (
                        <ChatWindow patient={selectedPatient} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-center p-4 -mt-[73px] md:mt-0">
                            <p>No hay pacientes seleccionados. <br/> Por favor, seleccione un paciente de la lista o cree uno nuevo.</p>
                        </div>
                    )}
                </main>
            </div>
            
            <Footer 
                tokenCount={tokenCount}
                totalCostUSD={totalCostUSD}
                userIp={userIp}
                currency={currency}
                onManageCookies={handleManageCookies}
                onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                isSpecialIp={isSpecialIp}
            />

            <PatientDetailModal 
                patient={detailPatient} 
                onClose={handleCloseDetails} 
                onOpenEditModal={handleOpenEditModal}
            />
            <PatientFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                mode={formModalMode}
                patientToEdit={patientToEdit}
            />
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />
            <PrivacyModal 
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
            <LiveTranscription />
        </div>
    );
};

export default App;