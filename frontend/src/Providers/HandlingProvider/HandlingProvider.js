import { createContext, useContext, useEffect, useState } from 'react';
import { WSContext } from '../WSProvider/WSProvider';


const authUrl = "http://localhost:8001/api/auth/";

const HandlingContext = createContext();

const HandlingProvider = ({children}) => {
  const {WS, connectWS} = useContext(WSContext)

  const [workspace, setWorkspace] = useState(null);
  const [objects, setObjects] = useState(null);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  
  
  const handleWorkspaceSubmit = async (workspaceName) => {
    console.log("ASDDS")
    const res = await fetch(authUrl, {
      method: "POST",
      mode:"cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({workspace_name: workspaceName })
    });
    const data = await res.json();
    const id = data.id;
    setWorkspace(id);
    connectWS((async (msgData) => {
      const data = JSON.parse(msgData.data)
      
      switch(data.operation) {
        case 'getWorkspaceItems':
          console.log("got items", data.items);
          if (workspace != null && data.items != undefined) {
            setObjects(data.items);
          } else {
            setObjects([])
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
    }));

  }
  
  useEffect(() => {
    if (WS.current != null){
      console.log('asd')
      WS.current.send(JSON.stringify({"operation":"getWorkspaceItems","item":{"id":workspace}}))
    }
  }, [WS])
  
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
      WS.current.send(JSON.stringify({operation: "addItem", item: newItem, workspaceId: workspace}))
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
      <HandlingContext.Provider value={{WS, workspace, objects, selectedObjectId, setSelectedObjectId, handleRemove, handleWorkspaceSubmit, editObject, handleDrag, handleAddMemo}}>
          {children}
      </HandlingContext.Provider>
  )
}


export {HandlingContext, HandlingProvider};