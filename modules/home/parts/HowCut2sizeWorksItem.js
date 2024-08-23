import React from "react";
import LazyLoadImage from "../../parts/LazyLoadImage";
import {isMobile} from "../../../../../functions/frontend";

const HowCut2sizeWorksItem = (props) => {
    return <div className={"item " + props.itemClass}>
        {!isMobile() ? <LazyLoadImage src={props.img} alt={props.text} /> : ''}
        <p>{props.text}</p>
    </div>
}

export default HowCut2sizeWorksItem;