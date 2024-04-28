import { ELEMENT_ERASE_THRESHOLD } from "../constants";

export const getArrowCordinates = (x1,y1,x2,y2,len)=>{
    const angle = Math.atan2((y2-y1),(x2-x1));
    const x3 = x2 - len*(Math.cos(angle-Math.PI/6));
    const x4 = x2 - len*(Math.cos(angle+Math.PI/6));
    const y3 = y2 - len*(Math.sin(angle-Math.PI/6));
    const y4 = y2 - len*(Math.sin(angle+Math.PI/6));
    return {x3,y3,x4,y4};
};

const distanceBetweenpoints = (x1,y1,x2,y2)=>{
    const xDiff = x2-x1;
    const yDiff = y2-y1;
    return Math.sqrt(xDiff*xDiff+yDiff*yDiff);
}

export const isPointCloseToLine = (x1,y1,x2,y2,pointX,pointY)=>{
    const d1 = distanceBetweenpoints(x1,y1,pointX,pointY);
    const d2 = distanceBetweenpoints(x2,y2,pointX,pointY);
    const d = distanceBetweenpoints(x1,y1,x2,y2);
    return Math.abs(d-d1-d2)<ELEMENT_ERASE_THRESHOLD;
}