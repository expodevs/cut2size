import {Link} from "react-router-dom";
import {formatPrice} from "../../../../functions/frontend";
import React from "react";
import {LinkSpan} from "./CartItem";
import KitFields from "./KitFields";
import ProductProperties from "./ProductProperties";
import ProductOptions from "./ProductOptions";

function CartProductMobile(props) {

    let product = props.product;
    let product_properties = props.product_properties;
    let fields = props.fields;
    let colWidth = props.colWidth;
    let minicart = props.minicart;
		let product_options = product.addons;

    return <div className="product-item mobile row">
        <div className="product-image-mobile col-3"><LinkSpan  to={ '/'+product.slug}  >
            {(product.system_files &&product.system_files.length>0) ?
                <img  src={product.system_files[0].disk_name} alt={product.system_files[0].file_name} />
                :
                ''}</LinkSpan></div>
        <div className="product-information-mobile col-5">
            <p className="product-title"><LinkSpan to={'/'+product.slug}>{product.name}</LinkSpan></p>
            <div className="kit-fields">
                {(fields)&&
                <KitFields
                    fields={fields}
                    colWidth={colWidth}
                    minicart={minicart}
                />
                }
                {(product_properties) &&
                <ProductProperties
                    product_properties={product_properties}
                    colWidth={colWidth}
                    minicart={minicart}
                />
                }
            </div>
						<div className="product-options">
							{(product_options) &&
							<ProductOptions
								product_options={product_options}
							/>
							}
						</div>

            {!product.sample_id && product.kit ? <span className="remove">
                    <Link className={'editProduct'} onClick={e => props.editKit(e, product)}
                          to={'/' + product.slug}>Edit</Link>
                </span> : ''}

        </div>
        <div className={"col-4"}>
            <div className="remove-product">
                <button onClick={e=>props.deleteItem(e,product)} className="remove">
                    <div className="icon-delete"/>
                    <div className={'remove-text'}>Remove</div></button>
            </div>
            <div className="product-quantity">
                <div className="quantity-buttons">
                    <div className="quantity minus"><button className="quantity-minus" onClick={e=>props.setProductQuantity(e,product, product.quantity-1)}><svg className="minus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><rect y="19" width="42" height="4"/></svg></button></div>
                    <div className="quantity input"><input className="quantity-number" min={1} onChange={e=>props.setProductQuantity(e,product, e.target.value)} type="text" name="product-quantity" value={product.quantity} /></div>
                    <div className="quantity plus"><button className="quantity-plus" onClick={e=>props.setProductQuantity(e,product, product.quantity+1)}><svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><polygon points="42,19 23,19 23,0 19,0 19,19 0,19 0,23 19,23 19,42 23,42 23,23 42,23 "/></svg></button></div>
                </div>
            </div>
            <div className="product-total-price">
                <p className="price">{formatPrice((product.price_new ?product.price_new: product.price)*product.quantity,true,true)}</p>
            </div>
        </div>

    </div>
}

export default CartProductMobile;
