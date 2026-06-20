import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { searchCategories, getCategoryIcon } from '../utils/categoryHelper';

const AutocompleteDropdown = ({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Tìm ngành nghề...',
  disabled = false,
  error = null,
  required = false,
  label = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Search categories
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const results = searchCategories(searchQuery);
    setSuggestions(results);
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onChange) onChange(val);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.displayText);
    if (onChange) onChange(suggestion.displayText);
    if (onSelect) onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        setIsOpen(true);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear input
  const handleClear = () => {
    setSearchQuery('');
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        <div className={`relative flex items-center border-2 rounded-lg transition-colors ${
          error
            ? 'border-red-300 bg-red-50'
            : isOpen
            ? 'border-indigo-500 bg-white'
            : 'border-slate-200 bg-white hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}>

          {/* Search Icon */}
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsOpen(true);
              if (searchQuery.trim().length > 0) {
                setSuggestions(searchCategories(searchQuery));
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-10 py-2.5 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder-slate-400 disabled:cursor-not-allowed"
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Dropdown arrow */}
          {!searchQuery && (
            <ChevronDown className={`absolute right-3 w-4 h-4 text-slate-400 transition-transform pointer-events-none ${
              isOpen ? 'rotate-180' : ''
            }`} />
          )}
        </div>

        {/* Dropdown suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.parent
                ? getCategoryIcon(suggestion.parent.icon)
                : getCategoryIcon(suggestion.icon);

              return (
                <div
                  key={`${suggestion.id}-${suggestion.type}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${
                    index === highlightedIndex
                      ? 'bg-indigo-50'
                      : index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  } hover:bg-indigo-100`}
                >
                  {/* Icon */}
                  <IconComponent className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800">
                      {suggestion.name}
                    </div>
                    {suggestion.parent && (
                      <div className="text-xs text-slate-400 font-medium">
                        {suggestion.parent.name}
                      </div>
                    )}
                  </div>

                  {/* Badge for child category */}
                  {suggestion.type === 'child' && (
                    <span className="flex-shrink-0 inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded whitespace-nowrap">
                      Ngành con
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {isOpen && searchQuery.trim().length > 0 && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4">
            <p className="text-sm text-slate-500 text-center">
              Không tìm thấy ngành nghề nào
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-semibold">{error}</p>
      )}

      {/* Helper text */}
      {!error && (
        <p className="mt-1 text-xs text-slate-400">
          {suggestions.length > 0 ? `${suggestions.length} kết quả tìm thấy` : ''}
        </p>
      )}
    </div>
  );
};

export default AutocompleteDropdown;
