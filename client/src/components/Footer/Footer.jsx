import React from "react";
import "../../styles/components/footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <h1>
          SPASIMPLIFY
        </h1>
        <span>
          K40/44 Nguyễn Lương Bằng,Hòa Khánh Nam, Liên Chiểu, Đà Nẵng.
        </span>
        <span>
         spamsimplify@gmail.com
        </span>
        <span>
         09202132112
        </span>
      </div>
      <div className="footer-last">
        <FaFacebookF/>
        <FaInstagram/>
        <FaTwitter/>
        <FaYoutube/>
      </div>
    </div>
  );
}
