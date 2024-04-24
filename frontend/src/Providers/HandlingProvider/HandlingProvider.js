import { createContext, useContext, useState } from 'react';
import { WSContext } from '../WSProvider/WSProvider';

const authUrl = "http://10.5.0.2:8001/api/auth/";

const HandlingContext = createContext();

const HandlingProvider = ({children}) => {
  // THis does stuff
  const {WS} = useContext(WSContext)

  const [workspace, setWorkspace] = useState(null);
  const [objects, setObjects] = useState(null);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  
  const handleWorkSpaceSubmit = async (workspaceName) => {
    const res = await fetch(authUrl, {
      method: "POST",
      mode:"cors",
      headers: {
        "Content-Type": "application/json",
        "Referrer-Policy": "unsafe-url"
      },
      body: JSON.stringify({workspace_name: workspaceName })
    });
    const data = await res.json();
    const id = data.id;
    setWorkspace(id);
    WS.send(JSON.stringify({"operation": "selectWorkspace",  "id": id }));
  }

  // Message handling from websocket connection
  WS.onmessage = (async (msgData) => {
      const data = JSON.parse(msgData.data)
      switch(data.operation) {
        case 'selectWorkspace':
          setWorkspace(data.workspaceID);
          if (data.items != undefined) {
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
          console.log("unknown operation from server, how?")
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
      const newItem = {"text":"New Memo", positionx: 60, positiony:60, color:"#F9F06B", workspace_id:workspace}
      WS.send(JSON.stringify({operation: "addItem", item: newItem, workspaceId: workspace}))
    }

  const handleRemove = async (id) => {
    const objs = [... objects];
    const index = objs.findIndex((el) => el.id == id);
    objs.splice(index, 1);
    WS.send(JSON.stringify({operation: "delete", id:id, workspaceId:workspace}));
  }
  
  const handleDrag = async (id, e, data) => {
      const objs = [... objects];
      const index = objs.findIndex((el) => el.id === id);
      objs[index].positionx = data.x;
      objs[index].positiony = data.y;
      WS.send(JSON.stringify({operation: "edit", item: objs[index], workspaceId:workspace}))
    }
    
  const editObject = (id, text, color) => {
      const objs = [... objects];
      const index = objs.findIndex((obj) => obj.id === id);
      objs[index].text = text;
      objs[index].color = color;
      
      WS.send(JSON.stringify({operation: "edit", item: objs[index], workspaceId: workspace}));
      
      setSelectedObjectId(null);
  } 



  return (
      <WSContext.Provider value={{WS, workspace, objects, selectedObjectId, setSelectedObjectId, handleRemove, handleWorkSpaceSubmit, editObject, handleDrag, handleAddMemo}}>
          {children}
      </WSContext.Provider>
  )
}


export {HandlingContext, HandlingProvider};