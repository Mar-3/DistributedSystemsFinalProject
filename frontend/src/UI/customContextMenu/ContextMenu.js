// Used as reference https://blog.logrocket.com/creating-react-context-menu/

import { useEffect, useState } from 'react';
import Menu from './Menu';



export const ContextMenu = ({pos, setOpen}) => {

    const options = [
        'edit',
        'remove',
        'change color'
    ]

    const onMenuClick = (item) => {
        console.log('asd',item);
        setOpen(false)
    }
    
    useEffect(() => {
        const handleClick = () => setOpen(false);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);



    return (
            <div style={{position:"absolute", top:pos.y, left:pos.x}}>
                {options.map((item, index) => {
                    return(
                    <div key={"menu-item-"+item+"-"+index} onClick={()=> onMenuClick(item)}>
                        <Menu title={item}/>
                    </div>
                    )
                })}
            </div> 
    )
}
export default ContextMenu; 