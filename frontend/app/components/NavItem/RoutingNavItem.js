import React from 'react';
import {useDispatch} from "react-redux";
import {push} from 'connected-react-router';
import NavItem from "./NavItem";


const RoutingNavItem = ({title, icon, targetUrl}) => {
  const dispatch = useDispatch();

  return <NavItem title={title} icon={icon} onClick={() => dispatch(push(targetUrl))} />
}

export default RoutingNavItem;
