import React from "react";
import {groupBy, keyLengthExists} from "../../../../../functions/main";
import LazyLoadImage from "../../parts/LazyLoadImage";

const TabsInnerMobile = (props) => {
    let galleries = props.galleries;
    return <React.Fragment>
            {galleries ?
                groupBy(galleries.rows, 'type').carousel.map((gallery, index) => {
                    let gallery_images = keyLengthExists(gallery.gallery_images,'system_files');
                    gallery_images.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
                    gallery_images = gallery_images.slice(0, 3);
                    let categoryName = gallery.name.toLowerCase();
                    categoryName = categoryName[0].toUpperCase() + categoryName.slice(1);

                    return <div key={index} className={'tabs-category'}>
                        <div className={'tabs-category-header'}>
                            <div className={'tabs-category-title'}>{categoryName}</div>
                            {!!gallery.url&& <div className={'tabs-category-link'}><a href={gallery.url}>See all></a></div> }

                        </div>
                        <div className={'tabs-category-content'}>
                            {
                                gallery_images ?
                                    gallery_images.map((image, index) => {
                                        let images = groupBy(image.system_files, 'field');
                                        return (images.small && images.main) ? (<a key={index} className={'tabs-category-wrapper'} href={images.main[0].disk_name}>
                                            <div className={'tabs-category-item'}>
                                                <div className={'tabs-category-img'}>
                                                    <LazyLoadImage
                                                        height={50}
                                                        src={images.small[0].disk_name} alt=""/>
                                                </div>
                                                <span className={'tabs-category-item-name'}><a href="#">{image.caption}</a></span>
                                            </div>
                                        </a>) : ''
                                    })
                                    : ''
                            }
                        </div>
                    </div>
                })
                : ''
            }
    </React.Fragment>
}

export default TabsInnerMobile;
