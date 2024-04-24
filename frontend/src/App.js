import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import { useEffect, useState, useContext } from 'react';
import { ContextMenu } from './UI/CustomContextMenu/ContextMenu';
import {Toolbar } from './UI/Toolbar/Toolbar';
import EditBox from './UI/EditBox/EditBox';
import LaunchPage from './UI/LaunchPage/LaunchPage';
import { WSContext } from './Providers/WSProvider/WSProvider';





function App() {
  
  // Get websocket connection and hooks from provider 
  const {
    WS, 
    handleRemove,
    workspace, 
    handleWorkSpaceSubmit, 
    objects, 
    selectedObjectId, 
    setSelectedObjectId, 
    handleColorChange, 
    editObject, 
    handleDrag,
    handleAddMemo} = useContext(WSContext);

  const [cMenuOpen, setCmenuOpen] = useState(false);
  const [cMenuPos, setCMenuPos] = useState({
    x:0,
    y:0
  })
  const [editOpen, setEditOpen] = useState(false);



  useEffect(() => {
    if (selectedObjectId == null && editOpen == true) {
      setEditOpen(false)
    }
  }, [selectedObjectId])


  const handleOpenContextMenu = (e, id) => {
    setCMenuPos({x:e.clientX, y:e.clientY});
    setSelectedObjectId(id);
    setCmenuOpen(true);
  }
  
  const handleEditObject = (id) => {
    setEditOpen(true);
  }
  
  const handleClickContextMenu = (option) => {
    setCmenuOpen(false);
    switch (option) {
      case 'edit':
        handleEditObject(selectedObjectId);
        break;
      case 'remove':
        handleRemove(selectedObjectId);
        break;
      case 'change color':
        handleColorChange();
        break;
      default:
    }
  }

  return (
    <div className="App">
      <header>
        <p>
          Workspace Editor  
        </p>
      </header>
      {workspace!=null && <Toolbar addMemo={handleAddMemo}/>}
      {editOpen && selectedObjectId != null && <EditBox selectedObject={objects.find((el => el.id == selectedObjectId))} editObject={editObject} />}
      {(workspace !=null && objects!= null) && <div height={"100%"} className="workspace" style={{width:"100%", height:"50%"}}>
        {objects.map((object, index)=> {
          return (
            <Memo key={'object-'+index} props={object} handleDrag={handleDrag} handleOpenContextMenu={handleOpenContextMenu}/>
          )
        })}
      </div>}
      {workspace==null && <LaunchPage handleWorkspaceSubmit={handleWorkSpaceSubmit}></LaunchPage>}
      {cMenuOpen && <ContextMenu pos={cMenuPos} handleClickContextMenu={handleClickContextMenu}/>}
    </div>
  );
}

export default App;
