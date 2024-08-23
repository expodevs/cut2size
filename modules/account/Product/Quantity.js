import React, {useState} from "react";
import {store} from "../../../../../store";
import {sendPost} from "../../../../../actions/admin";
import {setNotification} from "../../../../../actions/init";
const url =process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL


const Quantity=({product,productsEdit,order})=>{

    const [quantity,setQuantity] = useState(product.quantity);


    const changeQuantity=async(value)=>{
        setQuantity(value);


        let result = await store.dispatch(sendPost(`${url}/orders/change-order-product/${order.id}`,
            {
                product_id:product.product_id,
                kit_id:product.kit_id,
                order_id:product.order_id,
                quantity:value
            },'PUT'));
        if(result && result.data && result.data.success){
            store.dispatch(setNotification('Saved!','success'))
        }

    };

    return <div className="product-quantity">
        {!productsEdit
            ?
        <p className="quantity">Quantity:&nbsp;


                <span>{quantity}</span>
        </p>
            :
            <label htmlFor="">
                Qty
                <input  type="number" style={{width:"40px"}} value={quantity} onChange={(e)=>changeQuantity(e.target.value)}/>

            </label>
        }

    </div>
};
export default Quantity;
