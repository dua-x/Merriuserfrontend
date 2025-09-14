import React from 'react';

const DevCredit = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center text-gray-300 text-sm md:text-base mt-8">
      <p>
        Developed by{" "}
        <a
          href="https://www.instagram.com/algerinet/?next=%2Fp%2FDNaYqNcKZEk%2F"
          target="_blank"
          rel="noopener noreferrer"
         aria-label="algerinet"
          className="text-white font-semibold hover:underline"
        >
          algerinet
        </a>
      </p>
      <p>© {currentYear} Merri. All rights reserved.</p>
    </div>
  );
};

export default DevCredit;
