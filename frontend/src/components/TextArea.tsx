import { useState, memo } from "react";

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  maxLength?: number;
  showCount?: boolean;
};

const TextArea = memo(function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  id,
  maxLength,
  showCount = false,
}: TextAreaProps) {
  const textareaId =
    id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;

  return (
    <div className="w-full">
      <div
        className={`acv-textarea-container ${isFocused ? "focused" : ""} ${hasValue ? "has-value" : ""}`}
      >
        <div className="acv-textarea-wrapper">
          <textarea
            id={textareaId}
            className="acv-textarea-field"
            value={value}
            placeholder={placeholder ?? ""}
            rows={rows}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value)}
          />
          <label
            htmlFor={textareaId}
            className={`acv-textarea-label ${isFocused || hasValue ? "active" : ""}`}
          >
            {label}
          </label>
        </div>
        {(showCount || maxLength) && (
          <div className="acv-textarea-footer">
            <span className={`acv-char-count ${isNearLimit ? "warning" : ""}`}>
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default TextArea;
