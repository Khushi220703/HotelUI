import React from 'react';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Section 1: Links */}
        <div className="footer-links">
          <h3>Company</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
            <li><a href="/help">Help</a></li>
          </ul>
        </div>

        {/* Section 2: Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.svg" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/twitter.svg" alt="Twitter" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.svg" alt="Instagram" />
            </a>
          </div>
        </div>

        {/* Section 3: Language and Currency */}
        <div className="footer-settings">
          <h3>Settings</h3>
          <ul>
            <li><a href="/language">Language</a></li>
            <li><a href="/currency">Currency</a></li>
          </ul>
        </div>

        {/* Section 4: Newsletter */}
        <div className="footer-newsletter">
          <h3>Stay in Touch</h3>
          <p>Sign up to receive our newsletter and get the latest updates.</p>
          <form>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom: Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2024 Airbnb, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
