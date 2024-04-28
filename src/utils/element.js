import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import rough from 'roughjs/bin/rough';
import { getArrowCordinates, isPointCloseToLine } from "./math";
import getStroke from "perfect-freehand";
const gen = rough.generator();
export const createElement =(id,x1,y1,x2,y2,{type,size,stroke,fill})=>{
    let options ={
        seed: id + 1,
        fillStyle: 'solid'
    }
    if(size){
        options.strokeWidth =size;
    }
    if(stroke){
        options.stroke=stroke;
    }
    if(fill){
        options.fill=fill;
    }
    const newElement ={
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        size,
        stroke,
        fill
    }
    switch(type){
        case TOOL_ITEMS.BRUSH:
            const brushElement ={
                id,
                points :[{x:x1,y:y1}],
                path: new Path2D(getSvgPathFromStroke(getStroke([{x:x1,y:y1}]))),
                type,
                stroke
            };
            return brushElement;
        case TOOL_ITEMS.LINE:
            {
                newElement.roughEle = gen.line(x1,y1,x2,y2,options);
                return newElement;
            }
        case TOOL_ITEMS.RECTANGLE:
            {
                newElement.roughEle = gen.rectangle(x1,y1,x2-x1,y2-y1,options);
                return newElement;
            }
        case TOOL_ITEMS.CIRCLE:
            {
                const height = x2-x1,width = y2-y1, centerX = (x1+x2)/2, centerY = (y1+y2)/2;
                newElement.roughEle = gen.ellipse(centerX,centerY,height,width,options);
                return newElement;
            }
        case TOOL_ITEMS.ARROW:
            {
                const {x3,y3,x4,y4} = getArrowCordinates(x1,y1,x2,y2,ARROW_LENGTH);
                const points= [
                    [x1,y1],
                    [x2,y2],
                    [x3,y3],
                    [x2,y2],
                    [x4,y4]
                ];
                newElement.roughEle = gen.linearPath(points,options);
                return newElement;
            }
        case TOOL_ITEMS.TEXT:
            {
                newElement.text = "";
                return newElement;
            }
        default:
            throw new Error("type is unrecognised");
    }
};
export const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );
  
    d.push("Z");
    return d.join(" ");
  };

  export const isPointNearToElement = (element,clientX,clientY)=>{
    const {x1,y1,x2,y2,type} = element;
    const context = document.getElementById("canvas").getContext("2d");
            
    switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
            return isPointCloseToLine(x1,y1,x2,y2,clientX,clientY);
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
            return isPointCloseToLine(x1,y1,x1,y2,clientX,clientY)||
                   isPointCloseToLine(x1,y1,x2,y1,clientX,clientY)||
                   isPointCloseToLine(x2,y1,x2,y2,clientX,clientY)||
                   isPointCloseToLine(x1,y2,x2,y2,clientX,clientY)
        case TOOL_ITEMS.BRUSH:
            return context.isPointInPath(element.path,clientX,clientY);
        case TOOL_ITEMS.TEXT:
            
            context.fillStyle = element.stroke; 
            context.font = `${element.size}px Caveat`;
            const textWidth = context.measureText(element.text).width;
            const textHeight = parseInt(element.size);
            context.restore(); 
            return isPointCloseToLine(x1,y1,x1+textWidth,y1,clientX,clientY)||
                   isPointCloseToLine(x1,y1,x1,y1+textHeight,clientX,clientY)||
                   isPointCloseToLine(x1,y1+textHeight,x1+textWidth,y1+textHeight,clientX,clientY)||
                   isPointCloseToLine(x1+textWidth,y1,x1+textWidth,y1+textHeight,clientX,clientY)
        default:
            break;
    }
  }