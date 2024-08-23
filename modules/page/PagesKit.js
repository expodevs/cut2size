import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Slider from "react-slick";
import {isMobile} from "react-device-detect";
import axios from "axios";
import LazyLoadImage from "../parts/LazyLoadImage";
import getKitIdFromUrl from "../../../../utils/getKitIdFromUrl";
let apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    rows:1,
    // adaptiveHeight: true,
    swipeToSlide: true,
    lazyLoad:true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
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
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ],
};

const PagesKit=({pages_kit})=>{
    const [kits, setKits] = useState([]);
    useEffect(()=>{
        // getKits();
    }, [pages_kit])
    const getUrlFromKitId = (id) => {
        return '/calculator/specifications/'+id;
    };

    const getKits = () => {
        let ids = [];
        pages_kit.map((item) => {
            ids.push(getKitIdFromUrl(item.url));
        });
        axios.post(
            `${apiUrl}/kit/api/kit/get-combo-images`, {ids:ids, kitImage:true}
        ).then(res=>{
            if (res.data && res.data.length>0) {
                let tmp = [];
                res.data.map((elem)=>{
                    elem.kit['url'] = getUrlFromKitId(elem.kit.id);
                    tmp.push(elem.kit);
                })
                setKits(tmp);
            }
        })
    }

    return (kits && kits.length)?
        <div className={'options'}>
            <div className="assembly" id="roomCarousel" >
                <Slider {...sliderSettings} >
                    {kits.map((item) => {
                        return <KitItem
                            key={item.id}
                            item={item}
                        />
                    })}
                </Slider>
            </div>
        </div>

        :null
};

const KitItem=({item})=>{

    return <div className={(isMobile ? ' option-item-mobile-wrapper' : 'option-item-wrapper')}>
        <div className={"slider-Kit-item option-item choosed" + (isMobile ? ' option-item-mobile' : '')}>
            <div className="option choose" >
                <a href={item.url}>
                    <LazyLoadImage className="option-image" src={item.small_image} alt="" height={200}/>
                    <p className={'name'}>{item.name}</p>
                    <button className={'btn btn-success'}>Order Now</button>
                </a>
            </div>
        </div>
    </div>
};

PagesKit.defaultProps={
    pages_kit:PropTypes.array
};
export default PagesKit;
