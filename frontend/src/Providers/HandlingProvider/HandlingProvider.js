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
  WS.onmessage = ((msgData) => {
      const data = JSON.parse(msgData.data)
      switch(data.operation) {
        case 'selectWorkspace':
          setWorkspace(data.workspaceID);
          if (data.items != undefined) {
            setObjects(data.items);
          }
          break;
        case 'addObject':
          onWsAddMemo(data.item);
          break;
        case 'editObject':
          onWsEditMemo(data.item);
        default:
          console.log("ASDLAJDS:LKADS")
          
      }
    })


  const handleWorkSpaceSubmit = (workspaceName) => {
      WS.send(JSON.stringify({operation: "selectWorkspace", item: {name: workspaceName}}));
  }
  
  const onWsEditMemo = (item) => {
      console.log(item)
  }
  
  const onWsAddMemo = (item, objects) => {
      console.log(item)
      let objs;
      if (objects == null) {objs = []}
      else  {objs = [... objects]};
      objs.push(item);
      return(objs);
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
    
  const editObject = (id, text, color) => {
      const objs = [... objects];
      const index = objs.findIndex((obj) => obj.id === id);
      console.log(index, objects)
      objs[index].text = text;
      objs[index].color = color;
      
      WS.send(JSON.stringify({operation: "edit", item: objs[index]}));
      
      setObjects(objs);
      setSelectedObjectId(null);
  } 

  return (
      <WSContext.Provider value={{WS, workspace, handleWorkSpaceSubmit, objects, selectedObjectId, setSelectedObjectId, editObject, handleDrag, handleAddMemo}}>
          {children}
      </WSContext.Provider>
  )
}


export {HandlingContext, HandlingProvider};