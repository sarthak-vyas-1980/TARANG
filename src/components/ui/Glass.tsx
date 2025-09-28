import React from 'react';


export const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div
  className={`glass-card rounded-2xl shadow-xl p-6 mb-4 transition-all duration-300 animate-fadein border bg-white/90 border-blue-100/40 dark:bg-darknavy/80 dark:border-neon-blue dark:shadow-neon-blue dark:text-lightgray dark:[text-shadow:0_0_8px_#3b82f6,0_0_2px_#14b8a6] ${className}`}
  style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
  >
    {children}
  </div>
);

export const GlassButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button className={`glass-button ${className}`} {...props} />
);

export const GlassInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input className={`glass-input ${className}`} {...props} />
);

export const GlassTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea className={`glass-input ${className}`} {...props} />
);
