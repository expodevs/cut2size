import React from "react";
import {connect} from "react-redux";
import {setCurrency } from '../../../../actions/currencies'
import {findObjectInArrayByKey} from "../../../../functions/main";
import {checkIsAdmin} from "../../../../actions/admin";
const CurrencySelector=({currencies,currentCurrency})=>{

    const changeCurrency=(id)=>{

        id = 1; //Use only CAD after 24.08

        let currency = findObjectInArrayByKey(currencies.rows,'id',parseInt(id));
        setCurrency(currency)
        window.location.reload()
    };

    return (currencies && currencies.rows&& currencies.rows.length /*&& checkIsAdmin()*/) ?
        <select className="custom-select account-nav currency-select" value={currentCurrency.id} onChange={e=>{
            e.preventDefault();
            changeCurrency(e.target.value)
        }}  >
            { currencies.rows.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
        </select>:''
};


const mapStateToProps = (state) => ({
    currencies: state.currency.currencies,
    currentCurrency: state.currency.currentCurrency,
});
export default (connect(mapStateToProps)(CurrencySelector));
