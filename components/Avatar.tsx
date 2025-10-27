
import React, { useState, useEffect } from 'react';
import { getInitials } from '../utils';

interface AvatarProps {
    name: string;
    avatarUrl?: string;
    className?: string;
}

const colors = [
    'bg-pink-200 text-pink-800', 'bg-purple-200 text-purple-800', 'bg-indigo-200 text-indigo-800',
    'bg-blue-200 text-blue-800', 'bg-cyan-200 text-cyan-800', 'bg-teal-200 text-teal-800',
    'bg-green-200 text-green-800', 'bg-lime-200 text-lime-800', 'bg-yellow-200 text-yellow-800',
    'bg-orange-200 text-orange-800',
];

const getColorForName = (name: string): string => {
    if (!name) return 'bg-gray-200 text-gray-800';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

export const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, className }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [avatarUrl]);

    const showInitials = !avatarUrl || hasError;

    if (showInitials) {
        return (
            <div
                title={name}
                className={`rounded-full flex items-center justify-center font-bold uppercase ${getColorForName(name)} ${className}`}
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={avatarUrl}
            alt={name}
            title={name}
            onError={() => setHasError(true)}
            className={`rounded-full object-cover ${className}`}
        />
    );
};
