import { useEffect, useState } from "react"
export const EditBox = ({objectId,  editObject, handleEditOutClick}) => {

    const [text, setText] = useState('')
    const [color, setColor] = useState('')
    

    return (
        <>
        <div style={{padding: '3rem', position:'absolute', top:'50%', left:'50%', border:"1px solid gray"}}>
            <h4>Editing Object {objectId}</h4>
            <h5>color</h5><input onInput={(e) => setText(e.currentTarget.value)}></input>
            <br></br>
            <h5>color</h5><input onInput={(e) => setColor(e.currentTarget.value)}></input>
            <br></br>
            <button onClick={(e) => editObject(objectId, text, color)}>Update</button>
        </div>
        </>
    )
}

export default EditBox;