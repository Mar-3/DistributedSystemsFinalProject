import { useState } from "react";
import './Launchpage.css'


const LaunchPage = ({handleWorkspaceSubmit}) => {

    const [ws, setws] = useState('')

    return (
        <>
        <div id="launch">
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