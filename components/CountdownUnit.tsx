import React from 'react';

interface CountdownUnitProps {
  value: number;
  label: string;
  accentColor?: string;
}

/**
 * A presentational component to display a single unit of the countdown (e.g., Days, Hours).
 * It formats the numeric value to always be at least two digits.
 */
const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label, accentColor = '#000000' }) => {
  // Ensure the value is always two digits, e.g., 9 becomes "09"
  const formattedValue = String(value).padStart(2, '0');
  
  return (
    <div 
      className="flex flex-col items-center justify-center text-white p-3 sm:p-4 rounded-lg shadow-lg w-20 h-20 sm:w-24 sm:h-24 transition-all" 
      style={{ backgroundColor: accentColor }}
    >
      {/* The large numeric value of the countdown unit */}
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">{formattedValue}</span>
      {/* The label for the countdown unit (e.g., "Days") */}
      <span className="text-[10px] sm:text-xs uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
};

export default CountdownUnit;