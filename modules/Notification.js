import React, {useEffect, useState} from "react";
import {setNotification} from "../../../actions/init";
import {store} from "../../../store";

const Notification = (props) => {

    const [show, setShow] = useState(true);
    useEffect(()=>{
        timeoutHide(props.timeout);
    },[]);

    const timeoutHide = (timeout = 5000) => {
        setTimeout(() => {
            // hide();
        }, timeout);
    };

    const hide = () => {
        setShow(false);
        store.dispatch(setNotification(false));
    };
    return (
        <div className={'notification-block'}>
            <div className={'notification-container' + (show ? ' active' : '')} onClick={e=>hide()}>
                <div className={'notification notification-' + props.type}>
                    {typeof props.message==='object'
                        ?

                        Object.keys(props.message).map(key=>{
                            let object  = props.message[key];
                            return typeof object==='object' ? <span key={key} >error</span> : <div key={key} className={'message'}> {object}</div>
                        })
                        :
                        <div className={'message'}> { props.message}</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Notification;
