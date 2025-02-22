import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import { decodeToken } from "../assets/TokenDecode";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const HotelList = () => {
  const [hotels, setHotel] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [token, setToken] = useState({});
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

  const [searchParams] = useSearchParams();
  const tokens = searchParams.get("token");

  useEffect(() => {
    if (tokens) {
      verifyToken(tokens);
    }
  }, [tokens]);
  
  const verifyToken = async (token) => {
  console.log(token);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}user/verify`, { token });
      console.log("Token Verified:", response);
    } catch (error) {
      console.log(error);
      
      console.error("Token Verification Failed:", error.response?.data || error.message);
    }
  };

 
  const [currentPage, setCurrentPage] = useState(1); // Track the current page of the form
  const [totalPages, setTotalPages] = useState(4); // Total number of form pages

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
  
    const imageObjects = validImages.map((file) => ({ file, description: "" }));
  
    setNewHotel((prev) => ({
      ...prev,
      images: [...prev.images, ...imageObjects],
    }));
  };
  
  const handleImageDescriptionChange = (e, index) => {
    const { value } = e.target;
    setNewHotel((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index].description = value;
      return { ...prev, images: updatedImages };
    });
  };
  

  const handleImageRemove = (index) => {
    setNewHotel((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(decodeToken(localStorage.getItem("token")));
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newHotel.images.length < 3) {
      alert("Please add at least 3 images.");
      return;
    }

    
    try {
      let formData = new FormData();

    // Append basic fields
    formData.append("name", newHotel.name);
    formData.append("description", newHotel.description);
    formData.append("rating", newHotel.rating);
    formData.append("pricePerNight", newHotel.pricePerNight);

    // Append location fields explicitly
    for (const [key, value] of Object.entries(newHotel.location)) {
      formData.append(`location[${key}]`, value);
    }
    
    
    // Append amenities as a JSON string
    formData.append("amenities", newHotel.amenities);

    // Append images one by one
    newHotel.images.forEach((image, index) => {
      formData.append("images", image.file); 
      formData.append(`imageDescriptions`, image.description);
    });
    console.log(newHotel);
    
    console.log("FormData before submission:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

      
      const response = await fetch(`${process.env.REACT_APP_URL}hotel/add-hotel`, {
        method: "POST",
        body: formData,
      });
      console.log(response);
      
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
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
          </>
        );
      case 2:
        return (
          <>
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
          </>
        );
      case 3:
        return (
          <>
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
          </>
        );
        case 4:
          return (
            <>
              <input
                type="number"
                name="pricePerNight"
                placeholder="Price Per Night"
                value={newHotel.pricePerNight}
                onChange={handleFormChange}
                required
                style={styles.input}
              />
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                style={styles.input}
              />
              <div style={styles.imagePreviewContainer}>
                {newHotel.images.map((image, index) => (
                  <div key={index} style={styles.imagePreviewWithDescription}>
                    <div style={styles.imagePreview}>
                      <img
                        src={URL.createObjectURL(image.file)}
                        alt={`preview-${index}`}
                        style={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        style={styles.removeButton}
                      >
                        X
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Image Description"
                      value={image.description || ""}
                      onChange={(e) =>
                        handleImageDescriptionChange(e, index)
                      }
                      style={styles.input}
                    />
                  </div>
                ))}
              </div>
            </>
          );
        
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {token.isAdmin === "admin" ? (
        <button style={styles.authButton} onClick={() => setIsFormOpen(true)}>
          Add Hotel
        </button>
      ) : (
        ""
      )}

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
            <button style={styles.closeButton} onClick={() => setIsFormOpen(false)}>
              X
            </button>
            <form onSubmit={handleFormSubmit} style={styles.form}>
              {renderFormPage()}
              <div style={styles.navigationButtons}>
                <button type="button" onClick={handlePreviousPage} style={styles.navigationButton}>
                  Back
                </button>
                {currentPage === totalPages ? (
                  <button type="submit" style={styles.submitButton}>Submit</button>
                ) : (
                  <button type="button" onClick={handleNextPage} style={styles.navigationButton}>
                    Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  authButton:{
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  hotelList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "300px",
    marginBottom: "10px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "300px",
    height: "120px",
    marginBottom: "10px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "500px",
    position: "relative",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "5px",
  },
  navigationButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  navigationButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#FF5A5F",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  imagePreviewContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  imagePreview: {
    position: "relative",
    width: "100px", // Set a fixed size for preview
    height: "100px", // Set a fixed size for preview
    overflow: "hidden",
  },
  previewImage: {
    width: "100%", // Ensure image fits within the preview box
    height: "100%", // Maintain image aspect ratio
    objectFit: "cover", // Cover ensures the image fills the container while maintaining its aspect ratio
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "5px",
  },
};

export default HotelList;
