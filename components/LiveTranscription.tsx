
import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';

export const LiveTranscription: React.FC = () => {
    const { liveStatus, liveTranscription } = useAppContext();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [liveTranscription]);

    if (liveStatus !== 'active' && liveStatus !== 'connecting' || !liveTranscription) {
        return null;
    }

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 shadow-lg z-50 transition-all duration-300 ease-in-out">
            <div ref={scrollRef} className="max-h-28 overflow-y-auto text-sm font-mono space-y-1">
                {liveTranscription.userInput && (
                    <p><span className="text-green-300 font-bold">Tú:</span> {liveTranscription.userInput}</p>
                )}
                {liveTranscription.aiOutput && (
                    <p><span className="text-cyan-300 font-bold">IA:</span> {liveTranscription.aiOutput}</p>
                )}
            </div>
        </div>
    );
};
