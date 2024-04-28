import { createContext } from "react";

const toolBoxContext = createContext({
    toolBoxState:{},
    changeStroke:()=>{},
    changeFill:()=>{},
    changeSize:()=>{}
});

export default toolBoxContext;