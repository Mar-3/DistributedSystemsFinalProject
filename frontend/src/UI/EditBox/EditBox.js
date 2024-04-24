import { useEffect, useState } from "react"
import './EditBox.css'
export const EditBox = ({selectedObject,  editObject}) => {

    const [text, setText] = useState(selectedObject.text)
    const [color, setColor] = useState(selectedObject.color)
    
    console.log(selectedObject)
    

    return (
        <>
        <div id="editbox" style={{padding: '3rem', position:'absolute', top:'30%', left:'50%', border:"1px solid gray"}}>
            <h4>Editing Object</h4>
            <h5>Text</h5>
            <input value={text} onInput={(e) => setText(e.currentTarget.value)}></input>
            <br></br>
            <h5>Color</h5><input type="color" value={color} onInput={(e) => setColor(e.currentTarget.value)}></input>
            <br></br>
            <button onClick={(e) => editObject(selectedObject.id, text, color)}>Update</button>
        </div>
        </>
    )
}

export default EditBox;