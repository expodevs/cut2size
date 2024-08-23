import WebpImage from "../parts/WebpImage";
import React, {useState} from "react";
import {store} from "../../../../store";
import {addProductToCart} from "../../../../actions/cart";
import {addToCartAnimation, formatPrice} from "../../../../functions/frontend";
import ReactResponsiveModal from "react-responsive-modal";
import {setGtmEvent} from "../../../../functions/GtmDataLayer";
const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;


const SampleItem = ({sample}) =>{

    let sampleProduct = {...sample};
    sampleProduct.name = "SAMPLE: " + sampleProduct.name;
    sampleProduct.price=sampleProduct.sample_price||0;
    sampleProduct.id = sampleProduct.product_id;
    sampleProduct.sample_id  = sampleProduct.product_id;
    const[product]  = useState(sampleProduct);
    const [quantity,setQuantity] = useState(1);
    const [openModal,setOpenModal] = useState(false);

    const getTotal = () => {
        return product.price * quantity;
    }

    const addToCart=()=>{
        product.system_files=[{disk_name:product.image}];
        store.dispatch(addProductToCart(product, parseInt(quantity)));
        addToCartAnimation(`sample-image-${product.product_id}`,`sample-image-${product.product_id}`);
    };

    return <React.Fragment>
        <div  className={"product-layout col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 mb-3"}>
            <div className={"product-thumb"}>
                <div className="product-image">
                    <WebpImage src={product.image_preview||product.image||'/images/product_placeholder.jpg'} id={`sample-image-${product.product_id}`} />
                    <div className={'lens-icon'} onClick={() => {
                        setGtmEvent('view_item', product);
                        setOpenModal(true)}
                    }></div>
                </div>
                <div className="sample-bottom">
                    <div className="product-title">
                        {product.name}
                    </div>
                    <div className="product-price-row">
                        <div className="product-price">
                            <span className="price price-value">
                            <b className="new-price"><span className="currency">{currencySymbol}</span><span className="number">{formatPrice(product.price)}/pc</span></b>
                        </span>
                                <div className="product-quantity">
                                    <div className="quantity-buttons">
                                        <div className="quantity minus">
                                            <button className="quantity-minus" onClick={(e) => setQuantity(quantity - 1)}>
                                                <svg className="minus-icon" xmlns="http://www.w3.org/2000/svg" x="0px"
                                                     y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}}
                                                     xmlSpace="preserve">
                                                    <rect y="19" width="42" height="4"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="quantity input"><input className="quantity-number"
                                                                               onChange={(e) => setQuantity(e.target.value)}
                                                                               min={1} type="text" name="product-quantity"
                                                                               value={quantity}/></div>
                                        <div className="quantity plus">
                                            <button className="quantity-plus" onClick={(e) => setQuantity(quantity + 1)}>
                                                <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px"
                                                     y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}}
                                                     xmlSpace="preserve">
                                                    <polygon
                                                        points="42,19 23,19 23,0 19,0 19,19 0,19 0,23 19,23 19,42 23,42 23,23 42,23 "/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                        <div className={'total-btn-row'}>
                            <div className="total-btn">
                                <div className={'total-price'}>
                                    <span>Total price:</span>
                                    <span className={'price price-total'}><span
                                        className="currency">{currencySymbol}</span> {formatPrice(getTotal())}</span>
                                </div>
                                <div className={'total-price-btn'}>
                                    <button className="cart-button" onClick={() => addToCart()}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        <ReactResponsiveModal open={openModal} onClose={() => setOpenModal(false)} center
              styles={{
                  modal:{
                      maxWidth: "1200px"
                  },
                  "modal-body":{
                      marginTop:"10%"
                  }
              }}
        >
            <div className="modal-body">
                <h2 className={''}>{product.name}</h2>
                <div className="sample-full-image">
                    <WebpImage src={product.image||'/images/product_placeholder.jpg'} id={`sample-image-${product.product_id}`} />
                </div>
            </div>
        </ReactResponsiveModal>
    </React.Fragment>
};
export default SampleItem;
