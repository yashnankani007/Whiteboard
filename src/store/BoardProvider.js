import React, { useCallback, useReducer } from 'react'
import BoardContext from './board-context'
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createElement, getSvgPathFromStroke ,isPointNearToElement} from '../utils/element';
import getStroke from 'perfect-freehand';

const boardReducer = (state,action) => {
    switch(action.type){
        case BOARD_ACTIONS.CHANGE_TOOL:
            {
                return {
                    ...state,
                    activeToolItem :action.payload.tool
                }
            }
        case BOARD_ACTIONS.DRAW_DOWN:
            {
                const prevElements = state.elements;
                const {clientX,clientY, size,stroke,fill} = action.payload;
                const newElement=createElement(
                    state.elements.length,
                    clientX,
                    clientY,
                    clientX,
                    clientY,
                    {type: state.activeToolItem,size,stroke,fill}
                    );
                return {
                    ...state,
                    toolActionType:
                      state.activeToolItem === TOOL_ITEMS.TEXT ? 
                      TOOL_ACTION_TYPES.WRITING : 
                      TOOL_ACTION_TYPES.DRAWING,
                    elements:[...prevElements,newElement]
                };
            }
        case BOARD_ACTIONS.DRAW_MOVE:
            {

                const newElements = [...state.elements];
                const {clientX,clientY} = action.payload;
                const index = state.elements.length-1;
                const {type} = newElements[index];
                switch (type) {
                    case TOOL_ITEMS.LINE:
                    case TOOL_ITEMS.RECTANGLE:
                    case TOOL_ITEMS.CIRCLE:
                    case TOOL_ITEMS.ARROW:{
                        const {x1,y1,size,stroke,fill} = newElements[index];
                        newElements[index] = createElement(
                            index,
                            x1,
                            y1,
                            clientX,
                            clientY,
                            {type : state.activeToolItem,size,stroke,fill}
                        );
                        return {
                            ...state,
                            elements:newElements
                        };
                    }    
                    case TOOL_ITEMS.BRUSH:{
                        newElements[index].points=[
                            ...newElements[index].points,
                            {x:clientX,y:clientY}
                        ];
                        newElements[index].path=new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points)));
                        return {
                            ...state,
                            elements:newElements
                        };
                    }
                    default:
                        throw new Error ("Type not recognized");
                }
                
            }
        case BOARD_ACTIONS.DRAW_UP:
            {
                const newHistory = state.history.slice(0,state.index+1);
                const elements = [...state.elements];
                newHistory.push(elements);
                return {
                    ...state,
                    history:newHistory,
                    index: state.index+1
                }
            }
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
        {
            return {
                ...state,
                toolActionType:action.payload.actionType
            };
        }
        case BOARD_ACTIONS.ERASE:
            {   
                const {clientX,clientY} = action.payload;
                let newElements = [...state.elements];
                newElements=newElements.filter((element)=>{
                    return !isPointNearToElement(element,clientX,clientY);
                });
                const newHistory = state.history.slice(0,state.index+1);
                newHistory.push(newElements);
                
                return {
                    ...state,
                    elements:newElements,
                    history:newHistory,
                    index: state.index+1
                };
            }
        case BOARD_ACTIONS.CHANGE_TEXT:
            {
                const newElements = [...state.elements];
             
                const index = newElements.length-1;
                newElements[index].text =action.payload.text;
                
                const newHistory = state.history.slice(0,state.index+1);
                newHistory.push(newElements);
                
                return{
                    ...state,
                    toolActionType:TOOL_ACTION_TYPES.NONE,
                    elements:newElements,
                    history:newHistory,
                    index: state.index+1
                };
            }
        case BOARD_ACTIONS.UNDO:{
            if(state.index<=0)
            return state;
            const index = state.index-1;
            const newElements = state.history[index];
            return {
                ...state,
                elements:newElements,
                index:index
            };
        }
        case BOARD_ACTIONS.REDO:{
            if(state.index>=state.history.length-1)
            return state;
            const index = state.index+1;
            const newElements = state.history[index];
            return {
                ...state,
                elements:newElements,
                index:index
            };
        }

        default :
            return state;
    }
};
const initalBoardState={
    activeToolItem : TOOL_ITEMS.BRUSH,
    elements : [],
    history:[[]],
    index:0,
    toolActionType:TOOL_ACTION_TYPES.NONE
};
const BoardProvider = ({children}) => {
    const [boardState,dispacthBoardAction] = useReducer(boardReducer,initalBoardState);
    const changeToolItem = (tool) =>{
        dispacthBoardAction({ 
            type : BOARD_ACTIONS.CHANGE_TOOL,
            payload:
                {
                    tool
                }
            });
    };
    
    const boardMouseDownHandler=(event,toolBoxState)=>{
        
        if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)
            return;
        if( boardState.activeToolItem === TOOL_ITEMS.ERASER){
            dispacthBoardAction({
                type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload:{
                    actionType: TOOL_ACTION_TYPES.ERASING
                } 
            });
            return;
        }
        
        const clientX = event.clientX;
        const clientY = event.clientY;
        const size = toolBoxState[boardState.activeToolItem]?.size;
        const stroke = toolBoxState[boardState.activeToolItem]?.stroke;
        const fill = toolBoxState[boardState.activeToolItem]?.fill;
        
        dispacthBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload:{
                clientX,
                clientY,
                size,
                stroke,
                fill
            }
        })
    };
    const boardMouseMoveHandler=(event)=>{
        if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)
            return;
        const clientX = event.clientX;
        const clientY = event.clientY;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING)
        {
            dispacthBoardAction({
                type:BOARD_ACTIONS.ERASE,
                payload:{
                    clientX,
                    clientY
                }
            });
        }
        else if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){
            dispacthBoardAction({
                type: BOARD_ACTIONS.DRAW_MOVE,
                payload:{
                    clientX,
                    clientY
                }
            });
        }
    };
    const boardMouseUpHandler=()=>{
        if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)
            return;
        dispacthBoardAction({
            type: BOARD_ACTIONS.DRAW_UP
        })
        dispacthBoardAction({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload:{
                actionType: TOOL_ACTION_TYPES.NONE
            },
        });
    };
    const textAreaBlurHandler = (text) =>{
        dispacthBoardAction({
            type:BOARD_ACTIONS.CHANGE_TEXT,
            payload:{
                text
            }
        });
    }
    const unodClickHandler = useCallback(()=>{
        dispacthBoardAction({
            type:BOARD_ACTIONS.UNDO
        });
    },[]);
    const redoClickHandler = useCallback(()=>{
        dispacthBoardAction({
            type:BOARD_ACTIONS.REDO
        });
    },[]);
    const BoardContextValue ={
        activeToolItem : boardState.activeToolItem,
        elements: boardState.elements,
        toolActionType: boardState.toolActionType, 
        changeToolItem,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        undo:unodClickHandler,
        redo:redoClickHandler
    };
  return (
    <BoardContext.Provider value ={BoardContextValue}>{children}</BoardContext.Provider>
  );
}

export default BoardProvider;