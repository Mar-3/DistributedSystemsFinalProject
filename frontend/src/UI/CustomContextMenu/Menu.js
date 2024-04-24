import React from 'react'

export const Menu = ({title}) => {
    return (
        <>
            <div style={{border: "1px solid #ffffff2d", 
                            borderRadius: "4px",
                            padding: "18px",
                            margin: "5px 0",
                            boxSizing: "border-box",
                            background: "gray"
            }}>
                {title}
            </div>
        </>
    )
}
export default Menu;