import React, { PureComponent } from 'react';

import {groupBy, keyLengthExists} from "../../../../functions/main";
import LazyLoadImage from "../parts/LazyLoadImage";

import Slider from "react-slick";


class CarouselGallery extends PureComponent {




    getClassname(item){
        switch(item.content_type){
            case 'application/pdf':
                return 'pdf';
            case 'link':
                if(item.disk_name.indexOf('youtu')!==-1){
                    return 'youtube fancybox.iframe';
                }
            default:
                return '';
        }
    }
    render() {
        let gallery = this.props.gallery;

        let gallery_images = keyLengthExists(gallery.gallery_images,'system_files');


        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 6,
            slidesToScroll: 6,
            rows: gallery_images.length>6 ? 2: 1,
            adaptiveHeight: false,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1,
                        rows:1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rows:1,

                    }
                }
            ]
        };

        return (
            gallery_images ?
                <div className="assembly">
                    <Slider {...settings}>

                        {gallery_images.map((image, index_array) => {

                        let images = groupBy(image.system_files, 'field');
                        return (images.small && images.main) ? (<div key={index_array} className="assembly-items  align-items-center">
                                            <div className={"assembly-item"}>
                                                <a className={this.getClassname(images.main[0])}
                                                   target={(this.getClassname(images.main[0]) === 'pdf') ? '_blank' : ''}
                                                   rel="nofollow" href={images.main[0].disk_name}><LazyLoadImage
                                                    height={200}
                                                    src={images.small[0].disk_name} alt=""/></a>
                                                <p className="price" dangerouslySetInnerHTML={{__html:image.caption}}/>
                                                <div className="customize-button">
                                                    <a href={images.main[0].disk_name}>customize</a>
                                                </div>
                                            </div>

                            </div>)
                            : ''
                        })
                        }
                    </Slider>
                </div>
                :''

        )
    }
}



export default CarouselGallery;

