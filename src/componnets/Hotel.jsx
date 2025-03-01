import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import { decodeToken } from "../assets/TokenDecode";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaHotel, FaMapMarkerAlt, FaCity, FaGlobe, FaDollarSign, FaImages } from "react-icons/fa";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import js from "@eslint/js";


const HotelList = () => {
  const [hotels, setHotel] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [token, setToken] = useState({});
  const [email, setEmail] = useState(localStorage.getItem("hotelAdminEmail") || "kj365268@gmail.com");
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
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const tokens = searchParams.get("token");
  const steps = ["Hotel Details", "Hotel Location", "Price", "Amenities & Images"];
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

  const validatePage = () => {
    let newErrors = {};
    
    
    if (currentPage === 1) {
     
      
      if (!newHotel.name.trim()) newErrors.name = "Hotel name is required";
      if (!newHotel.location.address.trim()) newErrors.address = "Address is required";
      if (!newHotel.location.city.trim()) newErrors.city = "City is required";
    
     
    }

    if (currentPage === 2) {
      if (!newHotel.location.state.trim()) newErrors.state = "State is required";
      if (!newHotel.location.postalCode.trim()) newErrors.postalCode = "Postal code is required";
      if (!newHotel.location.country.trim()) newErrors.country = "Country is required";
      
    }

    if (currentPage === 3) {
      
      
      if (!newHotel.description.trim()) newErrors.description = "Description is required";
      if (newHotel.pricePerNight === 0) newErrors.pricePerNight = "Price per night is required";
     
      
    }

    if(currentPage === 4){
      if (newHotel.amenities.length === 0) newErrors.amenities = "At least one amenity is required";
      console.log(newErrors);
      
    }

    setErrors(newErrors);
    
    
    return Object.keys(newErrors).length === 0;
  };

  const imageCount = newHotel.images.length;
  const imageSize = Math.max(80, 150 - imageCount * 10); // Shrink size
  const inputWidth = imageSize + 20; // Slightly wider than image

  const [currentPage, setCurrentPage] = useState(1); // Track the current page of the form
  const [totalPages, setTotalPages] = useState(4); // Total number of form pages

  const fetchHotel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}hotel/get-all-hotels/${email}`);
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

    if (validatePage()) {
        try {
            let formData = new FormData();
            formData.append("name", newHotel.name);
            formData.append("description", newHotel.description);
            formData.append("rating", newHotel.rating);
            formData.append("pricePerNight", newHotel.pricePerNight);
            formData.append("email", newHotel.email || "default@example.com");

            // ✅ Convert Objects to Strings
            formData.append("location", newHotel.location ? JSON.stringify(newHotel.location) : "{}");
            formData.append("amenities", newHotel.amenities ? JSON.stringify(newHotel.amenities) : "[]");

            newHotel.images.forEach((image) => {
              if (image.file.size > 10 * 1024 * 1024) { // 10MB limit
                  alert(`File ${image.file.name} is too large!`);
                  return;
              }
          });
          

            // ✅ Append Images Properly
            newHotel.images.forEach((image, index) => {
                if (image.file instanceof File) {
                    formData.append("images", image.file);
                } else {
                    console.error(`Image at index ${index} is not a File object`, image.file);
                }
            });

            // ✅ Send Image Descriptions as Multiple Fields or JSON
            const imageDescriptions = newHotel.images.map((image) => image.description);
            formData.append("imageDescriptions", JSON.stringify(imageDescriptions));

            // ✅ Debug FormData Before Sending
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.post(
                `${process.env.REACT_APP_URL}hotel/add-hotel`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                   
                }
            );

            console.log("Server Response:", response);

            if (response.status === 201) {
                alert("Hotel added successfully");
                fetchHotel();
                setIsFormOpen(false);
            } else {
                console.log("Error Response from Server:", response.data);
            }
        } catch (error) {
            console.log("Error while adding hotel:", error);
        }
    }
};



  const handleNextPage = () => {
   
    
    if (validatePage()) {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setActiveStep((prev) => prev + 1)
    }
  }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setActiveStep((prev) => prev - 1)
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
              error={!!errors.name}
              
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newHotel.location.address}
              onChange={handleLocationChange}
              required
              style={styles.input}
              error={!!errors.address}
             
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newHotel.location.city}
              onChange={handleLocationChange}
              required
              style={styles.input}
              error={!!errors.city}
             
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
              error={!!errors.state}
             
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={newHotel.location.postalCode}
              onChange={handleLocationChange}
              required
              style={styles.input}
              error={!!errors.postalCode}
             
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={newHotel.location.country}
              onChange={handleLocationChange}
              required
              style={styles.input}
              error={!!errors.country}
              
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
              error={!!errors.description}
              
            />
            <input
              type="number"
              name="pricePerNight"
              placeholder="Price Per Night"
              value={newHotel.pricePerNight}
              onChange={handleFormChange}
              required
              style={styles.input}
              error={!!errors.pricePerNight}
              
            />
          </>
        );
      case 4:
        return (
          <>

            <input
              type="text"
              name="amenities"
              placeholder="Amenities (comma-separated)"
              value={newHotel.amenities.join(",")}
              onChange={handleAmenityChange}
              style={styles.input}
              error={!!errors.amenities}
             
            />
           <div style={styles.imageContainer}>
      {/* Custom Upload Button */}
      <label htmlFor="upload-image" style={styles.uploadButton}>
        Upload Images
      </label>
      <input
        id="upload-image"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      {/* Image Previews */}
      <div style={styles.imagePreviewContainer}>
        {newHotel.images.map((image, index) => (
          <div key={index} style={styles.imagePreviewWithDescription}>
            <div style={{ ...styles.imagePreview, width: imageSize, height: imageSize }}>
              <img
                src={URL.createObjectURL(image.file)}
                alt={`preview-${index}`}
                style={{ ...styles.previewImage, width: imageSize, height: imageSize }}
              />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                style={styles.removeButton}
              >
                ✖
              </button>
            </div>
            <input
              type="text"
              placeholder="Image Description"
              value={image.description || ""}
              onChange={(e) => handleImageDescriptionChange(e, index)}
              style={{
                ...styles.imageInput,
                width: inputWidth,
                fontSize: Math.max(12, 16 - imageCount * 1), // Reduce font size
              }}
              
            />
          </div>
        ))}
      </div>
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
        <button style={styles.authButton} onClick={() => setIsFormOpen(true)} >
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
        <motion.div style={styles.modal} initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle} >Add Hotel</h2>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepIcon-root": { color: "#B0B0B0 !important" },
                "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
                  color: "#FF5A5F !important",
                },
                "& .MuiStepLabel-label": { color: "#B0B0B0 !important" },
                "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
                  color: "#FF5A5F !important",
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>




            <button style={styles.closeButton} onClick={() => setIsFormOpen(false)}>
              X
            </button>
            <div>
               {Object.keys(errors).length > 0 && <p className="text-red-500">Please fill all details carefully!</p>}
            </div>


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
        </motion.div>
      )}
    </div>
  );
};

const styles = {
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
    width: "90%",
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
    color: "#FF5A5F",
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
    backgroundColor: "#FF5A5F",
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
    width:"80%",
    height:"100px"
  },
  imagePreview: {
    position: "relative",
    width: "100px", // Set a fixed size for preview
    height: "100px", // Set a fixed size for preview
    overflow:"hidden",
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
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px",
    border: "2px dashed #FF5A5F",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "500px",
    margin: "auto",
    marginBottom:"20px"
  },
  uploadButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#FF5A5F",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
  },
  imagePreviewContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
   
  },
  imagePreviewWithDescription: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  imagePreview: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
  },
  previewImage: {
    objectFit: "cover",
    borderRadius: "10px",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  imageInput: {
    padding: "5px",
    width: "90%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
};

export default HotelList;


