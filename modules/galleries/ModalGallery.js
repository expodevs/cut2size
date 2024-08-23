import React, { PureComponent } from 'react';
import ModalGalleryItem from './ModalGalleryItem';
import {groupBy, keyLengthExists} from "../../../../functions/main";
import Slider from "react-slick";
import {isMobile} from "../../../../functions/frontend";


class ModalGallery extends PureComponent {



    render() {
        let gallery = this.props.gallery;
        let gallery_images = keyLengthExists(gallery.gallery_images,'system_files');



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
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.75,
                        slidesToScroll: 1,
                        center:false,
                        dots: true,
                    }
                }
            ]
        };
        return (

            (gallery_images && gallery_images.length) ?
                    <div className="exterior-material-gallery">
                        <div>
                            <Slider {...settings}>

                                {gallery_images.map((gallery_image,index_array)=>{
                                    let images = groupBy(gallery_image.system_files, 'field');
                                    return (<ul key={index_array} className="gallery-list">
                                                <ModalGalleryItem item={{...images}} />
                                    </ul>)})}
                            </Slider>
                        </div>

                    </div>
                :''
        )
    }
}



export default ModalGallery;

