import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 p-4 flex items-center gap-4 bg-transparent">
      <a
        href="https://github.com/rkn14/threejs-coverflow"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="assets/github-logo.png" alt="GitHub" className="w-8 h-8" />
      </a>
      <a href="https://rkn14.com" target="_blank" rel="noopener noreferrer">
        <img
          src="assets/gregory-lardon-developpeur-freelance.jpg"
          alt="Profil"
          className="w-8 h-8 rounded-full"
        />
      </a>
    </div>
  );
};

export default Footer;
