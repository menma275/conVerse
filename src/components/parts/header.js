import Dropdown from "@/components/parts/dropdown";
import React from "react";
const Header = () => {
  return (
    <header>
      <div className="header pixel-shadow">
        <h1>
          <img src="/gundi-logo.svg" alt="Gundi" />
        </h1>
        <div className="user">
          <Dropdown />
        </div>
      </div>
    </header>
  );
};
export default Header;
