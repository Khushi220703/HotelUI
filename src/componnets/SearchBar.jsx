import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // State for person counts
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // State for tracking the focused input
  const [focusedInput, setFocusedInput] = useState("");

  const fetchLocationSuggestions = async (query) => {
    if (query.length > 0) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/search.php`,
          {
            params: {
              key: "pk.cd97eac39c7b5e7d9f5e48dad40018ad", // Replace with your LocationIQ API key
              q: query,
              format: "json",
              addressdetails: 1,
            },
          }
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions: ", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    fetchLocationSuggestions(value);
  };

  const handleSearch = async () => {
    const query = {
      location,
      rooms,
      startDate,
      endDate,
      adults,
      children,
      infants,
      pets,
    };
    console.log("Search Query: ", query);
    try {
      const searchResults = await axios.post("YOUR_API_ENDPOINT", query);
      console.log("Search Results: ", searchResults.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name); // Adjust based on LocationIQ response structure
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDatePickerClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Function to handle input focus
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  return (
    <div style={styles.container}>
      {/* Location Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={handleLocationChange}
          onFocus={() => handleFocus("location")}
          style={{
            ...styles.input,
            ...(focusedInput === "location" ? styles.focusedInput : styles.defaultInput),
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={styles.suggestionItem}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Check-In/Check-Out */}
      <div style={styles.dateContainer}>
        <div
          style={styles.dateInputContainer}
          onClick={handleDatePickerClick}
        >
          <input
            type="text"
            placeholder="Check-In"
            value={startDate ? startDate.toLocaleDateString() : ""}
            readOnly
            onFocus={() => handleFocus("startDate")}
            style={{
              ...styles.input,
              ...(focusedInput === "startDate" ? styles.focusedInput : styles.defaultInput),
            }}
          />
        </div>
        <div
          style={styles.dateInputContainer}
          onClick={handleDatePickerClick}
        >
          <input
            type="text"
            placeholder="Check-Out"
            value={endDate ? endDate.toLocaleDateString() : ""}
            readOnly
            onFocus={() => handleFocus("endDate")}
            style={{
              ...styles.input,
              ...(focusedInput === "endDate" ? styles.focusedInput : styles.defaultInput),
            }}
          />
        </div>
      </div>

      {/* Rooms Input */}
      <div style={styles.inputContainer}>
        <input
          type="number"
          min={1}
          placeholder="Rooms"
          value={rooms}
          onChange={(e) => setRooms(Number(e.target.value))}
          onFocus={() => handleFocus("rooms")}
          style={{
            ...styles.input,
            ...(focusedInput === "rooms" ? styles.focusedInput : styles.defaultInput),
          }}
        />
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} style={styles.searchButton}>
        <FaSearch />
      </button>

      {/* Date Picker Popup */}
      {showDatePicker && (
        <div style={styles.datePickerPopup}>
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            dateFormat="MM/dd/yyyy"
            calendarClassName="custom-calendar"
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "30px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    flexWrap: "wrap",
    width: "70%",
    margin: "auto",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "5px",
  },
  input: {
   
    outline: "none",
    padding: "10px",
    width: "200px",
    boxSizing: "border-box",
    border:"none",
    height:"40px",
    borderRadius:"5px"
  },
  focusedInput: {
   
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",

  },
  defaultInput: {
    borderColor: "#ccc",
  },
  dateContainer: {
    display: "flex",
    gap: "10px",
    position: "relative",
  },
  dateInputContainer: {
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  searchButton: {
    backgroundColor: "#ff385c",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10px",
    width:"12%",
    height:"50px"
  },
  suggestionsList: {
    position: "absolute",
    top: "40px",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
  },
  datePickerPopup: {
    position: "absolute",
    top: "55px",
    zIndex: 100,
    left: "15%",
  },
};



export default SearchBar;
