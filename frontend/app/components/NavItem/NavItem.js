import React from 'react';
import "./NavItem.scss";

const NavItem = ({title, icon, onClick}) => {
  return <div className='card shadow-lg pb-4 navItem' onClick={onClick}>
    <div className='card-img text-center p-3'>
      {icon}
    </div>
    <div className='card-body font-weight-bold bg-brand color-white text-center'>
      {title}
    </div>
  </div>;
}

NavItem.propTypes = {

};

export default NavItem;
