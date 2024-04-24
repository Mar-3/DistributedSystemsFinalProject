import { useRef, useContext, createContext, useState } from 'react';


// TODO config file for things like this 
const backendAddress = 'ws://localhost:8000/ws'

const WSContext = createContext();

/**
 * 
 * An external provider used for Websocket connection
 * To prevent useless reconnections due to component dismounting
 */
const WSProvider = ({children}) => {

    // New Websocket connection
    let WS = useRef(null);

    const connectWS = async (msgfunc) => {
        WS.current = new WebSocket(backendAddress);
        WS.current.onmessage = msgfunc;
    }
    


    return (
        <WSContext.Provider value={{WS, connectWS}}>{children}</WSContext.Provider>
    )

}

export { WSContext, WSProvider }