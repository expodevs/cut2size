import React, {useState} from "react";
import propTypes from 'prop-types';
import {formatName, formatPrice} from "../../../../functions/frontend";
const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;

const Discount=({order,setDiscountCode})=>{

    const [code,setCode]=useState('');

  return <React.Fragment>


            <div className="total-price">
                {(!!order.order_discounts && order.order_discounts.length>0) &&

                    order.order_discounts.map(discount=>{
                        return <p className="price">{formatName(discount.type)}:
                            <span>
                                {
                                    (discount.amount).toString().indexOf('%')!==-1 ? discount.amount :  currencySymbol+formatPrice(discount.amount )
                                }
                                    &nbsp;
                                    (Old price {currencySymbol+formatPrice(discount.subtotal_old )})
                            </span>
                        </p>

                        })

                }
                  <p className="price">Discount code:
                      <span className={'discount-input'}>
                          <input type="text" onChange={e=>setCode(e.target.value)} value={code} className={"form-control"} name={"discount_code"}/>
                          <button onClick={e=>setDiscountCode(e,code)} className={'btn btn-primary'}>Apply</button>
                      </span>
                  </p>
          </div>
          </React.Fragment>
};

Discount.propTypes={
    order:propTypes.object.isRequired,
    setDiscountCode:propTypes.func.isRequired,
};


export default Discount;
