import React from 'react';
import PropTypes from 'prop-types';
import './Navbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from './redux';
import { actions } from '../Sidebar/redux';

const Navbar = () => {
  const pageHeader = useSelector(selectors.pageHeader);
  const dispatch = useDispatch();

  return (
    <header className="w-100 sticky-top">
      <div className="logo">K24</div>
      <div
        className="toggle d-flex flex-column"
        onClick={() => dispatch(actions.toggleSidebarVisibility())}
      >
        <div />
        <div />
        <div />
      </div>
      <div className="page-header">{pageHeader}</div>
      <div className="actions">
        <span>
          <i className="fa fa-bell" />
        </span>
        <span>
          <i className="fa fa-bell" />
        </span>
        <span>
          <i className="fa fa-bell" />
        </span>
      </div>
      <div className="avatar">
        <i className="fa-2x fal fa-power-off" />
      </div>
    </header>
  );
};

Navbar.propTypes = {};

export default Navbar;
