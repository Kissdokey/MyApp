import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
const initialState = {
    playList: [], //0normal,1dark,2pink,3green,4,blue
    keyValue:{},
    keylyric:{},
    defaultVolume:0.7,
    currentPosition:0,
    currentIndex:0,
    playerStyle:0 ,//0外置，1内置
    likeList:[],
    likeInfoList:[]
};
// 定义Slice，里面包含了Reducers
// 使用Redux Toolkit不需要再繁琐的定义Actions
// 而是直接dispatch reducer中定义的方法即可，可以减少我们的模板代码
export const sceneSlice = createSlice({
    name: 'playList',
    initialState,
    reducers: {
        onChangeDefaultVolume: (state,value)=> {
            state.defaultVolume = value.payload
        },
        pushItem: (state,songInfo)=> {
            if(songInfo.payload.id in state.keyValue) {
                return
            }
            state.keyValue[songInfo.payload.id]=songInfo.payload.url  
            state.playList.push(songInfo.payload)
            state.currentIndex = state.playList.length-1
        },
        nextPlay:(state)=> {
            state.currentIndex=(state.currentIndex+1)%state.playList.length
        },
        lastPlay:(state)=> {
            state.currentIndex = state.currentIndex-1<0?state.playList.length-1:state.currentIndex-1
        },
        indexPlay:(state,index)=> {
            state.currentIndex = index.payload
        },
        setCurrentIndex:(state,index)=> {
            state.currentIndex = index.payload
        },
        setPlayerStyle:(state,type)=>{
            state.playerStyle = type.payload
        },
        setLyricInfo:(state,lyricInfo)=> {
            state.keylyric[lyricInfo.payload.id] = lyricInfo.payload.lyricInfo
        },
        setLikeList:(state,ids)=> {
            state.likeList = ids.payload
        },
        addLikeSong:(state,song)=> {
            state.likeList.push(song.payload)
        },
        deleteLikeSong:(state,index)=> {
            state.likeList.splice(index.payload,1)
        },
        setLikeInfoList:(state,infos)=> {
            state.likeInfoList = infos.payload
        },
        addLikeInfo:(state,info)=>{
            state.likeInfoList.push(info.payload)
        },
        deleteLikeInfo:(state,index)=> {
            state.likeInfoList.splice(index,1)
        },
        setCurrentPositions:(state,value)=> {
            state.currentPosition = value.payload
        }
    },
});
export const {setCurrentPositions,setLikeInfoList,addLikeInfo,deleteLikeInfo,deleteLikeSong,addLikeSong,pushItem,nextPlay,lastPlay,onChangeDefaultVolume,setCurrentIndex,indexPlay,setPlayerStyle,setLyricInfo,setLikeList} = sceneSlice.actions
export default sceneSlice.reducer

