import './App.css';
import { Memo } from './objectComponents/Memo/Memo';
import objects from './mockdata.json'

const handleDrag = (objectId, x, y) => {
  console.log('from app', x,y);
  // TODO handling changes to backend
}

function App() {


  return (
    <div className="App">
      <header className="Workspace 1">
        <p>
          Edit a workspace
        </p>
      </header>
      <div className="workspace" style={{width:"100%"}}>
        {objects.map((object)=> {
          return (
            <Memo props={object} handleDrag={handleDrag}/>
          )
        })}
      </div>
    </div>
  );
}

export default App;
