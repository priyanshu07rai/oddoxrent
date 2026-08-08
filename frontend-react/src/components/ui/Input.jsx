import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}, ref) => {
  const inputId = id || React.useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`input-base ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
