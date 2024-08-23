import React, { Component } from 'react';
import {
    convertDimensionToFront,
    groupByLimit
} from "../../../../functions/main";
import {formatName, formatPrice} from "../../../../functions/frontend";
import WebpImage from "../parts/WebpImage";
import {UncontrolledTooltip} from "reactstrap";


class KitItemMobile extends Component {



    render() {
        let product = {...this.props.product};
        let order = {...this.props.order};
        let fields = (product.order_kit.order_kit_fields && product.order_kit.order_kit_fields.length>0) ?  product.order_kit.order_kit_fields : false;
        fields = groupByLimit(fields,4);
        return (
            <div className="product-item">
                <div className={'left'}>
                    <div className="kit-information">
                        <p className="product-title"><span>{product.order_kit.name}</span></p>
                    </div>

                    {!!this.props.hidePrice &&
                    <div className="product-price">
                        <p><span className="price">
                            <b className="number">{formatPrice(product.price,true,true,false)}/pc</b>
                        </span>
                        </p>
                    </div>
                    }
                    <div className="product-image"><span><img id={'orderItemImage-'+product.kit_id} src={product.order_kit.image} alt={product.order_kit.image}/></span></div>
                </div>
                <div className={'right'}>
                    {(order.status === 'saved_cart' || (this.props.admin &&  order.status!=='canceled')) &&
                    <div className="product-btn-block">
                        {this.props.deleteProduct &&
                        <React.Fragment>
                            <button
                                id={'delete-product-' + product.kit_id}
                                onClick={(e)=>this.props.deleteProduct(e,order,product)}
                                className="btn btn-danger btn-delete">
                                <WebpImage src={'/images/delete.svg'}/>
                            </button>
                            <UncontrolledTooltip placement="top" autohide={true} target={'delete-product-' + product.kit_id}>Remove Item</UncontrolledTooltip>
                        </React.Fragment>

                        }
                        {(typeof this.props.editKit!=="undefined") &&
                        <React.Fragment>
                            <button
                                id={'edit-product-' + product.kit_id}
                                onClick={(e)=> this.props.editKit(e,order,product ) }
                                className="btn btn-outline-primary product-item-edit" >
                                <WebpImage src={'/images/edit.svg'}/>
                            </button>
                            <UncontrolledTooltip placement="top" autohide={true} target={'edit-product-' + product.kit_id}>Edit Item</UncontrolledTooltip>
                        </React.Fragment>

                        }
                    </div>
                    }
                    <div className={'bottom'}>
                        <div className="product-quantity">
                            <p className="quantity">
                                <span>Quantity: {product.quantity}</span>
                            </p>
                        </div>
                        {!!this.props.hidePrice &&
                        <div className="product-total-price">
                            <div className="price">
                                <span>{formatPrice(product.price*product.quantity,true,true)}</span>
                            </div>
                        </div>
                        }

                    </div>
                </div>
                <div className="kit-fields">
                        {(Object.keys(fields) && Object.keys(fields).length>0)?
                                Object.keys(fields).map((array,index)=>{
                                    return(<div key={index} className="row no-padding">{fields[array].map((fieldItem,fieldIndex)=> {

                                            let field = {...fieldItem};
                                            if(field.name.toLowerCase()==='cb'){
                                                field.name = 'Cabinet base'
                                            }

                                            let nameFormated  = formatName(field.name);

                                            if((field.name==='height'|| field.name==='width' || field.name==='depth') && field.value){
                                                field.value = convertDimensionToFront(field.value);
                                            }
                                            return (field.value  /*&& parseInt(field.value) !== 0*/) ? (<div key={fieldIndex} className="select-item col-12 text"><span className="properties">{nameFormated}:</span><span className="value">{(field.value===true||parseInt(field.value)===1) ? 'YES'
                                                :
                                                (parseInt(field.value)===0 ? 'NO':field.value)
                                                }</span></div>)
                                                : null
                                        }
                                    )}</div>);
                                })
                            :''}
                </div>
                { product.order_kit.system_files?
                    <div className="product-quantity ml-3 ">
                        {product.order_kit.system_files.map((file,Fileindex)=>
                            <a key={Fileindex}  className={'ordFile'} href={file.disk_name}>{file.file_name}</a>
                        )}
                    </div>
                    : ''}
            </div>
        )
    }
}


export default KitItemMobile;
