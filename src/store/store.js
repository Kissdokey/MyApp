import sceneReducer from './bgColorSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import playListSlice from './playListSlice';
import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
const reducers = combineReducers({
  scene: sceneReducer,
  list: playListSlice,
});
const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
  // 黑名单 不缓存的
  blacklist: ['page404'],
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  //多个 reducer，访问数据时也需要通过多层获取
  //这里的名称，决定了获取数据时，需要访问的对象名称
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});
export default store;
