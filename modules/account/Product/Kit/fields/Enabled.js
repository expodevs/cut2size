import React, {useState} from "react";
import {formatName} from "../../../../../../../functions/frontend";
import SelectMap from "../../../../../../../admin/views/Base/Forms/SelectMap";
import LoadingIndicator from "../../../../parts/LoadingIndicator";

const Enabled=({field,setProduct})=>{
    const [loading,setLoading] = useState(false);
    const [value,setValue] = useState(field.value);


    if(field.name.toLowerCase()==='cb'){
        field.name = 'Cabinet base'
    }

    let nameFormated  = formatName(field.name);


    const onChange=async (value)=>{
        setLoading(true);
        setValue(value);
        await setProduct({
            oldProduct:field,
            newProduct:{...field,
                ...{
                    value:value,
                }
            }
        });
        setLoading(false);
    };


    if(loading){
        return <div className="select-item col-12 text">
            <LoadingIndicator/>
        </div>
    }

    return <div  className="select-item col-12 text" >
        <span className="properties">{nameFormated}:</span>
        <span className="value">
                   <SelectMap
                       onChange={e=>onChange(e.target.value)}
                       className={'kit-option-select'}
                       data={[
                           {id:'0', value:"NO"},
                           {id:'1', value:"YES"},
                       ]}
                       value={value}
                   />
                </span>
    </div>
};
export default Enabled;
