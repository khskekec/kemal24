import produce from 'immer';
import { createSelector } from 'reselect';
import { actionTypeCreator, actionCreator } from '../../utils/redux-store';
import { actionTypes as navbarActionTypes } from '../Page/Navbar/redux';
import { actionTypes as sidebarActionTypes } from '../Page/Sidebar/redux';

const ac = actionTypeCreator('AUTH');

const actionTypes = {
  SET_CURRENT_USER: ac('SET_CURRENT_USER'),
};

const actions = {
  setCurrentUser: user =>
    actionCreator(actionTypes.SET_CURRENT_USER, { payload: user }),
};

export const globalSelector = state => state.global;

const selectors = {
  global: globalSelector,
  currentUser: createSelector(
    [globalSelector],
    global => global.currentUser,
  ),
  isAuthenticated: createSelector(
    [globalSelector],
    global => global.currentUser !== false,
  ),
};

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
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case navbarActionTypes.setPageHeader:
        draft.pageHeader = action.payload;
        break;
      case sidebarActionTypes.SET_SIDEBAR_VISIBILITY:
        draft.sidebarVisibility = action.payload;
        break;

      case sidebarActionTypes.TOGGLE_SIDEBAR_VISIBILITY:
        draft.sidebarVisibility = !state.sidebarVisibility;
        break;
      case actionTypes.SET_CURRENT_USER:
        draft.currentUser = action.payload;
    }
  });

export default reducer;

export { actionTypes, actions, selectors, reducer };
