import './Memo.css'
import Draggable, { DraggableData, DraggableEvent} from "react-draggable"
import React, {useState, useRef} from 'react'

export const Memo = ({props, handleDrag, handleOpenContextMenu}) => {
    const {objectId, object, x, y, text, bgcolor} = props;
    const isDraggingRef = useRef(false);
    
    const onDrag = (e, data) => {
        isDraggingRef.current = false;
    }
    
    const onStop = (e, data) => {
        isDraggingRef.current = false;
        handleDrag(1, data.x, data.y)
    };
    

    return (
        <Draggable onStop={handleDrag} onDrag={() => isDraggingRef.current=true} positionOffset={{x:x, y:y}}>
                <div className={object}
                    style={{backgroundColor:bgcolor}}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOpenContextMenu(e, objectId);
                        }
                    }> 
                    <span className="memo-text">{text}</span>
                </div>
        </Draggable>
    )
}