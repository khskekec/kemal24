import React from 'react';
import PropTypes from 'prop-types';
import './Content.scss';

const Content = ({ children }) => <main>{children}</main>;

Content.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Content;
