import React, {useState} from "react";
import {store} from "../../../../../store";
import {sendPost} from "../../../../../actions/admin";
import {setNotification} from "../../../../../actions/init";
import input from "postcss/lib/input";
import {formatPrice} from "../../../../../functions/frontend";

const Url = process.env.REACT_APP_SERVER_URL;
const ApiUrl = process.env.REACT_APP_API_SERVER_URL;

const PriceItem=({order,product,editable,getInfo})=>{
    const [edit,setEdit] = useState(false);
    const [value,setValue] = useState(product.price);


    const savePrice=async(e)=>{

        setEdit(!edit);

        if (order.status !== 'saved_cart') {
            store.dispatch(setNotification('Custom price disabled in saved cart','error'));
            return;
        }

        let result = await store.dispatch(sendPost(`${Url+ApiUrl}/orders/change-order-product/${order.id}`,
            {
                product_id:product.product_id,
                kit_id:product.kit_id,
                order_id:product.order_id,
                price:value,
                price_custom:value || product.price,
            },'PUT'));
        if(result && result.data && result.data.success){
            store.dispatch(setNotification('New price successfully saved!','success'));
            setEdit(!edit);
            setValue(value);
        }
    };

    return <div className="product-price">
        <p ><span className="text">Price/pc&nbsp;</span>
            <span className="price">
                {edit
                    ?
                    <>
                        <input type="text" value={value} onChange={(e)=>setValue(e.target.value)}/>
                        <i className="icon-check icons ml-1 cursor-pointer " onClick={savePrice}/>
                    </>
                    :
                    <span className="number">
                        {formatPrice(value,true,true,false)}
                        {!!editable &&
                            <i className="icon-pencil icons ml-1 cursor-pointer "
                               onClick={()=>{
                                   setEdit(!edit)
                               }}
                            />
                        }

                    </span>
                }
            </span>
        </p>
    </div>
};

export default PriceItem;