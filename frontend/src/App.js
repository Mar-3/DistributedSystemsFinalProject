import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import objects from './mockdata.json'
import { useState } from 'react';
import { ContextMenu } from './UI/customContextMenu/ContextMenu';



function App() {
  const handleDrag = (objectId, x, y) => {
    console.log('from app', x,y);
    // TODO handling changes to backend
  }
  const [cMenuOpen, setCmenuOpen] = useState(false);
  const [cMenuPos, setCMenuPos] = useState({
    x:0,
    y:0
  })
  
  const handleOpenContextMenu = (e) => {
    console.log("handleopen", e.pageX, e.pageY)
    setCMenuPos({x:e.clientX, y:e.clientY});
    setCmenuOpen(true);
  }
  
  return (
    <div className="App">
      <header className="Workspace 1">
        <p>
          Edit a workspace
        </p>
      </header>
      <div className="workspace" style={{width:"100%"}}>
        {objects.map((object, index)=> {
          return (
            <Memo key={'object-'+index} props={object} handleDrag={handleDrag} handleOpenContextMenu={handleOpenContextMenu}/>
          )
        })}
      </div>
      {cMenuOpen && <ContextMenu pos={cMenuPos} setOpen={setCmenuOpen}/>}
    </div>
  );
}

export default App;
