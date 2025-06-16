import { useState, useEffect, useRef } from 'react';

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  letterSequence: string;
}

export default function WordInput({ value, onChange, onSubmit, disabled, letterSequence }: WordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  useEffect(() => {
    const containsSequence = value.toLowerCase().includes(letterSequence.toLowerCase());
    setIsValid(containsSequence && value.length >= 3);
  }, [value, letterSequence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !disabled) {
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !disabled) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className={`flex-1 px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
            disabled
              ? 'bg-gray-100 border-gray-300 text-gray-500'
              : isValid
              ? 'border-green-500 focus:border-green-600'
              : 'border-gray-300 focus:border-purple-500'
          }`}
          placeholder={`Word with "${letterSequence}"`}
          maxLength={30}
        />
        <button
          type="submit"
          disabled={!isValid || disabled}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isValid && !disabled
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
      {value && !isValid && (
        <p className="text-red-500 text-sm mt-2">
          Word must contain "{letterSequence}" and be at least 3 letters long
        </p>
      )}
    </form>
  );
}