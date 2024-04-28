import React, { useContext } from 'react'
import classes from './index.module.css'
import { COLORS, FILL_TOOL_TYPES, STROKE_TOOL_TYPES, SIZE_TOOL_TYPES, TOOL_ITEMS} from '../../constants';
import cx from "classnames"
import toolBoxContext from '../../store/toolbox-context';
import BoardContext from '../../store/board-context';
const ToolBox = () => {
    const {toolBoxState, changeStroke, changeFill, changeSize} = useContext(toolBoxContext);
    const {activeToolItem} = useContext(BoardContext);
    const strokeColor = toolBoxState[activeToolItem]?.stroke;
    const fillColor = toolBoxState[activeToolItem]?.fill;
    const size =toolBoxContext[activeToolItem]?.size;
  return (
    <div className={classes.container}>
        {STROKE_TOOL_TYPES.includes(activeToolItem)
        &&<div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>Stroke Color</div>
            
            <div className={classes.colorsContainer}>
                <div>
                    <input
                    className={classes.colorPicker}
                    type = "color"
                    value={strokeColor}
                    onChange={(event)=>changeStroke(activeToolItem,event.target.value)}  
                    />
                </div>
                {Object.keys(COLORS).map((k)=>{
                    return <div className={cx(classes.colorBox,
                            {[classes.activeColorBox]: COLORS[k]===strokeColor})
                } 
                    style ={{backgroundColor:COLORS[k]}}
                    onClick={()=>changeStroke(activeToolItem,COLORS[k])}
                    >

                    </div>
                })}
            </div>
        </div>}
        {FILL_TOOL_TYPES.includes(activeToolItem)
        &&<div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>Fill Color</div>
            <div className={classes.colorsContainer}>
            {fillColor === null ?(
                <div className={cx(classes.colorPicker,classes.noFillColorBox)}
                onClick={()=>changeFill(activeToolItem,COLORS.BLACK)}>
                </div>
            )
                 :
            (
             <div>
                     <input
                     className={classes.colorPicker}
                     type = "color"
                     value={fillColor}
                     onChange={(event)=>changeFill(activeToolItem,event.target.value)}  
                     />
                 </div>)
            }
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFill(activeToolItem, null)}
            ></div>
                {Object.keys(COLORS).map((k)=>{
                    return <div className={cx(classes.colorBox,
                            {[classes.activeColorBox]: COLORS[k]===fillColor})
                } 
                    style ={{backgroundColor:COLORS[k]}}
                    onClick={()=>changeFill(activeToolItem,COLORS[k])}
                    >
                    </div>
                })}
            </div>
        </div>}
        {SIZE_TOOL_TYPES.includes(activeToolItem)
        &&<div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>{activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}</div>
            <input
                type ="range"
                step ={1}
                min={activeToolItem === TOOL_ITEMS.TEXT ? 12:1}
                max={activeToolItem ===TOOL_ITEMS.TEXT ?64:10}
                value={size}
                onChange={(event)=>changeSize(activeToolItem,event.target.value)}  
            ></input>
        </div>}
        
    </div>
  );
};

export default ToolBox;