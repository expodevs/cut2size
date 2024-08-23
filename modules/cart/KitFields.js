import {formatName} from "../../../../functions/frontend";
import React from "react";

const KitFields = (props) => {
    let fields = props.fields;
    let colWidth = props.colWidth;
    let minicart = props.minicart;

    return <div className="row no-padding">

        {(fields.height||fields.width||fields.depth) &&
        <div className={'no-padding col-xl-'+colWidth+' col-lg-'+colWidth+' col-md-'+colWidth+' col-sm-'+colWidth+''}>
            {
                Object.keys(fields).map((name,index)=>{
                    let value  =fields[name];

                    let colWidth = 12;

                    let nameFormated  = formatName(name);
                    if(name!=='height'  && name!=='width' && name!=='depth')
                        return null;

                    return (
                        (value && parseInt(value)!== 0) &&
                        (value && <div key={index} className={"select-item col-xl-"+colWidth+" col-lg-"+colWidth+" col-md-"+colWidth+" col-sm-"+colWidth+""}><span className="properties">{nameFormated}:</span><span className="value">{(value===true) ? 'Yes' : value}</span></div>)
                    )
                })
            }
        </div>
        }

        {(Object.keys(fields) && Object.keys(fields).length>0)&&

        Object.keys(fields).map((name,index)=>{
            let value  =fields[name];

            let colWidth = minicart ? 12 :  6;

            let nameFormated  = formatName(name);
            if(minicart || name==='height'  || name==='width' || name==='depth' || name==='in')
                return null;

            value = (value==1) ? 'Yes' : (value==0 ? 'No' : value);

            return (name!=='dimension'
                && name!=='quantity'
                && name.toLowerCase()!=='cb'
                && name.toLowerCase()!=='cc'
                && name.toLowerCase()!=='cabinet construction'
            ) && (
                (value && value!== 0) &&
                (value!== null && typeof value == 'object')?
                    Object.keys(value).map((nameVal,indexVal)=>{
                        let valueObj  =value[nameVal];
                        let nameFormated  = formatName(nameVal);
                        return valueObj &&  (<div key={indexVal} className={"select-item col-xl-"+colWidth+" col-lg-"+colWidth+" col-md-"+colWidth+" col-sm-"+colWidth+""}><span className="properties">{nameFormated}:</span><span className="value">{valueObj.name ? valueObj.name : valueObj}</span></div>)
                    })
                    :
                    (value && <div key={index} className={"select-item col-xl-"+colWidth+" col-lg-"+colWidth+" col-md-"+colWidth+" col-sm-"+colWidth+""}><span className="properties">{nameFormated}:</span><span className="value">{(value===true) ? 'Yes' : value}</span></div>)
            )
        })
        }
    </div>
}

export default KitFields;