import { createContext, useContext, useState } from 'react';
import { WSContext } from '../WSProvider/WSProvider';


const HandlingContext = createContext();

const HandlingProvider = ({children}) => {
  // THis does stuff
  const {WS} = useContext(WSContext)

  const [workspace, setWorkspace] = useState(null);
  const [objects, setObjects] = useState(null);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  
  

  // Message handling from websocket connection
  WS.onmessage = (async (msgData) => {
      const data = JSON.parse(msgData.data)
      switch(data.operation) {
        case 'selectWorkspace':
          setWorkspace(data.workspaceID);
          if (data.items != undefined) {
            console.log("SETTING WORKSPACE ", data.items);
            setObjects(data.items);
          }
          break;
        case 'addObject':
          setObjects(await receiveAddMemo(data.item));
          break;
        case 'editObject':
          setObjects(await receiveEditMemo(data.item));
          break;
        case 'removeObject':
          setObjects(await receiveRemoveMemo(data.id));
          break;
        default:
          console.log("ASDLAJDS:LKADS")
          break;
          
      }
    })



  
  
  const receiveAddMemo = async (item) => {
    console.log(item)
    let objs;
    if (objects == null) {objs = []}
    else  {objs = [... objects]};
    objs.push(item);
    return(objs);
  }

  const receiveEditMemo = async (item) => {
    const objs = [... objects];
    const index = objs.findIndex((el) => el.id == item.id);
    objs[index] = item;
    return(objs)
  }

  const receiveRemoveMemo = async (id) => {
    const objs = [... objects];
    const index = objs.findIndex((el) => el.id == id);
    objs.splice(index, 1);
    return(objs)
  }


  const handleAddMemo = async () => {
      const newItem = {"text":"New Memo", positionx: 60, positiony:60, color:"yellow", workspace_id:workspace}
      WS.send(JSON.stringify({operation: "addItem", item: newItem, workspaceId: workspace}))
    }

  const handleRemove = async (id) => {
    console.log("handling remove, ", id );
    const objs = [... objects];
    const index = objs.findIndex((el) => el.id == id);
    objs.splice(index, 1);
    WS.send(JSON.stringify({operation: "delete", id:id, workspaceId:workspace}));
    setObjects(objs);
  }
  
  const handleDrag = async (id, e, data) => {
      const objs = [... objects];
      const index = objs.findIndex((el) => el.id === id);
      objs[index].positionx = data.x;
      objs[index].positiony = data.y;
      WS.send(JSON.stringify({operation: "edit", item: objs[index], workspaceId:workspace}))
      setObjects(objs);
    }
    
  const editObject = (id, text, color) => {
      const objs = [... objects];
      const index = objs.findIndex((obj) => obj.id === id);
      console.log(index, objects)
      objs[index].text = text;
      objs[index].color = color;
      console.log(objs[index])
      
      WS.send(JSON.stringify({operation: "edit", item: objs[index], workspaceId: workspace}));
      
      setObjects(objs);
      setSelectedObjectId(null);
  } 

  const handleWorkSpaceSubmit = (workspaceName) => {
    WS.send(JSON.stringify({operation: "selectWorkspace", item: {name: workspaceName}}));
  }

  return (
      <WSContext.Provider value={{WS, workspace, objects, selectedObjectId, setSelectedObjectId, handleRemove, handleWorkSpaceSubmit, editObject, handleDrag, handleAddMemo}}>
          {children}
      </WSContext.Provider>
  )
}


export {HandlingContext, HandlingProvider};