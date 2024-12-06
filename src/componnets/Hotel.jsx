import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import {decodeToken} from "../assets/TokenDecode";
const HotelList = () => {
  const [hotels, setHotel] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [token,setToken] = useState({});
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    description: "",
    amenities: [],
    images: [],
    rating: 0,
    pricePerNight: 0,
  });

  const fetchHotel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}hotel/get-all-hotels`);
      const data = await response.json();
      setHotel(data);
    } catch (error) {
      console.log("Error while fetching hotels.", error);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleAmenityChange = (e) => {
    const { value } = e.target;
    setNewHotel((prev) => ({
      ...prev,
      amenities: value.split(","),
    }));
  };

useEffect(()=>{
  if (localStorage.getItem("token")) {
    setToken(decodeToken(localStorage.getItem("token")));
  }

},[])
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}hotel/add-hotel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHotel),
      });

      if (response.ok) {
        alert("Hotel added successfully");
        fetchHotel(); // Reload the hotels list
        setIsFormOpen(false); // Close the form
      } else {
        alert("Error adding hotel");
      }
    } catch (error) {
      console.log("Error while adding hotel.", error);
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Add Hotel Button */}
      {token.isAdmin  === "admin"?<button
        style={styles.authButton}
        onClick={() => setIsFormOpen(true)} // Open the form as a modal
      >
        Add Hotel
      </button>:""}

      {/* Hotel List */}
      <div style={styles.hotelList}>
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>

      {/* Modal for the Hotel Form */}
      {isFormOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add Hotel</h2>
            <button style={styles.closeButton} onClick={() => setIsFormOpen(false)}>X</button>
            <form onSubmit={handleFormSubmit} style={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Hotel Name"
                value={newHotel.name}
                onChange={handleFormChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newHotel.location.address}
                onChange={handleLocationChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={newHotel.location.city}
                onChange={handleLocationChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={newHotel.location.state}
                onChange={handleLocationChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={newHotel.location.postalCode}
                onChange={handleLocationChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={newHotel.location.country}
                onChange={handleLocationChange}
                required
                style={styles.input}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newHotel.description}
                onChange={handleFormChange}
                style={styles.textarea}
              />
              <input
                type="text"
                name="amenities"
                placeholder="Amenities (comma-separated)"
                value={newHotel.amenities.join(",")}
                onChange={handleAmenityChange}
                style={styles.input}
              />
              <input
                type="number"
                name="pricePerNight"
                placeholder="Price Per Night"
                value={newHotel.pricePerNight}
                onChange={handleFormChange}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: "20px",
  },
  authButton: {
    alignSelf: "flex-end", // To position the button on the right side
    padding: "12px 20px",
    backgroundColor: "#FF5A5F",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  authButtonHover: {
    backgroundColor: "#FF3B30",
  },
  hotelList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px", // Add spacing between cards
    width: "80%",
    marginTop: "20px",
  },
  modal: {
    position: "fixed",
    top:"15px",
    width:"100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "40%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "relative",
    animation: "fadeIn 0.3s ease-in-out",
    

  },
  modalTitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#FF5A5F",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    minHeight: "100px",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  submitButton: {
    backgroundColor: "#FF5A5F",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#FF3B30",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

export default HotelList;
