import React, {memo, useEffect} from "react";
import Slider from "react-slick";
import WebpImage from "../parts/WebpImage";
import {isMobile} from "../../../../functions/frontend";

const ProductImageSlider=memo(({system_files,hoverImage,toggle})=>{



    const  NextArrow=(props)=> {
        const { className, style, onClick } = props;
        return (
            <button
                onClick={onClick}

                type="button" className="image-gallery-icon image-gallery-right-nav" aria-label="Next Slide">
                <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none"
                     stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        );
    };
    const PrevArrow= (props)=> {
        const { className, style, onClick } = props;
        return (
            <button
                onClick={onClick}
                type="button" className="image-gallery-icon image-gallery-left-nav" aria-label="Previous Slide">
                <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none"
                     stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
        );
    }

    const settings = {

        // dots: true,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: !isMobile(),
        verticalSwiping: !isMobile(),
        nextArrow: <PrevArrow />,
        prevArrow: <NextArrow />,
        adaptiveHeight: true,
    };


    useEffect(()=>{

    },[])
    return  <Slider {...settings}>
        {system_files&& system_files.length>0 ?
            system_files.map((file,index)=>{
                return (
                    <div
                        key={file.id}

                    >
                        <a
                            onMouseEnter={e=>hoverImage(file)}
                            // onMouseLeave={e=>hoverImage(file)}
                            onClick={(e) => {e.preventDefault(); toggle(file); }}
                            href={'#'+file.file_name}
                            aria-label="Button image"
                        >
                            <WebpImage src={file.disk_name} alt="image" width="100" height="100" />
                        </a>
                    </div> );
            })
            :'' }
    </Slider>
});



export default ProductImageSlider;
