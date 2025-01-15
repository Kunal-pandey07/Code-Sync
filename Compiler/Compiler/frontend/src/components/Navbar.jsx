import React from 'react';
import logo from '../images/logos/new.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="nav flex px-[100px] items-center justify-between h-[90px] bg-[#0f0e0e]">
      <img src={logo} className="w-[170px] object-cover" alt="Logo" />

      <div className="links flex items-center gap-[15px] text-white">
       

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            window.location.reload();
          }}
          type="button"
          className="btnNormal bg-red-500 transition-all hover:bg-red-600 px-[20px]"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
