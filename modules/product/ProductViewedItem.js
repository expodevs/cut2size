import React, {useEffect, useState} from "react";
import WebpImage from "../parts/WebpImage";
import {Link} from "react-router-dom";
import {formatPrice} from "../../../../functions/frontend";
import {ProductListSeries} from "../category/ProductListSeries";

const ProductViewedItem = (props) => {

    let product = props.product;
    // let image = (product.system_files && product.system_files[0]) ? product.system_files[0] : null;
    const [image,setImage] = useState((product.system_files && product.system_files[0]) ? product.system_files[0] : null);
    const [imageClass, setClassImage] = useState('');

    useEffect(() => {
        setImage((product.system_files && product.system_files[0]) ? product.system_files[0] : null)
    }, [product.system_files]);

    const hoverImage=(image)=>{
        if(image){
            setClassImage('active');
            setTimeout(function () {
                setImage(image);
            }, 200);

            setTimeout(function () {
                setClassImage('');
            }, 400);

        }
        // else{
        //     setImage((product.system_files && product.system_files[0]) ? product.system_files[0] : null)
        // }
    };

    const getDiscountPercent = () => {
        let value = 0;
        let product = props.product;
        value = Math.round(100 - (product.price_new * 100 / product.price));
        return value;
    };

    let discount = getDiscountPercent();

    return (
        <div className={'item'} >
                <div onClick={() => { window.location.replace('/' + product.slug) }}>
                <div className={'product-image ' + imageClass}>
                    {
                        product.price_new && discount>0 ?
                            <React.Fragment>
                                <div className={'discount'}/>
                                <div className="discount-value">-{discount}%</div>
                            </React.Fragment>
                            : ''
                    }
                    {(image) ? <WebpImage src={image.disk_name} alt={image.file_name} width="600" height="600" /> : ''}
                </div>
            {product.bestseller ? <div className={'bestseller-label'}>Bestseller</div> : ''}
            <div className={'bottom'}>
                <div className={'product-name'}>{product.name}</div>
                <div className={'product-price'}>
                    <div className={'price' + (product.price_new ? ' color-green' : '')}>
                        {formatPrice(product.price_new ? product.price_new : product.price, true, true)}
                    </div>
                    <div className={'price-old'}>{product.price_new ? formatPrice(product.price, true, true) : ''}</div>
                </div>
                {!!product.main_series && <ProductListSeries product={product} series={product.main_series} properties={props.properties} hoverImage={hoverImage} mainLink={product.slug}/>}
            </div>
            {/*<button className={'view-item-btn'}>View Item</button>*/}
            </div>
        </div>
    );
}

export default ProductViewedItem;
