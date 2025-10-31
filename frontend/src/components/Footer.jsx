import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-950 text-white py-10 mt-12 w-full flex justify-center">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-wide">Resume Analyzer</h1>
          <p className="text-sm mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5">
          {[{
            icon: <FaFacebookF />,
            link: 'https://facebook.com'
          }, {
            icon: <FaTwitter />,
            link: 'https://twitter.com'
          }, {
            icon: <FaLinkedinIn />,
            link: 'https://linkedin.com'
          }, {
            icon: <FaGithub />,
            link: 'https://github.com/shankerpangeni'
          }].map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-blue-800 hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
            >
              <span className="text-white">{social.icon}</span>
            </a>
          ))}
        </div>

      </div>

     
    </footer>
  );
};

export default Footer;
