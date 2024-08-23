import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ProductListSeries from "./ProductListSeries";
import LazyLoadImage from "../parts/LazyLoadImage";

const ProductListItem = ({...props}) => {
    let product = props.product;

    const [image,setImage] = useState((product.system_files && product.system_files[0]) ? product.system_files[0] : null);


    const getDiscountPercent = () => {
        let value = 0;
        let product = props.product;
        value = Math.round(100 - (product.price_new * 100 / product.price));
        return value;
    };

    let discount = getDiscountPercent();

    const hoverImage=(image)=>{
        if(image){
            setImage(image)

        }else{
            setImage((product.system_files && product.system_files[0]) ? product.system_files[0] : null)

        }
    };

    useEffect(()=>{
        setImage((product.system_files && product.system_files[0]) ? product.system_files[0] : image);
    },[props.product]);

    return <div className={props.itemClass}>
        <div className="product-thumb">
            <div className="product-image">
                {

                    product.price_new && discount>0 ?
                        <React.Fragment>
                            <div className={'discount'}/>
                            <div className="discount-value">-{discount}%</div>
                        </React.Fragment>
                        : ''
                }
                <Link to={product.slug}>
                    {!!(image) &&
                        <LazyLoadImage height={200} src={image.disk_name} alt={image.file_name} noWebp={true}/>
                    }
                </Link>
            </div>
            <div className="product-title">
                {!!product.main_series && <ProductListSeries product={product} series={product.main_series} hoverImage={hoverImage}/>}
                <h4 ><Link to={product.slug}>{product.name}</Link></h4>
            </div>
        </div>
    </div>
}
export default ProductListItem;
