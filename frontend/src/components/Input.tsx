import React, { useState, memo } from "react";
import { FiCheck } from "react-icons/fi";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: React.ReactNode;
  showValidation?: boolean;
};

const Input = memo(function Input({
  label,
  className = "",
  id,
  icon,
  showValidation,
  value,
  ...rest
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== "";

  return (
    <div className="w-full">
      <div
        className={`acv-input-container ${isFocused ? "focused" : ""} ${hasValue ? "has-value" : ""}`}
      >
        {icon && <div className="acv-input-icon">{icon}</div>}
        <div className="acv-input-wrapper">
          <input
            id={inputId}
            value={value}
            className={`acv-input-field ${label ? "with-label" : ""} ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={label ? "" : rest.placeholder}
            {...rest}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={`acv-input-label ${isFocused || hasValue ? "active" : ""}`}
            >
              {label}
            </label>
          )}
        </div>
        {showValidation && hasValue && (
          <div className="acv-input-validation">
            <FiCheck className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
});

export default Input;
