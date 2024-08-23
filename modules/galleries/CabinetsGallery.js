import React, { Component } from 'react';

import {groupBy, groupByLimit, keyLengthExists} from "../../../../functions/main";
import {userDevice} from "../../../../functions/frontend";

// import OwlCarousel from 'react-owl-carousel2';
import LazyLoadImage from "../parts/LazyLoadImage";


class CabinetsGallery extends Component {



    getClassname(item){
        switch(item.content_type){
            case 'application/pdf':
                return 'pdf';
            case 'link':
                if(item.disk_name.indexOf('youtu')!==-1){
                    return 'youtube ';
                }
            default:
                return '';
        }
    }
    render() {
        let gallery = this.props.gallery;
        // assembly owl-carousel settings
        const owlOptions = {

            navText: ['<i class="lsPrev prevCarousel"></i>','<i class="lsNext nextCarousel"></i>'],
            tl:false,
            loop:false,
            nav:false,
            autoplay:false,
            lazyLoad:true,
            lazyContent:true,
            pullDrag:false,
            mouseDrag:true,
            freeDrag:true,
            smartSpeed: 2000,
            responsive:{
                0:{
                    margin:15,
                    items:2
                },
                600:{
                    margin:30,
                    items:4
                },
                960:{
                    margin:30,
                    items:5
                },
                1200:{
                    margin:30,
                    items:6
                }
            }
        };


        let gallery_images = keyLengthExists(gallery.gallery_images,'system_files');

        let device = userDevice();
        switch (device){
            case 'mobile':
                gallery_images = groupByLimit(gallery_images,4);
                break;
            case 'tablet':
                gallery_images = groupByLimit(gallery_images,10);
                break;
           default:
                gallery_images = groupByLimit(gallery_images,2);
                break;

        }

        return (

            gallery_images ?

                <div className="assembly owl-carousel col-12" options={owlOptions} >
                    {Object.keys(gallery_images).map((key,index_array)=>{
                        return (<div key={index_array} className="option-item">
                            {gallery_images[key].map((image,index)=>{

                                let images = groupBy(image.system_files, 'field');
                                return ((images.small && images.main) ?
                                        <p key={index}  className={"option"}>
                                            <a className={this.getClassname(images.main[0])} target={(this.getClassname(images.main[0])==='pdf') ? '_blank' : ''} rel="nofollow" href={images.main[0].disk_name}>
                                                <LazyLoadImage className="option-image" src={images.small[0].disk_name} alt="" />
                                                <span className="room-name">{images.small[0].file_name}</span>
                                            </a>
                                        </p>
                                    : ''
                                )
                            })}
                        </div>)
                    })}
                </div>
                :''

        )
    }
}



export default CabinetsGallery;

