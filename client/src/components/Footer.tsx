import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} PetBnB - Find trusted care for your pets</p>
    </footer>
  );
}