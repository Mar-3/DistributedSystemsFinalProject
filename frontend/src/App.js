import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import { useEffect, useState } from 'react';
import { ContextMenu } from './UI/CustomContextMenu/ContextMenu';
import {Toolbar } from './UI/Toolbar/Toolbar';
import EditBox from './UI/EditBox/EditBox';
import LaunchPage from './UI/LaunchPage/LaunchPage';

// TODO config file for things like this 
const backendAddress = 'ws://localhost:8000/ws'



function App() {
  
  const WS = new WebSocket(backendAddress)

  


  const [workspace, setWorkspace] = useState(null)

  const [cMenuOpen, setCmenuOpen] = useState(false);
  const [cMenuPos, setCMenuPos] = useState({
    x:0,
    y:0
  })
  const [editOpen, setEditOpen] = useState(false);
  const [objects, setObjects] = useState(null)
  
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  WS.onmessage = ((data) => {
    const a = JSON.parse(data.data)
    switch(a.operation) {
      case 'selectWorkspace':
        setWorkspace(a.workspaceID);
        if (a.items != undefined) {
          setObjects(a.items);
        }
        break;
      case 'addObject':
        onWsAddMemo(a.item);
        break;
      case 'editObject':
        onWsEditMemo(a.item);
      default:
        console.log("ASDLAJDS:LKADS")
        
    }
  })

  const onWsAddMemo = (item) => {
    console.log(item)
    let objs;
    if (objects == null) {objs = []}
    else  {objs = [... objects]};
    objs.push(item);
    setObjects(objs);
  }

  const onWsEditMemo = (item) => {
    console.log(item)
  }

  const handleWorkSpaceSubmit = (wsName) => {
    WS.send(JSON.stringify({operation: "selectWorkspace", item: {name: wsName}}));
  }
 
  const handleAddMemo = () => {
    const newItem = {"text":"New Memo", positionx: 60, positiony:60, color:"yellow", workspace_id:workspace}
    WS.send(JSON.stringify({operation: "addItem", item: newItem}))
  }

  const handleDrag = async (id, e, data) => {
    const objs = [... objects];
    const index = objs.findIndex((el) => el.id === id);
    objs[index].positionx = data.x;
    objs[index].positiony = data.y;
    WS.send(JSON.stringify({operation: "edit", item: objs[index]}))
    setObjects(objs);
    
  }
  
  const handleColorChange = (id, x, y) => {
    console.log('change color of ' + id);
    objects.find((element) => {return element.id == id})
  }

  const handleEditObject = (id) => {
    setEditOpen(true);
  }
  
  const editObject = (id, text, bgcolor) => {
    const objs = [... objects];
    const index = objs.findIndex((obj) => obj.id === id);
    objs[index].text = text;
    objs[index].bgcolor = bgcolor;
    
    setEditOpen(false);
    setObjects(objs);
    setSelectedObjectId(null);
  } 
  

  const handleRemove = (id) => {
    console.log('remove ', id)
    const index = objects.findIndex((el) => el.id === id);
    console.log(index);
    console.log(objects)
    if (index === undefined){
      return
    }
    const objs = [...objects];
    objs.splice(index,1);
    setObjects(objs);
    console.log(objs)
  }

  useEffect(
    () => {
      console.log("changed selected object to " + selectedObjectId);
    }, [selectedObjectId])
  
    useEffect(() => {
      console.log('ws', workspace)
    }, [workspace])

    useEffect(() => {
      console.log('o', objects)
    }, [objects])

  
  const handleOpenContextMenu = (e, id) => {
    console.log("handleopen", e.pageX, e.pageY)
    setCMenuPos({x:e.clientX, y:e.clientY});
    setSelectedObjectId(id);
    setCmenuOpen(true);
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
      {editOpen && <EditBox id={selectedObjectId} editObject={editObject} handleEditOutClick={setEditOpen}/>}
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
