import WebpImage from "../parts/WebpImage";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";


const AccountButton=({customer,toggleShow,})=>{


    const [className,setClassName] = useState('account-link');


    useEffect(()=>{

        console.log('parseInt(customer.id)',parseInt(customer.id))
        if(parseInt(customer.id)){
            setClassName('account-link logged-in')
        }else{
            setClassName('account-link ')
        }
    },[customer])


    return <button className={className} onClick={e=>toggleShow(e)} aria-label="User burron">
            <WebpImage className="account-link"  src="/uploads/Login_Icon.svg" alt="User icon" />
        </button>
};
const mapStateToProps = (state) => ({
    customer: state.auth.customer,
});
export default connect(mapStateToProps)(AccountButton);


