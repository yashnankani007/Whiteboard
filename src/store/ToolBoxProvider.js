import React, { useReducer } from 'react'
import toolBoxContext from './toolbox-context';
import { COLORS, TOOLBOX_ACTIONS, TOOL_ITEMS } from '../constants';
function toolBoxReducer (state,action){
    switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE:
            {
                const newState = {...state};
                newState[action.payload.tool].stroke = action.payload.stroke;
                return newState;
            }
        case TOOLBOX_ACTIONS.CHANGE_FILL:
            {
                const newState = {...state};
                newState[action.payload.tool].fill = action.payload.fill;
                return newState;
            }
        case TOOLBOX_ACTIONS.CHANGE_SIZE:
            {
                const newState = {...state};
                newState[action.payload.tool].size = action.payload.size;
                return newState;
            }
        default:
            return state;
    }
}
const initalToolBoxState ={
    [TOOL_ITEMS.BRUSH]:{
        stroke:COLORS.BLACK,
    },
    [TOOL_ITEMS.LINE]:{
        size:1,
        stroke:COLORS.BLACK
    },
    [TOOL_ITEMS.RECTANGLE]:{
        size:1,
        stroke:COLORS.BLACK,
        fill: null
    },
    [TOOL_ITEMS.CIRCLE]:{
        size:1,
        stroke:COLORS.BLACK,
        fill:null
    },
    [TOOL_ITEMS.ARROW]:{
        size:1,
        stroke:COLORS.BLACK
    },
    [TOOL_ITEMS.TEXT]:{
        size:32,
        stroke:COLORS.BLACK
    }
}
const ToolBoxProvider = ({children}) => {
    const [toolBoxState,dispatchToolBoxAction] =useReducer(toolBoxReducer,initalToolBoxState);
    const changeStrokeHandler = (tool, stroke)=>{
        dispatchToolBoxAction({
            type:TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload :{
                stroke:stroke,
                tool:tool
            }
        })
    }
    const changeFillHandler = (tool, fill)=>{
        dispatchToolBoxAction({
            type:TOOLBOX_ACTIONS.CHANGE_FILL,
            payload :{
                fill:fill,
                tool:tool
            }
        })
    }
    const changeSizeHandler = (tool, size)=>{
        dispatchToolBoxAction({
            type:TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload :{
                size:size,
                tool:tool
            }
        })
    }
    const toolBoxContextValue = {
        toolBoxState,
        changeStroke: changeStrokeHandler,
        changeFill: changeFillHandler,
        changeSize:changeSizeHandler,
    }
  return (
    <toolBoxContext.Provider value={toolBoxContextValue}>{children}</toolBoxContext.Provider>
  );
}

export default ToolBoxProvider