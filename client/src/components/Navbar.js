import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          جوابك
        </Link>
        <ul className="navbar-nav">
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('features')}
            >
              المميزات
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('how-it-works')}
            >
              كيف تعمل
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('faq')}
            >
              الأسئلة الشائعة
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('contact')}
            >
              تواصل معنا
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => scrollToSection('question-form')}
            >
              اطرح سؤال
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

