import { useContext, createContext } from 'react';


// TODO config file for things like this 
const backendAddress = 'ws://10.5.0.3:8000/ws'

const WSContext = createContext();

/**
 * 
 * An external provider used for Websocket connection
 * To prevent useless reconnections due to component dismounting
 */
const WSProvider = ({children}) => {

    // New Websocket connection
    const WS = new WebSocket(backendAddress)

    return (
        <WSContext.Provider value={{WS}}>{children}</WSContext.Provider>
    )

}

export { WSContext, WSProvider }