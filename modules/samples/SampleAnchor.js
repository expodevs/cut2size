import {isMobile} from "react-device-detect";
import WebpImage from "../parts/WebpImage";
import React from "react";

const SampleAnchor = (props) => {
    return <a className={'anchor-item-layout col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-3'} href={'#anchor-'+props.name}>
        <div className={'anchor-item' + (isMobile ? ' mobile' : '')}>
            <div className={'anchor-title'}>
                {props.name.toLowerCase()}
            </div>
            <div className={'anchor-image'}>
                <WebpImage src={props.productImage||'/images/product_placeholder.jpg'} />
            </div>
        </div>
    </a>
}

export default SampleAnchor;