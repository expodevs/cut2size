import {Link} from "react-router-dom";
import {formatPrice} from "../../../../functions/frontend";
import React from "react";
import {LinkSpan} from "./CartItem";
import KitFields from "./KitFields";
import ProductProperties from "./ProductProperties";
import ProductOptions from "./ProductOptions";

function CartProduct(props) {

    let product = props.product;
    let fields = props.fields;
    let product_properties = props.product_properties;
    let colWidth = props.colWidth;
    let minicart = props.minicart;
    let product_options = product.addons;
    return <div className="product-item">
        <div className="remove-product">
            <button onClick={e=>props.deleteItem(e,product)} className="remove">
                <svg className="remove-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" style={{enableBackground: "new 0 0 12 12"}} xmlSpace="preserve"><g><g transform="translate(-656 -192)"><g><path d="M661.4,198l-5.3,5.4c-0.1,0.1-0.1,0.4,0,0.5c0.1,0.1,0.4,0.1,0.5,0c0,0,0,0,0,0l5.4-5.4l5.4,5.4c0.1,0.1,0.4,0.1,0.5,0c0,0,0,0,0,0c0.1-0.1,0.1-0.4,0-0.5l-5.3-5.4l5.3-5.4c0.1-0.1,0.1-0.4,0-0.5c-0.1-0.1-0.4-0.1-0.5,0c0,0,0,0,0,0l-5.4,5.4l-5.4-5.4c-0.1-0.1-0.4-0.1-0.5,0c0,0,0,0,0,0c-0.1,0.1-0.1,0.4,0,0.5L661.4,198z"/></g></g></g></svg>
            </button>
            {!product.sample_id && product.kit ?
                <span className="remove">
                            <Link className={'editProduct'} onClick={e=>props.editKit(e,product ) } to={ '/'+product.slug}  ><i className={'fa fa-pencil'}/></Link>
                        </span> : ''
            }

        </div>
        <div className="product-image"><LinkSpan  to={ '/'+product.slug}  >
            {(product.system_files &&product.system_files.length>0) ?
                <img  src={product.system_files[0].disk_name} alt={product.system_files[0].file_name} />
                :
                ''}</LinkSpan></div>
        <div className="product-information">
            <p className="product-title"><LinkSpan to={'/'+product.slug}>{product.name}</LinkSpan></p>
        </div>
        <div className="kit-fields">
            {(fields  && product.category_id !== 46)&&
            <KitFields
                fields={fields}
                colWidth={colWidth}
                minicart={minicart}
            />
            }
            {(product_properties && product.category_id !== 46) &&
                <ProductProperties
                    product_properties={product_properties}
                    colWidth={colWidth}
                    minicart={minicart}
                />
            }
        </div>
				<div className="product-options">
					{(product_options  && product.category_id !== 46) &&
						<ProductOptions
							product_options={product_options}
						/>
					}
				</div>
        <div className="product-price"><span className="text">Price/PC:&nbsp;</span><span className="price price-value">
                            {(product.price_new) ?
                                <React.Fragment>
                                    <b className="old-price">{formatPrice(product.price,true,true)}</b>
                                    <b className="new-price">{formatPrice(product.price_new,true,true)}</b>
                                </React.Fragment>
                                :
                                <b className="new-price">{formatPrice(product.price,true,true)}</b>
                            }
                        </span>
        </div>
        <div className="product-quantity">
            <div className="quantity-buttons">
                <div className="quantity minus"><button className="quantity-minus" onClick={e=>props.setProductQuantity(e,product, product.quantity-1)}><svg className="minus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><rect y="19" width="42" height="4"/></svg></button></div>
                <div className="quantity input"><input className="quantity-number" min={1} onChange={e=>props.setProductQuantity(e,product, e.target.value)} type="text" name="product-quantity" value={product.quantity} /></div>
                <div className="quantity plus"><button className="quantity-plus" onClick={e=>props.setProductQuantity(e,product, product.quantity+1)}><svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><polygon points="42,19 23,19 23,0 19,0 19,19 0,19 0,23 19,23 19,42 23,42 23,23 42,23 "/></svg></button></div>
            </div>
        </div>
        <div className="product-total-price">
            <p className="price">Total: {formatPrice((product.price_new ?product.price_new: product.price)*product.quantity,true,true)}</p>
        </div>
    </div>
}

export default CartProduct;
