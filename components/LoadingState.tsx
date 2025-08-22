
import React from 'react';

interface LoadingStateProps {
    message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
    return (
        <div className="mt-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-surface border-t-brand-accent rounded-full animate-spin"></div>
            <p className="text-brand-text-secondary text-center">{message}</p>
        </div>
    );
};
