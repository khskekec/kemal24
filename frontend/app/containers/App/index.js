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
import BloodSugarPage from "../BloodSugarPage";
import DailyAvg from "../BloodSugarPage/DailyAvg";
import HourlyAvg from "../BloodSugarPage/HourlyAvg";
import DailyHourlyAvg from "../BloodSugarPage/DailyHourlyAvg";
import Chart from "../BloodSugarPage/Chart";
import {LiveMonitorPage} from "../LiveMonitorPage";
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
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <Content>
          <Switch>
            <Route exact path="/" component={DashboardPage} />
            <Route path="/calculator" component={CalculatorPage} />
            <Route exact path="/events" component={EventPage} />
            <Route exact path='/events/create' component={EventModification}/>
            <Route
              path="/correction-calculator"
              component={CorrectionCalculatorPage}
            />
            <Route
              path="/live-monitor"
              component={LiveMonitorPage}
            />
            <Route
              path="/blood-sugar/chart"
              component={Chart}
            />
            <Route
              path="/blood-sugar/daily-hourly-avg"
              component={DailyHourlyAvg}
            />
            <Route
              path="/blood-sugar/daily-avg"
              component={DailyAvg}
            />
            <Route
              path="/blood-sugar/hourly-avg"
              component={HourlyAvg}
            />
            <Route
              path="/blood-sugar"
              component={BloodSugarPage}
            />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </Content>
      </div>
    </div>
  );
}
