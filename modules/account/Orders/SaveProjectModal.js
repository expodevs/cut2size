import Modal from "react-responsive-modal";
import ProductItem from "../ProductItem";
import OrderSample from "../OrderSample";
import KitItem from "../KitItem";
import {formatPrice, getCurrency} from "../../../../../functions/frontend";
import React, {useEffect, useState} from "react";
import {uniqId} from "../../../../../functions/main";
import {store} from "../../../../../store";
import {formSubmit, setNotification} from "../../../../../actions/init";
import {withRouter} from "react-router-dom";


const SaveProjectModal=({order,closeModal,projectNameModal,getOrders})=>{

    const [name,setName]= useState('');

    useEffect(()=> {
        setName(order.project_name)
    }, [order])

    const saveProjectName=() =>{
        let url = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/save-project-name/'+order.id;
        let data = {
            name:name
        };
        store.dispatch(formSubmit(false, 'put', data, url)).then(res => {

            if(res.data && res.data.success){
                closeModal(false);
                store.dispatch(setNotification( res.data.success, 'success', 5000));
                getOrders()
            }
        });
    }

    return <Modal open={projectNameModal} onClose={e=>closeModal(false)} center
                  styles={{
                      modal:{
                          maxWidth: "1200px"
                      },
                      "modal-body":{
                          marginTop:"10%"
                      }
                  }}
                  classNames={{
                      overlay : 'dont-close-cart',
                  }}
                  showCloseIcon={false}
    >
        <div className="modal-body dont-close-cart">
            <h2 className={'dont-close-cart'}>Project name</h2>
            <div className={'form-group dont-close-cart'}>
                <input type="text" onChange={e=>setName(e.target.value)} className="form-control dont-close-cart" name={'project-name'} value={name}/>
            </div>
            <button className={"link mx-auto saveCart dont-close-cart"} type={'submit'} onClick={e=>{saveProjectName()}}>Save</button>
            <button className={"link mx-auto saveCart close-modal dont-close-cart"} onClick={e=>closeModal(false)}>Cancel</button>
        </div>
    </Modal>
};

export default withRouter(SaveProjectModal)
