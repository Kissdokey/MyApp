import sceneReducer from './bgColorSlice'
import playListSlice from './playListSlice';
import playListReducer from './playListSlice'
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
    //多个 reducer，访问数据时也需要通过多层获取
    //这里的名称，决定了获取数据时，需要访问的对象名称
    reducer: {
        scene: sceneReducer,
        list:playListSlice
    }
});
export default store;