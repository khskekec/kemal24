/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { actionTypes as navbarActionTypes } from '../Page/Navbar/redux';
import { actionTypes as sidebarActionTypes } from '../Page/Sidebar/redux';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  pageHeader: null,
  sidebarVisibility: true,
  authenticated: false,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case actionTypes.setPageHeader:
        draft.pageHeader = action.payload;
        break;
      case sidebarActionTypes.SET_SIDEBAR_VISIBILITY:
        draft.sidebarVisibility = action.payload;
        break;

      case sidebarActionTypes.TOGGLE_SIDEBAR_VISIBILITY:
        draft.sidebarVisibility = !state.sidebarVisibility;
        break;
    }
  });

export default appReducer;
