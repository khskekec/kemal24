const actionTypeCreator = prefix => action => `${prefix}/${action}`;
const actionCreator = (action, params = {}) => ({ type: action, ...params });
export { actionTypeCreator, actionCreator };
