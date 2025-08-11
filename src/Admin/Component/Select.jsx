import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={`
          appearance-none
          flex h-10 w-full rounded-md border border-gray-200
          bg-white px-3 py-2 text-sm text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  );
});

Select.displayName = "Select";

const Option = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <option
      className={`text-sm text-gray-900 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </option>
  );
});

Option.displayName = "Option";

export { Select, Option };