import React from "react";
import {getInfo} from "../../../../actions/admin";
import {store} from "../../../../store";


const SignToFee4beeDesigner=({styled=false})=>{




    const sign=async (e)=>{

        e.preventDefault();

        try {
            let result = await store.dispatch(getInfo(`${process.env.REACT_APP_API_SERVER_URL}/customers/login-fee4bee`));
            console.log('result',result);
            if(result && result.token){
                let url = `${process.env.REACT_APP_FEE4BEE_URL}/?partner_login=${result.token.replace('Bearer','').trim()}`;
                window.open(url,'_blank');
            }


        }catch (e) {
            console.error(e)
        }

    };


    return  styled ?
            <a onClick={sign} href={'#'} className={"fee4bee-link"}>
                <span>Get paid for your work!</span>
                <img src="/images/fee4bee_logo.svg" alt="fee4bee" className={"d-block"}/>
            </a>
            :
            <a onClick={sign} href={'#'} className={"fee4bee-link-no-styled"}>
                <span>Get paid for your work!</span>
            </a>


};
export default SignToFee4beeDesigner;
