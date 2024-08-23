import React, { PureComponent } from 'react';
import {groupBy} from "../../../../functions/main";
import LazyLoadImage from "../parts/LazyLoadImage";

import Slider from "react-slick";
import {isMobile} from "../../../../functions/frontend";
import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

class SliderGallery extends PureComponent {



    constructor(props){
        super(props);
        this.state={
            nav1: null,
            nav2: null
        }
    }

    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2
        });
    }


    render() {
        let gallery = this.props.gallery;
        const settings = {

            dots: true,
            infinite: true,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };

        return (

                <div className="slider banner-slider">
                    <div className="full-width-title text-align-center" ><h1 className={"title"}>
                        The first online custom cabinet’s manufacturer</h1>
                            <div className="subtitle text-align-center">
                                <h2>Order custom cabinets online with instant price calculator. No hidden fees, top quality warranty.
                                </h2>
                            </div>
                    </div>
                    <div>
                        <Slider {...settings}  asNavFor={this.state.nav2}
                                lazyLoad={true}
                                ref={slider => (this.slider1 = slider)}
                                className={'main-slider-banner'}
                                adaptiveHeight={true}
                        >
                            { gallery.gallery_images && gallery.gallery_images.map((image, index) => {
                                let images = groupBy(image.system_files, 'field');
                                let color = image.color ? hexToRgba(image.color,image.opacity || 60) : false;

                                let style = color ? {backgroundColor:color} : {};

                                return <>
                                        <LazyLoadImage
                                            className="image-gallery-image"
                                            src={images.main ? images.main[0].disk_name : ''}
                                            height={'40vh'}
                                            noWebp={true}
                                            key={image.id}
                                            alt={(image.title || image.description)}
                                        />
                                    {!!(image.title  || image.description) &&
                                        <div className={"slide-layer-info " + (image.position==='left' ? 'left' : (image.position==='right' ? 'right' : 'center' ))} style={style}>
                                            <div className="layer-title">{image.title }</div>
                                            <div className="layer-text" dangerouslySetInnerHTML={{__html:image.description || ''}}/>

                                            <div className="link-wrap"><a href={image.url} className="link">{image.button_text || "Try it now"}</a></div>
                                        </div>
                                    }

                                    </>
                            })
                            }
                            
                        </Slider>
                            <div className="subtitle text-align-center mobile">
                                <h3>Order custom cabinets online with instant price calculator. <b>No hidden fees, top quality warranty.</b></h3>
                            </div>
                        {/* {isMobile() ? '' :
                            <Slider
                                slidesToShow={8}
                                swipeToSlide={true}
                                focusOnSelect={true}
                                asNavFor={this.state.nav1}
                                ref={slider => (this.slider2 = slider)}
                                arrows={false}
                                dots={false}
                                lazyLoad={true}
                                adaptiveHeight={true}
                                infinite={false}
                                className={'main-slider-navigation'}
                            >
                                { gallery.gallery_images &&  gallery.gallery_images.map((image, index) => {
                                    let images = groupBy(image.system_files, 'field');
                                    return <img
                                        className="image-gallery-image"
                                        src={images.small ? images.small[0].disk_name : ''}
                                        height={'5vh'}
                                        // noWebp={true}
                                        key={image.id}
                                    />
                                })
                                }
                            </Slider>
                        } */}

                    </div>
                </div>
        )
    }
}

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
}

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



export default SliderGallery;

