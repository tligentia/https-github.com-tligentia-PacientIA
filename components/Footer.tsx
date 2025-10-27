
import React, { useMemo } from 'react';
import type { Currency } from '../types';
import { CONVERSION_RATES } from '../constants';
import { FeedbackIcon } from './Icons';

interface FooterProps {
    tokenCount: number;
    totalCostUSD: number;
    userIp: string | null;
    currency: Currency;
    onManageCookies: () => void;
    onOpenFeedbackModal: () => void;
    isSpecialIp?: boolean;
}

const VerticalSeparator = () => (
    <div className="hidden sm:block w-px h-5 bg-gray-300" aria-hidden="true"></div>
);

export const Footer: React.FC<FooterProps> = ({ tokenCount, totalCostUSD, userIp, currency, onManageCookies, onOpenFeedbackModal, isSpecialIp }) => {
    
    const estimatedCost = useMemo(() => {
        if (totalCostUSD === 0) return null;

        const rate = CONVERSION_RATES[currency] ?? 1;
        const costInSelectedCurrency = totalCostUSD * rate;

        const fractionDigits = costInSelectedCurrency > 0 && costInSelectedCurrency < 0.10 ? 4 : 2;

        return costInSelectedCurrency.toLocaleString('es-ES', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        });

    }, [totalCostUSD, currency]);

    return (
        <footer className="w-full py-4 border-t border-gray-200 bg-gray-50 text-gray-600 text-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-y-4 sm:gap-x-6">
                
                <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4">
                    <span className="font-bold text-red-700">Versión 2025.v10G</span>
                    {userIp && (
                        <div className="flex items-baseline gap-1.5">
                            <span>IP:</span>
                            <span className={`font-mono text-gray-800 ${isSpecialIp ? 'text-green-600 font-bold' : ''}`}>{userIp}</span>
                        </div>
                    )}
                </div>
                
                <VerticalSeparator />

                <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4">
                    <div className="flex items-baseline gap-1.5">
                        <span>Tokens:</span>
                        <span className="font-mono font-semibold text-gray-800">
                            {tokenCount.toLocaleString('es-ES')}
                            {estimatedCost && (
                                <span className="ml-1 text-xs text-gray-500" title="Coste estimado basado en precios públicos y tipos de cambio aproximados.">
                                   ({estimatedCost})
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                <VerticalSeparator />

                 <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4 text-center sm:text-right">
                     <button type="button" onClick={onOpenFeedbackModal} className="p-2 text-gray-600 hover:text-gray-900" title="Enviar Feedback">
                        <FeedbackIcon />
                    </button>
                    <VerticalSeparator />
                    <button type="button" onClick={onManageCookies} className="text-gray-600 hover:text-gray-900 hover:underline transition">
                        Cookies y Privacidad
                    </button>
                    <VerticalSeparator />
                     <div>
                        <a href="https://jesus.depablos.es" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline transition">Jesus de Pablos</a>
                        <span className="mx-1">by</span>
                        <a href="https://www.tligent.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline transition">Tligent</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
