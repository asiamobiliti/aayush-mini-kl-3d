import { useState, useContext } from "react";
import InputBar from "./InputBar";
import stopsData from "../../data/stops.json";
import { FlyToInterpolator } from "deck.gl";
import { ViewStateContext } from '../ViewStateContext';

export default function SearchBar() {
  const [showComponent, setShowComponent] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const { setViewState } = useContext(ViewStateContext);

  const recenter = (object) => {
    if (!object) return;
    const lon = object.stop_lon;
    const lat = object.stop_lat;

    setViewState(prev => ({
      ...prev,
      longitude: lon,
      latitude: lat,
      zoom: 17,
      pitch: 60,
      bearing: 0,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  };

  const onSearch = (searchTerm) => {
    const stop = stopsData.find(stop => stop.name === searchTerm);
    if (stop) {
      recenter(stop);
      // setInputValue(""); // Check on this (small issue)
    }
  };

  const filteredStops = stopsData.filter((stop) => {
    const searchTerm = inputValue.toLowerCase();
    return stop.name.toLowerCase().includes(searchTerm) && searchTerm !== "";
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && hoveredIndex > 0) {
      setHoveredIndex(prev => prev - 1);
    } else if (e.key === "ArrowDown" && hoveredIndex < filteredStops.length - 1) {
      setHoveredIndex(prev => prev + 1);
    } else if (e.key === "Enter" && hoveredIndex >= 0) {
      const selectedStop = filteredStops[hoveredIndex];
      if (selectedStop) {
        setInputValue(selectedStop.name);
        setShowComponent(false);
        onSearch(selectedStop.name);
      }
    } else if (e.key === "Enter" && hoveredIndex == -1 && filteredStops.length > 0) {
        const selectedStop = filteredStops[0];
        if (selectedStop) {
        setInputValue(selectedStop.name);
        setShowComponent(false);
        onSearch(selectedStop.name);
      }
    }
  };

  const handleToggle = () => {
    setShowComponent(prev => !prev);
    setHoveredIndex(-1);
  };

  const handleValueChange = (newValue) => {
    setInputValue(newValue);
    setHoveredIndex(-1);
  };

  const handleSelectStop = (name) => {
    setInputValue(name);
    setShowComponent(false);
    onSearch(name);
  };

  return (
    <div
      className="search-bar-container"
      style={{ position: "relative" }}
      onKeyDown={handleKeyDown}
      tabIndex={0} // to make div focusable for key events
    >
      <a
        id={inputValue != "" ? "search-station-extended": "search-station"}
        onClick={handleToggle}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "relative",
          userSelect: "none",
        }}
      >
        {showComponent ? (
          <div style={{ flex: 1, width: "100%" }}>
            <InputBar
              value={inputValue}
              onValueChange={handleValueChange}
              onSearch={onSearch}
            />
          </div>
        ) : (
          "STATION SEARCH"
        )}
      </a>

      {showComponent && inputValue && (
        <div className="dropdown" style={{ position: "absolute", width: "100%", backgroundColor: "white", border: "1px solid #ccc", zIndex: 1000 }}>
          {filteredStops.length > 0 ? (
            filteredStops.map((stop, idx) => (
              <div
                key={idx}
                className={`dropdown-row ${hoveredIndex === idx ? "dropdown-row-hover" : ""}`}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  backgroundColor: hoveredIndex === idx ? "#eee" : "transparent",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectStop(stop.name);
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(-1)}
              >
                {stop.name}
              </div>
            ))
          ) : (
            <div className="dropdown-row" style={{ padding: "8px" }}>
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
