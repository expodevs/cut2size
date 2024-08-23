import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import WebpImage from "./parts/WebpImage";

export const ChildrenMenu=({menu,toggleMobileMenu,showChildren})=>{

    return <ul aria-labelledby="dropdownMenu1"
               className={`dropdown-menu border-0 ${showChildren ? 'show' : ''}`}>
        {!!(menu.length) &&  menu.map((item,index)=>
            <ChildrenMenuItem key={index} item={item} toggleMobileMenu={toggleMobileMenu}/>
        )
        }
    </ul>

};
export const ChildrenMenuItem=({item,toggleMobileMenu})=>{
    const [show,setShow]=useState(false);
    const ref = useRef();
    let url = item.slug ? item.slug : (item.page ? item.page.slug : '');

    useOnClickOutside(ref, () => {setShow(false);});

    return (item.children && item.children.length)
        ?
        <li key={item.id}  className={"dropdown-submenu " + (show ? ' clicked' : '')} ref={ref}>
            {!!url ?
                <a
                    className={"dropdown-item " + (url === '/calc-categories' ? ' order-now-link' : '')}
                    href={url}
                    onClick={toggleMobileMenu}
                    hash={url}>{item.text}</a>
                : <span className={"dropdown-item "} onClick={(e) => {setShow(!show);}}>{item.text}</span>
            }

            <ChildrenMenu menu={item.children} showChildren={show}/>
            <span className={'child-menu-arrow' + (show ? ' rotate' : '')} onClick={(e) => {setShow(!show);}}>
                        <WebpImage src="/images/arrow_icon_down_white.svg" alt="" />
                    </span>
        </li>
        :
        <li>
            {!!url ?
                <a
                    className={"dropdown-item menu-link " + (url === '/calc-categories' ? ' order-now-link' : '')}
                    href={url}
                    onClick={toggleMobileMenu}
                    hash={url}>{item.text}</a>
                : <span className={"dropdown-item menu-link"} onClick={(e) => {setShow(!show);}}>{item.text}</span>
            }
        </li>
}
// Hook
function useOnClickOutside(ref, handler) {
    useEffect(
        () => {
            const listener = (event) => {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target) && (event.target.classList && event.target.classList[1]!=='clicked')) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        }, [ref, handler]
    );
}
