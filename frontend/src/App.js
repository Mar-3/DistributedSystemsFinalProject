import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import initialObjects from './mockdata.json'
import { useEffect, useState } from 'react';
import { ContextMenu } from './UI/customContextMenu/ContextMenu';
import {Toolbar } from './UI/Toolbar/Toolbar';



function App() {

  const [cMenuOpen, setCmenuOpen] = useState(false);
  const [cMenuPos, setCMenuPos] = useState({
    x:0,
    y:0
  })
  const [objects, setObjects] = useState(initialObjects)
  const [selectedObjectId, setSelectedObjectId] = useState(null);
 
  const handleAddMemo = () => {
    console.log("adding a memo to 60 60")
    const objs = [... objects];
    objs.push({objectId:parseInt(objects.splice(-1)[0].objectId) + 1, object:"memo", x:60, y:60, text:"New Memo", "bgcolor": "yellow"});
    console.log(objs)
    setObjects(objs);
  }

  const handleDrag = (objectId, e, data) => {
    console.log(data)
    console.log(e.x, e.y)
    const objs = [... objects];
    const index = objs.findIndex((el) => el.objectId === objectId);
    objs[index].x = data.x;
    objs[index].y = data.y;
    setObjects(objs);
  }
  
  const handleColorChange = (objectId, x, y) => {
    console.log('change color of ' + objectId);
    objects.find((element) => {return element.objectId == objectId})
  }

  const handleEditText = (objectId) => {
    console.log('edit')
  }

  const handleRemove = (objectId) => {
    console.log('remove ', objectId)
    const index = objects.findIndex((el) => el.objectId === objectId);
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
  


  
  const handleOpenContextMenu = (e, objectId) => {
    console.log("handleopen", e.pageX, e.pageY)
    setCMenuPos({x:e.clientX, y:e.clientY});
    setSelectedObjectId(objectId);
    setCmenuOpen(true);
  }
  
  const handleClickContextMenu = (option) => {
    setCmenuOpen(false);
    switch (option) {
      case 'edit':
        handleEditText(selectedObjectId);
        break;
      case 'remove':
        handleRemove(selectedObjectId);
        break;
      case 'change color':
        handleColorChange();
        break;
      default:
    }
    setSelectedObjectId(null);
  }

  return (
    <div className="App">
      <header className="Workspace 1">
        <p>
          Edit a workspace
        </p>
      </header>
      <Toolbar addMemo={handleAddMemo}/>
      <div height={"100%"} className="workspace" style={{width:"100%", height:"50%"}}>
        {objects.map((object, index)=> {
          return (
            <Memo key={'object-'+index} props={object} handleDrag={handleDrag} handleOpenContextMenu={handleOpenContextMenu}/>
          )
        })}
      </div>
      {cMenuOpen && <ContextMenu pos={cMenuPos} handleClickContextMenu={handleClickContextMenu}/>}
    </div>
  );
}

export default App;
