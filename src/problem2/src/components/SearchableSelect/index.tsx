import { useState, useEffect, useRef, ReactNode, FC, ChangeEvent } from "react";
import "./styles.css";

interface OptionType {
  label: string | ReactNode;
  value: string;
}

interface SearchableSelectProps {
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
}

const SearchableSelect: FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isClearable = true,
  isSearchable = true,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.value.toString().toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectChange = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    onChange("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
      {isClearable && value && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ×
        </button>
      )}
      <div className="select-wrapper" style={{ width: "100%" }}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="dropdown-btn"
        >
          {selectedLabel || placeholder}{" "}
        </button>

        {isOpen && (
          <div ref={dropdownRef} className="dropdown">
            {isSearchable && (
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                className="search-dropdown"
                placeholder="Search..."
              />
            )}

            {filteredOptions.length === 0 ? (
              <div style={{ padding: "8px" }}>No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelectChange(option.value)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor:
                      value === option.value ? "#f0f0f0" : "white",
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableSelect;
