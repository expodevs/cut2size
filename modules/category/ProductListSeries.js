import React from "react";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import {UncontrolledTooltip} from "reactstrap";
import WebpImage from "../parts/WebpImage";
import {isMobile} from "react-device-detect";

export const ProductListSeries=({series,product,hoverImage, mainLink, properties})=>{
    const settings = {

        // dots: true,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        vertical: false,
        verticalSwiping: false,
        arrows: false
    };

    const filterSeries = () => {


        return [...series].filter(el =>
            properties.some(f =>
                f['product_property.main'] === 1 && f['product_property.id'] === el.product_sery.product_property_id
            )
        );
    };

    const removeDuplicates = (originalArray) => {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {

            if(originalArray[i]['product_sery']['product_property_value']){
                lookupObject[originalArray[i]['product_sery']['product_property_value']['value']] = originalArray[i];
            }
        }

        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    };

    const pushMainProduct = (series)=>{
        return [...[{...product}],...series];
    };

    let filteredSeries = pushMainProduct(removeDuplicates(filterSeries()));

    return (filteredSeries &&filteredSeries.length>0)?
        <div className={'product-list-series'}>
            <Slider {...settings}>
                {filteredSeries.map((serie,index)=> {
                    if (index <= 3)
                        return <ProductSeriesItem item={serie} key={index} hoverImage={hoverImage}/>;
                    else return <div className={'main-item plus-icon'}>
                        <a href="#" onClick={() => { window.location.replace('/' + mainLink) }} className="link-plus">
                            {/*<img className="gallery-image" src="/images/plus.svg" alt=""/>*/}
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="" height="" viewBox="0 0 512 512">
                                <path d="M295.516 216.494h154v78.992h-154v-78.992z" fill="#000000" />
                                <path d="M62.474 216.514h154.050v78.971h-154.050v-78.971z" fill="#000000" />
                                <path d="M216.525 295.465h79.001v154.050h-79.001v-154.050z" fill="#000000" />
                                <path d="M216.525 62.474h79.001v154.041h-79.001v-154.041z" fill="#000000" />
                                <path d="M216.525 216.514h79.001v78.971h-79.001v-78.971z" fill="#000000" />
                            </svg>
                        </a>
                    </div>
                    }
                )}
            </Slider>
        </div>
        : ''
};

const ProductSeriesItem=({item,hoverImage})=>{


    return <div className={`main-item ${item.product_sery.master_product_id===item.product_sery.product_id? 'main' : ''}`}>
                {!!item &&
                    <React.Fragment>
                            <a id={'product_sery' + item.id} onClick={(event) => { event.stopPropagation();event.cancelBubble = true;window.location.replace('/' + item.slug) }} onMouseEnter={e=>hoverImage(item.system_files[0])}  onMouseLeave={e=>hoverImage(false)} >
                                <WebpImage className="gallery-image" src={item.system_files[0]?.disk_name} width={isMobile ? '23' : '45'} height={isMobile ? '23' : '45'} alt=""/>
                            </a>
                        {
                            item.product_sery.product_property_value && item.product_sery.product_property_value.value &&
                            <UncontrolledTooltip
                                className={'product-sery-tooltip'}
                                placement="top" autohide={false}
                                target={'product_sery' + item.id}
                                delay={10}
                            >{item.product_sery.product_property_value.value}</UncontrolledTooltip>
                        }
                    </React.Fragment>
                }
            </div>
};

export default ProductListSeries;
