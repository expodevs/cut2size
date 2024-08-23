import React from 'react';
import {formatPrice} from "../../../../functions/frontend";

const FreeShipping=({discountAmounts})=>{

    return <div>
        {discountAmounts.rows && discountAmounts.rows.map(discount=>
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className={"title text-center"}>
                            {discount.discount}% off {discount.free_shipping ? " with free shipping" : ""}  orders over &nbsp;{formatPrice(discount.amount,true,true)}
                        </h2>
                    </div>
                </div>
        )}
    </div>
}

export default FreeShipping;