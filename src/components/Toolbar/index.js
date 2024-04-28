import React, { useContext} from 'react';
import cx from "classnames";
import classes from "./index.module.css"
import {LuRectangleHorizontal} from "react-icons/lu"
import {FaSlash,FaRegCircle,FaArrowRight,FaPaintBrush,FaEraser, FaFont, FaUndoAlt, FaRedoAlt, FaDownload} from "react-icons/fa"
import BoardContext from '../../store/board-context';
import { TOOL_ITEMS } from '../../constants';
const Toolbar = () => {
    const {activeToolItem,changeToolItem,undo,redo} =useContext(BoardContext);
    const handleDownloadClick = () => {
        const canvas = document.getElementById("canvas");
        const data = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = "board.png";
        anchor.click();
    };
  return (
    <div className={classes.container}>
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.BRUSH})}
            onClick={()=>changeToolItem(TOOL_ITEMS.BRUSH)}>
            <FaPaintBrush />
        </div>
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.LINE})}
            onClick={()=>changeToolItem(TOOL_ITEMS.LINE)}>
            <FaSlash />
        </div>
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.RECTANGLE})}
            onClick={()=>changeToolItem(TOOL_ITEMS.RECTANGLE)}>
            <LuRectangleHorizontal />
        </div>
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.CIRCLE})}
            onClick={()=>changeToolItem(TOOL_ITEMS.CIRCLE)}>
            <FaRegCircle />
        </div>
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.ARROW})}
            onClick={()=>changeToolItem(TOOL_ITEMS.ARROW)}>
            <FaArrowRight />
        </div>
        
        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.ERASER})}
            onClick={()=>changeToolItem(TOOL_ITEMS.ERASER)}>
            <FaEraser />
        </div>

        <div className={cx(classes.toolItem,{[classes.active] : activeToolItem === TOOL_ITEMS.TEXT})}
            onClick={()=>changeToolItem(TOOL_ITEMS.TEXT)}>
            <FaFont />
        </div>

        <div className={classes.toolItem}
            onClick={undo}>
            <FaUndoAlt />
        </div>
        <div className={classes.toolItem}
            onClick={redo}>
            <FaRedoAlt />
        </div>
        <div className={classes.toolItem}
            onClick={handleDownloadClick}>
            <FaDownload />
        </div>
             
    </div>
  )
}

export default Toolbar