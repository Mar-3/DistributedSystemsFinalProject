import './Memo.css'
import Draggable, { DraggableData, DraggableEvent} from "react-draggable"
import React, {useState, useRef} from 'react'

export const Memo = ({props, handleDrag, handleOpenContextMenu}) => {

 
    const {objectId, object, x, y, text, bgcolor} = props;
    
    return (
        <div style={{height:'0px'}}>
            <Draggable position={{x:x, y:y}} onStop={(e, data) => {
                e.preventDefault();
                handleDrag(objectId, e,  data);
            }}>
                <div className={object}
                    style={{backgroundColor: bgcolor}}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOpenContextMenu(e, objectId);
                }}> 
                <span className="memo-text">{text}</span>
                </div>
            </Draggable>
        </div>
    )
}