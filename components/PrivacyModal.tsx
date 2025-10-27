
import React from 'react';
import { XIcon } from './Icons';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative transform transition-all flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Política de Cookies y Privacidad</h2>
                     <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto text-gray-600 space-y-4 text-sm">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-bold text-yellow-800">AVISO IMPORTANTE: Versión de Demostración (Beta)</h3>
                        <p className="mt-1">
                            Esta aplicación, <strong>PacientIA</strong>, es una demostración técnica y se encuentra en fase beta. 
                            <strong>No está destinada para uso clínico real.</strong> Por favor, no introduzca datos personales o médicos sensibles de pacientes reales.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 text-base mb-1">1. Almacenamiento de Datos y Privacidad</h3>
                        <p>
                            La privacidad es nuestra máxima prioridad. Para garantizar la confidencialidad, <strong>esta aplicación no guarda ninguna información en servidores externos.</strong> Todos los datos que usted introduce (información de pacientes, conversaciones, imágenes, etc.) se almacenan exclusivamente de forma local en su propio navegador web, utilizando la tecnología <code className="bg-gray-200 px-1 rounded text-xs">localStorage</code>.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                            <li><strong>Ventaja:</strong> Sus datos nunca abandonan su dispositivo, ofreciendo un control total sobre su información.</li>
                            <li><strong>Inconveniente:</strong> Si borra los datos de su navegador o cambia de dispositivo, la información se perderá.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 text-base mb-1">2. Cookies y Servicios de Terceros</h3>
                        <p>
                           Esta aplicación no utiliza cookies de seguimiento o publicitarias. Sin embargo, para funcionalidades específicas, podemos hacer uso de servicios de terceros:
                        </p>
                         <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                            <li><strong>Google Gemini API:</strong> Para las funciones de análisis de inteligencia artificial. Las consultas se envían de forma segura a Google para su procesamiento.</li>
                            <li><strong>api.ipify.org:</strong> Se realiza una única consulta a este servicio para mostrar su dirección IP en el pie de página, una característica común para fines informativos y de depuración.</li>
                             <li><strong>Imágenes de ejemplo:</strong> Las imágenes por defecto provienen de fuentes como <code className="bg-gray-200 px-1 rounded text-xs">picsum.photos</code> y <code className="bg-gray-200 px-1 rounded text-xs">wikimedia.org</code>.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-700 text-base mb-1">3. Consentimiento</h3>
                        <p>
                           Al utilizar esta aplicación de demostración, usted entiende y acepta los puntos mencionados anteriormente. El objetivo principal es mostrar las capacidades de la IA en un entorno médico simulado y seguro.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                     <button onClick={onClose} className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Aceptar y Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
