import React, {useEffect, useState } from 'react';
import {ChildrenMenu} from "../ChildrenMenu";

const SideBar = ({collapsed, menu, toggleMobileMenu, title}) => {
    const [sidebarState, setSidebarState] = useState({
        collapsed: typeof collapsed === 'undefined' ? false : collapsed,
    });

    useEffect(() => {
        setSidebarState({collapsed:collapsed});
    }, [collapsed])

    return (
        <div className={'pro-side-bar' + (sidebarState.collapsed ? ' show' : '')}>
            <div className={"pro-sidebar-inner"}>
                <div className="pro-sidebar-layout">
                    <div className={'sidebar-title'}>{title}</div>
                    <ChildrenMenu showChildren={collapsed} menu={menu} toggleMobileMenu={toggleMobileMenu}/>
                </div>
            </div>
            <div className="overlay" onClick={e=>setSidebarState({collapsed:false})}/>
        </div>
    );

}

export default SideBar;