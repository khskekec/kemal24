/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import NotFoundPage from 'containers/NotFoundPage/Loadable';

import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Page/Navbar';
import Sidebar from '../Page/Sidebar';
import Content from '../Page/Content';
import CalculatorPage from '../CalculatorPage/Loadable';
import CorrectionCalculatorPage from '../CorrectionCalculatorPage';
import DashboardPage from '../DashboardPage';
import EventPage from '../EventPage';
import { selectors, actions } from './redux';
import LoginPage from '../LoginPage';
import EventModification from "../EventPage/EventModification";
export default function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectors.currentUser);

  if (!currentUser && localStorage.getItem('jwt')) {
    dispatch(actions.setCurrentUser(JSON.parse(localStorage.getItem('jwt'))));
  }

  if (!currentUser) {
    return <LoginPage />;
  }
  return (
    <div>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <Content>
          <Switch>
            <Route exact path="/" component={NotFoundPage} />
            <Route path="/calculator" component={CalculatorPage} />
            <Route exact path="/events" component={EventPage} />
            <Route exact path='/events/create' component={EventModification}/>
            <Route
              path="/correction-calculator"
              component={CorrectionCalculatorPage}
            />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </Content>
      </div>
    </div>
  );
}
