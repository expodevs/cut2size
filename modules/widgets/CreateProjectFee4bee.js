import React from "react";
import {sendPost} from "../../../../actions/admin";
import {store} from "../../../../store";


const CreateProjectFee4bee=({})=>{


    const submit=async (e)=>{

        e.preventDefault();

        try {
            let result = await store.dispatch(
                sendPost(`${process.env.REACT_APP_API_SERVER_URL}/customers/create-project-fee4bee`,{

                })
            );
            console.log('result',result);
            // if(result && result.token){
            //     let url = `${process.env.REACT_APP_FEE4BEE_URL}/?partner_login=${result.token.replace('Bearer','').trim()}`;
            //     window.open(url,'_blank');
            // }


        }catch (e) {
            console.error(e)
        }

    };


    return  <a onClick={submit} href={'#'} className={""}>
                <span>Create project</span>
                <img src="/images/fee4bee_logo.svg" alt="fee4bee" className={"d-block"}/>
            </a>


};
export default CreateProjectFee4bee;
