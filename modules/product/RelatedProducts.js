import React, { useState } from 'react';
import ProductViewedItem from "./ProductViewedItem";

const RelatedProducts = (props) => {

    const [products, setProducts] = useState(props.products.slice(0, 4));
    const [stateButton, setStateButton] = useState(true);
    
    const showAllItems = () => {
        setProducts(props.products);
        setStateButton(false);
    };
    return (
        (products && products.length) ?
            <React.Fragment>
                <div className={'block-title'}>YOU MAY ALSO NEED</div>
                <div className={'product-items-wrapper'}>
                    {
                        products.map((item, index) => {
                            return <ProductViewedItem
                                product={item}
                                key={index}
                            />
                        })
                    }
                </div>
                {
                    (stateButton) ?
                    <div className="button-wrap">
                        <button className="button-more btn btn-success" onClick={showAllItems}>SHOW MORE</button>
                    </div>
                    : ''
                }
                
            </React.Fragment>
        : ''
    );
}
export default RelatedProducts;
