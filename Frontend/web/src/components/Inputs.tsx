import React from 'react';

interface InputProps {
  name: string;
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  className?: string;
  error?: string; 
}

const Input: React.FC<InputProps> = ({ name, type, label, required, placeholder, value, onChange, className, error }) => {
  return (
    <div className={`relative max-w-xs mx-auto ${className}`}>
      <label htmlFor={name} className="block text-gray-700 mb-2 text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange} 
        className={`w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out ${error ? 'border-red-500' : 'border-gray-300'}`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;



