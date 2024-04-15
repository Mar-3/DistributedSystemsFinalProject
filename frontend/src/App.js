import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import objects from './mockdata.json'
import { useEffect, useState } from 'react';
import { ContextMenu } from './UI/customContextMenu/ContextMenu';



function App() {

  const [cMenuOpen, setCmenuOpen] = useState(false);
  const [cMenuPos, setCMenuPos] = useState({
    x:0,
    y:0
  })

  const [selectedObjectId, setSelectedObjectId] = useState(null);

  const handleDrag = (objectId, x, y) => {
    console.log('from app', x,y);
    // TODO handling changes to backend
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
    console.log(objects)
    const index = objects.findIndex((el) => el.objectId === objectId);
    if (index === undefined){

      return
    }
    
    console.log(index)
    objects.splice(index,1);
    console.log(objects)
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
  }

  return (
    <div className="App">
      <header className="Workspace 1">
        <p>
          Edit a workspace
        </p>
      </header>
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
