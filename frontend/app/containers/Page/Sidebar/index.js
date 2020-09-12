import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { actions } from '../Navbar/redux';
import { selectors } from './redux';

const Sidebar = props => {
  const currentPage = useSelector(state => '/' + state.router.location.pathname.split('/')[1]);
  console.log(currentPage);
  const sidebarVisibility = useSelector(selectors.sidebar);

  const dispatch = useDispatch();
  const pages = [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      target: '/',
    },
    {
      title: 'Live Monitor',
      icon: 'fas fa-satellite',
      target: '/live-monitor',
    },
    {
      title: 'Events',
      icon: 'far fa-calendar-plus',
      target: '/events',
    },
    {
      title: 'KE Calculator',
      icon: 'fas fa-calculator',
      target: '/calculator',
    },
    {
      title: 'Correction Calculator',
      icon: 'far fa-check-circle',
      target: '/correction-calculator',
    },
    {
      title: 'Blood Sugar',
      icon: 'fas fa-tint',
      target: '/blood-sugar',
    },
    {
      title: 'Fitness',
      icon: 'fas fa-heartbeat',
      target: '/fitness',
    },
    {
      title: 'Knowledge Base',
      icon: 'fas fa-book',
      target: '/knowledge-base',
    },
  ];

  // Needed for displaying page header on initial loading
  useEffect(() => {
    dispatch(
      actions.setPageHeader(
        pages.filter(page => page.target == currentPage)[0].title,
      ),
    );
  });

  const navigateToPage = (pageHeader, target) => {
    dispatch(push(target));
    dispatch(actions.setPageHeader(pageHeader));
  };

  return (
    <aside className={classnames({ 'sidebar-hide': !sidebarVisibility })}>
      <ul>
        {pages.map(page => (
          <li
            className={classnames({ active: page.target == currentPage })}
            onClick={() => navigateToPage(page.title, page.target)}
            key={page.target}
          >
            <i className={page.icon} />
            <span>{page.title}</span>
          </li>
        ))}

        <li className="version">
          <span className="font-weight-light">0.1-pre-alpha</span>
        </li>
      </ul>
    </aside>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
