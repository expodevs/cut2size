import React from "react";
import {formatName} from "../../../../functions/frontend";

const ProductProperties = (props) => {
    let product_properties = props.product_properties;
    let colWidth = props.colWidth;
    let minicart = props.minicart;

    return <div className={'row no-padding'}>
        <div className={'no-padding col-xl-'+colWidth+' col-lg-'+colWidth+' col-md-'+colWidth+' col-sm-'+colWidth+''}>
            {
                Object.keys(product_properties).map((name,index)=>{
                    let formattedName = formatName(name);
                    let value = product_properties[name];
                    return (
                        <div key={index} className={"select-item col-xl-"+colWidth+" col-lg-"+colWidth+" col-md-"+colWidth+" col-sm-"+colWidth+""}>
                            <span className="properties">{formattedName}:</span><span className="value">{(value===true) ? 'Yes' : value}</span>
                        </div>
                    );
                })
            }
        </div>
    </div>;

}

export default ProductProperties;