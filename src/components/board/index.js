import { useContext, useEffect, useRef ,useLayoutEffect} from "react";
import rough from "roughjs"
import BoardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolBoxContext from "../../store/toolbox-context";
import classes from './index.module.css'
function Board() {
  
    const {elements,toolActionType,boardMouseDownHandler,boardMouseMoveHandler,boardMouseUpHandler,textAreaBlurHandler,undo,redo} = useContext(BoardContext);
    const canvasRef= useRef();
    const textareaRef = useRef();
    const {toolBoxState}=useContext(toolBoxContext)
    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
    },[]);
    useLayoutEffect(()=>{
        const canvas =canvasRef.current;
        const context = canvas.getContext("2d");
        context.save();
        const roughCanvas = rough.canvas(canvas);
        elements.forEach((element) => {
            switch (element.type) {
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                    roughCanvas.draw(element.roughEle);
                    break;
                case TOOL_ITEMS.BRUSH:
                    {
                        context.fillStyle = element.stroke;
                        context.fill(element.path);
                        context.restore();
                        break;
                    }
                case TOOL_ITEMS.TEXT:
                    {
                        
                        context.textBaseline = "top";
                        context.font = `${element.size}px Caveat`;
                        context.fillStyle = element.stroke;
                        context.fillText(element.text,element.x1,element.y1);
                        context.restore();
                        break;
                    } 
                    
                default:
                    throw new Error("Type is not recognised");
            }
        });

        return ()=>{
            context.clearRect(0,0,canvas.width,canvas.height);
        };
        
    },[elements]);
    useEffect(()=>{
        const textarea = textareaRef.current;
        if (toolActionType === TOOL_ACTION_TYPES.WRITING){
            setTimeout(()=>{
                textarea.focus();
            },0)
        }
    },[toolActionType])
    useEffect(()=>{
        const handleKeyDown = (event)=>{
            if(event.ctrlKey && event.key === 'z'){
                undo();
            }
            else if(event.ctrlKey && event.key === 'y'){
                redo();
            }
            
        }
        document.addEventListener("keydown",handleKeyDown);
        return ()=> {
            document.removeEventListener("keydown",handleKeyDown);
        }
    },[undo,redo])
    const handleMouseDown= (event)=> {
        boardMouseDownHandler(event,toolBoxState);
    };
    const handleMouseMove= (event)=> {
            boardMouseMoveHandler(event);
        
    };
    const handleMouseUp= ()=> {
        boardMouseUpHandler();
    };
    
    return (
        <>
            {TOOL_ACTION_TYPES.WRITING === toolActionType && <textarea
                type ="text"
                className={classes.textElementBox}
                style ={{
                    top : elements[elements.length-1].y1,
                    left : elements[elements.length-1].x1,
                    fontSize : `${elements[elements.length-1]?.size}px`,
                    color : elements[elements.length-1]?.stroke

                }}
                ref={textareaRef}
                onBlur={(event)=>textAreaBlurHandler(event.target.value)}
            />}
          <canvas id="canvas" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
        </>
      );
}

export default Board;
