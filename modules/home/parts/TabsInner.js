import React from "react";
import {groupBy} from "../../../../../functions/main";
import CarouselGallery from "../../galleries/CarouselGallery";

const TabsInner = (props) => {
    let galleries = props.galleries;
    return <React.Fragment>
        <div className={'tabs'}>
            <ul className="nav nav-pills">
                {galleries ?
                    groupBy(galleries.rows, 'type').carousel.map((gallery, index) => {
                        return <li key={index} className="nav-item">
                            <a data-toggle="tab" onClick={e=>props.check(e,index)} className={"nav-link" + (index === props.stateIndex ? " active" : "")} href={"#tab"+index}>{gallery.name}</a>
                        </li>
                    })
                    : ''
                }
            </ul>
            <div className="tab-content">
                {galleries ?
                    groupBy(galleries.rows, 'type').carousel.map((gallery, index) => {
                        return (index === props.stateIndex) ?  <div key={index} className={"tab-pane" + (index === props.stateIndex ? " active" : "")} id={"tab" + index}>
                                <CarouselGallery gallery={gallery}/>
                            </div>
                            :''
                            ;
                    })
                    : ''
                }
            </div>
        </div>
    </React.Fragment>
}

export default TabsInner;