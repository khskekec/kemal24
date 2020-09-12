import { createSelector } from 'reselect';
import { actionTypeCreator, actionCreator } from '../../../utils/redux-store';

const ac = actionTypeCreator('PAGE');

const actionTypes = {
  setPageHeader: ac('SET_HEADER'),
};

const actions = {
  setPageHeader: header =>
    actionCreator(actionTypes.setPageHeader, { payload: header }),
};

export const globalSelector = state => state.global;

const selectors = {
  global: globalSelector,
  pageHeader: createSelector(
    [globalSelector],
    global => global.pageHeader,
  ),
};

export { actionTypes, actions, selectors };
