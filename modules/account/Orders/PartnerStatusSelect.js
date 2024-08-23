import React, {useEffect} from "react";
import SelectMap from "../../../../../admin/views/Base/Forms/SelectMap";
import {store} from "../../../../../store";
import {sendPost} from "../../../../../actions/admin";
import {setNotification} from "../../../../../actions/init";
// import {sendPost} from "../../../actions/admin";
// import {store} from "../../../store";

const ApiServer = process.env.REACT_APP_API_SERVER_URL;

const PartnerStatusSelect=({order})=>{





    const setStatus=(value)=>{
        let url = `${ApiServer}/orders/customer/set-partner-status/${order.id}`;

        store.dispatch(sendPost(url,{
            partner_status:value
        })).then(res=>{
            if(res && res.data && res.data.success)
                store.dispatch(setNotification('Status changed!', 'success', 5000));

        })
    };


    return <div>
        <SelectMap className={'w-auto'} value={order ? order.partner_status : false} data={[
            {id:'pending',value:'pending', name:'pending'},
            {id:'in_progress',value:'in_progress', name:'in_progress'},
            {id:'shipped',value:'shipped', name:'shipped'},
        ]} name={`partner_status`} onChange={(e)=>setStatus(e.target.value)}/>
    </div>


};


export default PartnerStatusSelect;
