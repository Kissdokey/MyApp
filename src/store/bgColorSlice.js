import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
const initialState = {
    sceneColor: 0, //0normal,1dark,2pink,3green,4,blue
    defaultVolume:0.7,
    statusBarColor:'transparent'
};
// 定义Slice，里面包含了Reducers
// 使用Redux Toolkit不需要再繁琐的定义Actions
// 而是直接dispatch reducer中定义的方法即可，可以减少我们的模板代码
export const sceneSlice = createSlice({
    name: 'sceneType',
    initialState,
    reducers: {
        turnDark: (state) => {
            state.sceneColor = 1;
        },
        turnPink: (state) => {
            state.sceneColor = 2;
        },
        turnGreen: (state) => {
            state.sceneColor = 3;
        },
        turnBlue: (state) => {
            state.sceneColor = 4;
        },
        onChangeDefaultVolume: (state,value)=> {
            state.defaultVolume = value.payload
        }
    },
});
export const {turnDark,turnBlue,turnGreen,turnPink,onChangeDefaultVolume} = sceneSlice.actions
export default sceneSlice.reducer

