import {formatName} from "../../../../../../functions/frontend";
import {convertDimensionToFront} from "../../../../../../functions/main";
import React from "react";
import Material from "./fields/Material";
import {store} from "../../../../../../store";
import {sendPost} from "../../../../../../actions/admin";
import {setNotification} from "../../../../../../actions/init";
import Enabled from "./fields/Enabled";

const url =process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL;


const FieldItemEdit=({field,calcCategoryId,order})=>{



    if(field.name.toLowerCase()==='cb'){
        field.name = 'Cabinet base'
    }

    let nameFormated  = formatName(field.name);

    if((field.name==='height'|| field.name==='width' || field.name==='depth') && field.value){
        field.value = convertDimensionToFront(field.value);
    }

    const setProduct=async (data)=>{
        let result = await store.dispatch(sendPost(`${url}/orders/change-kit-field/${order.id}`,
            data,'PUT'));

        if(result && result.data && result.data.success){
            store.dispatch(setNotification('Saved!','success'))
        }
        return result;
    };


    switch (true) {
        case field.type==='product':
            return  <Material
                        field={field}
                        calcCategoryId={calcCategoryId}
                        setProduct={setProduct}
                    />;


        case field.type===null && (field.value===true||parseInt(field.value)===1||parseInt(field.value)===0):
            return <Enabled
                        field={field}
                        setProduct={setProduct}
            />;
        default:
            return <div  className="select-item col-12 text" >
                <span className="properties">{nameFormated}:</span>
                <span className="value">
                    {
                        (field.value===true||parseInt(field.value)===1)
                            ?
                            'YES'
                            :
                            (parseInt(field.value)===0 ? 'NO':field.value)
                    }
                </span>
            </div>
    }





}
export default FieldItemEdit;
