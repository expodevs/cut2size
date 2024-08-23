import React from "react";
import WebpImage from "../parts/WebpImage";
import {Link} from "react-router-dom";

const EmptyOrders = (props) => {

    return (
        <div className={'empty-orders-wrapper'}>
            <div className={'empty-orders'}>
                <WebpImage src={'/images/smile-icon.svg'} />
                <div className={'title'}>
                    {props.title}
                </div>
                <div className={'text'}>
                    {props.text}
                </div>
                <Link className={'btn btn-outline-success'} to={'/calc-categories'}>Go to Calculator</Link>
            </div>
        </div>
    );
}

export default EmptyOrders;