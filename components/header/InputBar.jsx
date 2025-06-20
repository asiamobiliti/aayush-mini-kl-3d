import SearchIcon from "./SearchIcon";
import { useRef } from "react";

export default function InputBar({ onValueChange, value, onSearch, onContainerClick }) {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const onValChange = (event) => {
    const newValue = event.target.value;
    onValueChange(newValue);
  };

  const handleClick = (e) => {
    if (
      inputRef.current?.contains(e.target) ||
      buttonRef.current?.contains(e.target)
    ) {
      e.stopPropagation();
    }
    if (onContainerClick) onContainerClick(e);
  };

  return (
    <div className="input-bar-container" onClick={handleClick} style={{ display: "flex" }}>
      <input
        type="search"
        value={value}
        onChange={onValChange}
        placeholder="Type Here"
        ref={inputRef}
        style={{ flex: 1, padding: "6px 8px", fontSize: "16px" }}
      />
      <button
        className="search-button"
        ref={buttonRef}
        onClick={() => onSearch(value)}
      >
        <SearchIcon size="17" color="white" />
      </button>
    </div>
  );
}
