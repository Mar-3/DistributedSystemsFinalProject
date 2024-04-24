import './Memo.css'
import Draggable, { DraggableData, DraggableEvent} from "react-draggable"
import React, {useState, useRef} from 'react'

export const Memo = ({props, handleDrag, handleOpenContextMenu}) => {

 
    const {text, positionx, positiony, color, workspace_id, id} = props;
    return (
        <div className='memo-main' style={{height:'0px'}}>
            <Draggable position={{x:positionx, y:positiony}} onStop={(e, data) => {
                e.preventDefault();
                handleDrag(id, e,  data);
            }}>
                <div className="memo"
                    style={{backgroundColor: color}}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOpenContextMenu(e, id);
                }}> 
                <span textWrap={"wrap"} className="memo-text">{text}
                    </span>
                </div>
            </Draggable>
        </div>
    )
}