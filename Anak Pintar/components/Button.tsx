import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]";
  
  const variants = {
    primary: "bg-blue-400 hover:bg-blue-500 text-white border-b-blue-600",
    secondary: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-b-yellow-600",
    accent: "bg-purple-400 hover:bg-purple-500 text-white border-b-purple-600",
    success: "bg-green-400 hover:bg-green-500 text-white border-b-green-600",
    danger: "bg-red-400 hover:bg-red-500 text-white border-b-red-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      {...props}
    >
      {children}
    </button>
  );
};