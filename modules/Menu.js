import React, {useState} from 'react';
import {userDevice} from "../../../functions/frontend";
import WebpImage from "./parts/WebpImage";
import SideBar from "./widgets/SideBar";
import {ChildrenMenu} from "./ChildrenMenu";
import SignToFee4beeDesigner from "./widgets/SignToFee4beeDesigner";

export const Menu=({menu,toggleMobileMenu,account})=>{
    return  <>
        {(userDevice() !== 'desktop' && menu) &&
        menu.map((item, index) => {
                let url = item.slug ?  item.slug : (item.page ? item.page.slug : '');
                return url==='/catalog'
                    ? <a key={index}
                         className={"menu-link order-now-link single"}
                         href={url}
                         onClick={toggleMobileMenu}
                         aria-label="Order now"
                    >Order</a>
                    : ''
            }
        )

        }
        {(userDevice() === 'desktop') &&
        <nav >
            <ul className={"nav "}>
                {(menu) && menu.map((item, index) => {
                        return <MenuItem  key={index}  item={item} toggleMobileMenu={toggleMobileMenu}/>
                    }
                )}
                {(account && account.customer_roles && account.customer_roles.designer ) &&
                <li   className="nav-item dropdown menu-item menu-item">
                    <SignToFee4beeDesigner/>
                </li>
                }

            </ul>
        </nav>}

    </>
};

export const MenuItem=({item,toggleMobileMenu})=>{
    const [show,setShow]=useState(false);
    const [sideBarShow, setSideBarShow] = useState(false);

    let url = item.slug ? item.slug : (item.page ? item.page.slug : '');
    return  <li key={item.id} className="nav-item dropdown menu-item menu-item">
        {!!url ?
            <a
                className={"menu-link" + (url === '/catalog' ? ' order-now-link' : '')}
                href={url}
                onClick={toggleMobileMenu}
                hash={url}
                aria-label="Order now">{item.text}
            </a>
            :
            <span className={"menu-link"}
                  onClick={(e) => {
                      e.preventDefault();
                      setShow(!show);
                      if (!item.parent_id && item.children && item.children.length>0)
                          setSideBarShow(!sideBarShow);
                  }}>{item.text}</span>

        }


        {!!(item.children && item.children.length)&&
        <React.Fragment>
                <span className={'child-menu-arrow' + (show ? ' rotate' : '')} onClick={(e) => {setShow(!show);}}>
                    <WebpImage src="/images/arrow_icon_down_white.svg" alt="" />
                </span>
            {(userDevice() !== 'desktop') ?
                <ChildrenMenu showChildren={show} menu={item.children} toggleMobileMenu={toggleMobileMenu}/>
                :
                <SideBar collapsed={sideBarShow} menu={item.children} toggleMobileMenu={toggleMobileMenu} title={item.text}/>
            }

        </React.Fragment>
        }

    </li>
};


