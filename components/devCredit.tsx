import React from 'react'

const devCredit = () => {
  return (
    <div className="text-center text-gray-300 text-sm md:text-base mt-8">
    <p>
        Developed by{" "}
        <a 
            href="https://yourportfolio.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white font-semibold hover:underline"
        >
            DevTeam
        </a>
    </p>
    <p>© {2025} Merri. All rights reserved.</p>
</div>

  )
}

export default devCredit