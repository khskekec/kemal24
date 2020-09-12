import { createSelector } from 'reselect';
import { actionTypeCreator, actionCreator } from '../../../utils/redux-store';

const ac = actionTypeCreator('PAGE');

const actionTypes = {
  SET_SIDEBAR_VISIBILITY: ac('SET_SIDEBAR_VISIBILITY'),
  TOGGLE_SIDEBAR_VISIBILITY: ac('TOGGLE_SIDEBAR_VISIBILITY'),
};

const actions = {
  setSidebarVisibility: visibility =>
    actionCreator(actionTypes.SET_SIDEBAR_VISIBILITY, { payload: visibility }),
  toggleSidebarVisibility: () =>
    actionCreator(actionTypes.TOGGLE_SIDEBAR_VISIBILITY),
};

export const globalSelector = state => state.global;

const selectors = {
  global: globalSelector,
  sidebar: createSelector(
    [globalSelector],
    global => global.sidebarVisibility,
  ),
};

export { actionTypes, actions, selectors };
