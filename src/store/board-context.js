import  { createContext } from 'react';

const BoardContext = createContext({
    activeToolItem : "",
    elements : [],
    history:[[]],
    index:0,
    toolActionType : "",
    changeToolItem : ()=>{},
    boardMouseDownHandler : ()=>{},
    boardMouseMoveHandler : ()=>{},
    boardMouseUpHandler : ()=>{},
    textAreaBlurHandler : ()=>{},
    undo: ()=>{},
    redo: ()=>{}
});

export default BoardContext;