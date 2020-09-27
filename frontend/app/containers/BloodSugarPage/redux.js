import produce from 'immer';
import { createSelector } from 'reselect';
import { actionTypeCreator, actionCreator } from '../../utils/redux-store';

const ac = actionTypeCreator('BLOOD_SUGAR');

const actionTypes = {
  SET_DATE_RANGE: ac('SET_DATE_RANGE')
};

export const actions = {
  setDateRange: dateRange =>
    actionCreator(actionTypes.SET_DATE_RANGE, { payload: dateRange }),
  logout: () => actionCreator(actionTypes.LOGOUT, {  }),
};

export const globalSelector = state => state.bloodSugar;

export const selectors = {
  global: globalSelector,
  dateRange: createSelector(
    [globalSelector],
    global => global.dateRange,
  ),
  isAuthenticated: createSelector(
    [globalSelector],
    global => global.currentUser !== false,
  ),
};

export const initialState = {
  dateRange: null
};

const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case actionTypes.SET_DATE_RANGE:
        draft.dateRange = action.payload;
        break;
    }
  });

export default reducer;
