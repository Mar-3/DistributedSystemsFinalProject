import { useState } from "react";


const LaunchPage = ({handleWorkspaceSubmit}) => {

    const [ws, setws] = useState('')

    return (
        <>
        <div>
            <span><h2>Welcome to workspace-editor! (mikä tän nimi ees on?)</h2></span>
            <br/>
            <label>Enter workspace name:</label>
            <input onChange={(event) => {setws(event.currentTarget.value)}}></input>
            <button onClick={() => handleWorkspaceSubmit(ws)}>Enter the workspace!</button>
        </div>
        </>
    )
}

export default LaunchPage;