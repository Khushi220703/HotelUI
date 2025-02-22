import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      price,
      name,
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

  return (
    <div style={styles.container}>
      {/* Location Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search by location"
          value={location}
          onChange={handleLocationChange}
          style={styles.input}
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

      {/* Price Input */}
      <div style={styles.inputContainer}>
        <input
          type="number"
          placeholder="Search by price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Name Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} style={styles.searchButton}>
        <FaSearch />
      </button>
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
    border: "none",
    height: "40px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
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
    width: "12%",
    height: "50px",
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
};

export default SearchBar;
