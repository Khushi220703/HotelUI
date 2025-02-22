import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const settings = {
    dots: true, // Enable dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Enable left and right arrows
    customPaging: () => (
      <div
        style={{
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "1px solid #ddd",
          position: "absolute",
          bottom: "30px"
        }}
      />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  const handleCardClick = () => {
   
    navigate(`/hotel/${hotel._id}`, { state: { hotel } });
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      {/* Image Carousel */}
      <div style={styles.imageContainer}>
        <Slider {...settings}>
          {hotel.images.map((image, index) => (
            <div key={index} style={styles.imageWrapper}>
              <img src={image.url} alt={`Hotel ${index}`} style={styles.image} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hotel Details */}
      <div style={styles.cardContent}>
        <h3 style={styles.hotelName}>{hotel.name}</h3>
        <p style={styles.hotelDescription}>
          {hotel.description.split(' ').slice(0, 10).join(' ')}
          {hotel.description.split(' ').length > 10 && '...'}
        </p>
        <div style={styles.priceSection}>
          <span style={styles.price}>${hotel.pricePerNight} / night</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    width: "400px",
    height: "550px",
    margin: "15px",
    cursor: "pointer",
    transition: "transform 0.3s ease",

  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },
  imageWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
  },
  cardContent: {
    padding: "15px",
  },
  hotelName: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 10px",
    fontFamily: "Arial, Helvetica, sans-serif"
  },
  hotelDescription: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  priceSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default HotelCard;
