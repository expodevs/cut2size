import React from "react";
import LazyLoadImage from "../../parts/LazyLoadImage";
import {isMobile} from '../../../../../functions/frontend';
import WebpImage from "../../parts/WebpImage";

const  VideoItem = (props) => {
    return <div className={"item"} onClick={(e) => {if (isMobile()) props.openModal(e,props.item.link); }}>
        <div className="video-item-wrapper-mobile">
            <div className={'image-wrapper'}>
                <LazyLoadImage src={props.item.icon} alt={props.item.title} height={50} width={50}/>
                <WebpImage src="/images/youtube_social_icon_red.png" alt="Youtube ico" height={45} width={64}/>
            </div>
            <div className="item-title">{props.item.title}</div>
        </div>

        <div className="video-item-wrapper">
            <LazyLoadImage src={props.item.icon} alt={props.item.title} height="50" width="50"/>
            <div className="item-title">{props.item.title}</div>

            <div className="item-link youtube">
                <a href={props.item.link} onClick={e=>props.openModal(e,props.item.link)}  rel="noopener norefferer nofollow" target="_blank"><WebpImage src="/images/youtube_social_icon_red.png" alt="Youtube icon" height={45} width={64}/></a>
            </div>
        </div>

    </div>
}

export default VideoItem;