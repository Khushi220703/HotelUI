import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Masonry } from '@mui/lab';
import PriceSection from './HotelDetailViewPriceSection';
import { Modal, Button } from '@mui/material'; // Modal and Button from MUI
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {decodeToken} from '../assets/TokenDecode';
import Loader from '../assets/loader';


const HotelDetailView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel } = location.state;
  const [isLoading,setIslaoding] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("hotelAdminEmail"));
  const id = useParams();
  const locations = [
    { lat: 40.730610, lng: -73.935242 }, // New York
  ];
 console.log(location.state);
 
  const [isHovered, setHovered] = React.useState(null);
  const [newReview, setNewReview] = useState({
    reviewer: '',
    comment: '',
    rating: 0,
  });

  const [openModal, setOpenModal] = useState(false); // State for opening modal
  
  const token =  decodeToken(localStorage.getItem("token"));
  
     
  const handleReviewSubmit = async () => {
    if (newReview.reviewer && newReview.comment && newReview.rating) {
      hotel.reviews.push(newReview);
      
      setIslaoding(true);
      
      console.log(token);
      const reviews = {
        _id:hotel._id,
        email:token.email,
        username:newReview.reviewer,
        comment:newReview.comment,
        rating:newReview.rating
      };

      try {
        const response = await  axios.patch(`${process.env.REACT_APP_URL}hotel/add-review`, reviews);
        setNewReview({ reviewer: '', comment: '', rating: 0 });
        console.log(response);
        
      } catch (error) {
        console.log("There is an error from server side", error);
        
      }   
      finally{
        setIslaoding(false);
      }  
    } else {
      alert('Please fill in all fields!');
    }
  };

  // Star Rating logic integrated directly
  const handleMouseEnter = (index) => {
    setNewReview((prev) => ({ ...prev, rating: index + 1 })); // Set rating on hover
  };

  const handleClick = (index) => {
    setNewReview((prev) => ({ ...prev, rating: index + 1 })); // Set rating on click
  };

  // Handle opening and closing the modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteHotel = async() => {
    setIslaoding(true);
    console.log(id);
    try {
      const response = await axios.delete(
       
        
        `${process.env.REACT_APP_URL}hotel/delete-hotel/:${id.id}`, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );
      console.log('Hotel deleted successfully:', response);
      navigate("/")
    } catch (error) {
      console.log('There was an error while deleting the hotel:', error);
    }
    finally{
      setIslaoding(false);
    }
    
    setOpenModal(false);
  };


  
  if(isLoading){
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <Loader/>
      </div>
    )
  }
  
 console.log(token);
 
  
  return (
    <div style={styles.container}>
     {token.isAdmin === "admin" ? <div style={styles.deleteButtonContainer}>
        <button onClick={handleOpenModal} style={styles.deleteButton}>
          Delete Hotel
        </button>
      </div>: null
     }

      {/* Image Gallery */}
      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
        {hotel.images.map((img, index) => (
          <div
            key={index}
            style={{
              ...styles.imageWrapper,
              gridColumn: index === 0 ? 'span 2' : 'span 1',
              gridRow: index === 0 ? 'span 2' : 'span 1',
              height: index === 0 ? '525px' : '250px',
            }}
          >
            <img
              src={img.url}
              alt={`Image ${index}`}
              style={{
                ...styles.image,
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={styles.overlay}>
              <p style={styles.imageDescription}>{img.description}</p>
            </div>
          </div>
        ))}
      </Masonry>

      {/* Hotel Details */}
      <div style={styles.details}>
        <h1 style={styles.hotelName}>{hotel.name}</h1>
        <p style={styles.description}>{hotel.description}</p>

        {/* Map Section */}
        <div style={styles.mapWrapper}>
          <h3>Hotel Location</h3>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAP_API_KEY">
            <GoogleMap mapContainerStyle={styles.containerStyle} center={locations[0]} zoom={4}>
              {locations.map((location, index) => (
                <Marker key={index} position={location} />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
        {token.isAdmin !== "admin"? <PriceSection pricePerNight={hotel.pricePerNight} />: null}

        {/* Amenities Section */}
        <div style={styles.amenitiesSection}>
          <h3>Amenities:</h3>
          <ul style={styles.amenitiesList}>
            {hotel.amenities[0].split(',').map((amenity, index) => (
              <li key={index} style={styles.amenityItem}>
                &#9733; {amenity}
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews Section */}
        <div style={styles.reviews}>
          <h3>Reviews:</h3>
          <div style={styles.reviewGrid}>
            {hotel.reviews.map((review, index) => (
              <div
                key={index}
                style={{
                  ...styles.reviewBox,
                  ...(isHovered === index ? styles.reviewBoxHover : {}),
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <p style={styles.reviewerName}>{review.username}</p>
                <p style={styles.reviewComment}>{review.comment}</p>

                {/* Star Rating for Review */}
                <div style={styles.starRating}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        ...styles.star,
                        color: review.rating > i ? '#FF7043' : '#ddd', // Color stars based on rating
                      }}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Review Section */}
        {token.isAdmin !== "admin" ? <div style={styles.newReviewSection}>
          <h3>Submit Your Review</h3>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.reviewer}
              onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              style={styles.textarea}
            />

            {/* Star Rating */}
            <div>
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  style={{
                    ...styles.star,
                    color: newReview.rating > index ? '#FF7043' : '#ddd', // Color the stars based on rating
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleClick(index)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <button onClick={handleReviewSubmit} style={styles.submitButton}>
              Submit
            </button>
          </div>
        </div> : null}
      </div>

      {/* Modal for Delete Confirmation */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={styles.modal}>
          <h3>Are you sure you want to delete this hotel?</h3>
          <div style={styles.modalActions}>
            <Button onClick={handleCloseModal} variant="outlined" style={styles.cancelButton}>
              Cancel
            </Button>
            <Button onClick={handleDeleteHotel} variant="contained" color="error" style={styles.deleteButton}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1700px',
    margin: '0 auto',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  imageWrapper: {
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  },
  imageDescription: {
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
  },
  details: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  deleteButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  deleteButton: {
    backgroundColor: '#FF7043',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  hotelName: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  mapWrapper: {
    marginBottom: '20px',
  },
  containerStyle: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
  },
  amenitiesSection: {
    marginBottom: '20px',
  },
  amenitiesList: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  amenityItem: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '10px',
  },
  reviews: {
    marginBottom: '20px',
  },
  reviewGrid: {
    display: 'grid',
    gap: '20px',
  },
  reviewBox: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  reviewBoxHover: {
    backgroundColor: '#e9e9e9',
  },
  reviewerName: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#666',
  },
  starRating: {
    marginTop: '5px',
  },
  star: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  newReviewSection: {
    marginTop: '30px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '80px',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#FF7043',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '300px',
    margin: 'auto',
    marginTop: '150px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  cancelButton: {
    border: '1px solid #ddd',
  },
  // deleteButton: {
  //   backgroundColor: '#FF5A5F',
  //   color: '#fff',
  //   border:"none",
  //   borderRadius:"5px",
  //   height:"40px",
  //   width:"110px"
    
  // },
};

export default HotelDetailView;
