import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);
console.log(store.getState());
console.log('tesging');

export default store;
