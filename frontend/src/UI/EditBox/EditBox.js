import { useEffect, useState } from "react"
import './EditBox.css'
export const EditBox = ({id,  editObject, handleEditOutClick, setEditOpen}) => {

    const [text, setText] = useState('')
    const [color, setColor] = useState('')
    console.log(id, text, color)
    

    return (
        <>
        <div id="editbox" style={{padding: '3rem', position:'absolute', top:'50%', left:'50%', border:"1px solid gray"}}>
            <h4>Editing Object {id}</h4>
            <h5>Text</h5><input onInput={(e) => setText(e.currentTarget.value)}></input>
            <br></br>
            <h5>Color</h5><input type="color" onInput={(e) => setColor(e.currentTarget.value)}></input>
            <br></br>
            <button onClick={(e) => editObject(id, text, color)}>Update</button>
        </div>
        </>
    )
}

export default EditBox;