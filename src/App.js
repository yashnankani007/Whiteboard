import ToolBox from "./components/ToolBox";
import Toolbar from "./components/Toolbar";
import Board from "./components/board";
import BoardProvider from "./store/BoardProvider";
import ToolBoxProvider from "./store/ToolBoxProvider";
function App() {
  
  return (
    <>
      <BoardProvider>
        <ToolBoxProvider>
        <Toolbar/>
        <Board/>
        <ToolBox />
        </ToolBoxProvider>
      </BoardProvider>
    </>
  );
}

export default App;
