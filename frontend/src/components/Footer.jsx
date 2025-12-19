import '../styles/header-footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Projects</a></li>
              <li><a href="#">Gallery</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Important Links</h3>
            <ul className="footer-links">
              <li><a href="#">Government Portal</a></li>
              <li><a href="#">Tenders</a></li>
              <li><a href="#">Circulars</a></li>
              <li><a href="#">RTI</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt"></i> Urban Development Department, Lucknow</li>
              <li><i className="fas fa-phone"></i> +91-XXX-XXXXXXX</li>
              <li><i className="fas fa-envelope"></i> info@urbanstormwater.up.gov.in</li>
            </ul>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for updates and notifications.</p>
            <div className="newsletter-form">
              <input type="email" className="form-control mb-2" placeholder="Your email address" />
              <button className="btn btn-warning w-100">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center mt-3">
          <p>&copy; 2025 Urban Storm Water Drainage Scheme, Uttar Pradesh. All Rights Reserved.</p>
          <p>Designed & Developed by Urban Development Department, Government of Uttar Pradesh</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
