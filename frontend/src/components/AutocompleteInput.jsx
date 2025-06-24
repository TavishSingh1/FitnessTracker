import React, { useState } from "react";
import "./AutocompleteInput.css";

export default function AutocompleteInput({ options, value, onChange, placeholder, label, onSelectOption, ...props }) {
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const filteredOptions = options.filter(
    (option) => option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option);
    setShowOptions(false);
    if (onSelectOption) onSelectOption(option);
  };

  return (
    <div className="autocomplete-input">
      {label && <label>{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        {...props}
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="autocomplete-options">
          {filteredOptions.map((option, idx) => (
            <li
              key={option + idx}
              onMouseDown={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
