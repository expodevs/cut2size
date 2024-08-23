import React, {Component, PureComponent} from 'react';
import ModalGalleryItem from './ModalGalleryItem';
import {groupBy, keyLengthExists} from "../../../../functions/main";
import Slider from "react-slick";
import {isMobile} from "../../../../functions/frontend";
import InstagramModalGalleryItem from "./InstagramModalGalleryItem";


class InstagramGallery extends Component {

    render() {
        let gallery = this.props.gallery;

        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 6,
            slidesToScroll: 6,
            adaptiveHeight: true,
            arrows: !isMobile(),
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
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        infinite: true,
                        centerPadding: '60px',
                        center:false,
                        dots: false,
                    }
                }
            ]
        };

        let images = [];
        Object.entries(gallery).forEach((item, index) => {
            let image = item[1];
            if (image.media_type === 'IMAGE'){
                images.push(image)
            }
        })

        return (
            (images && images.length) ?
                    <div className="exterior-material-gallery instagram-gallery-wrap">
                        <div>
                            <Slider {...settings}>
                                {images.map((image, index)=>{
                                    return (<ul key={index} className="gallery-list">
                                        <InstagramModalGalleryItem item={image} />
                                    </ul>)})}
                            </Slider>
                        </div>

                    </div>
                :''
        )
    }
}



export default InstagramGallery;

