import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Money Manager. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;