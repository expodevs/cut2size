import React, {Component, useState} from 'react';
import {
    groupByLimit
} from "../../../../functions/main";
import {formatName, formatPrice} from "../../../../functions/frontend";
import WebpImage from "../parts/WebpImage";
import {Col, Row, UncontrolledTooltip} from "reactstrap";
import PartnerSelect from "../../../../admin/views/Orders/partnerSelect";
import Field from "./Product/Kit/Field";
import Quantity from "./Product/Quantity";
import input from "postcss/lib/input";
import {store} from "../../../../store";
import {sendPost} from "../../../../actions/admin";
import {setNotification} from "../../../../actions/init";
import EditableName from "./Product/EditableName";
import PriceItem from "./Product/PriceItem";
import axios from "axios";
import Dropzone from "../../../../admin/views/Base/Files/Dropzone";
import Modal from "react-responsive-modal";

class KitItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openEditProductImageModal: false,
            product: this.props.product,
            system_files: false,
        };
    }

    async componentDidMount() {
        let apiUrl = process.env.REACT_APP_API_SERVER_URL + '/order-kit/' + this.state.product.order_kit.id + '/files';

        const requestOptions = {
            method: 'get',
            headers: {
                'enctype': 'multipart/form-data',
            },
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                const data = await response.json();
                console.log('files', data);
                this.setState({ system_files: data });
            } else {
                console.error('Ошибка при запросе данных');
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    }

    toggleEditProductImageModalState = () => {
        console.log('rerer')
        this.setState({ openEditProductImageModal: !this.state.openEditProductImageModal });
    }

    changeImage = async (e, id) => {

        this.deleteImage();

        if (e.target.files) {
            let formData = new FormData();

            for (let file of e.target.files) {
                formData.append(file.name, file);
            }
            formData.append('type', 'main');

            let apiUrl = process.env.REACT_APP_API_SERVER_URL + '/orders/change-order-image/' + id;

            const requestOptions = {
                method: 'PUT',
                body: formData,
                headers: {
                    'enctype': 'multipart/form-data',
                },
            };

            await fetch(apiUrl, requestOptions);
        }
        this.toggleEditProductImageModalState();
        window.location.reload();
    }

    deleteImage() {

        let product = this.state.product;

        console.log('product', product);

        let image = product.custom_image ? product.custom_image : false;

        if (image) {
            setNotification('Image successfully deleted', 'success');
            axios.delete(process.env.REACT_APP_API_SERVER_URL + '/files/' + image.id);
            window.location.reload();
        }
    }

    render() {
        let product = {...this.props.product};
        let order = {...this.props.order};
        let fields = (product.order_kit.order_kit_fields && product.order_kit.order_kit_fields.length>0) ?  product.order_kit.order_kit_fields : false;
        fields = groupByLimit(fields,4);

        let image = product.custom_image ? product.custom_image.disk_name : product.order_kit.image;

        return (<>
                <div className="product-item">
                    <div className="product-image">
                        <span><img id={'orderItemImage-'+product.kit_id} src={image} alt={product.order_kit.image}/></span>
                        <span>
                        <i className="icon-pencil icons ml-1 cursor-pointer" onClick={this.toggleEditProductImageModalState}/>
                            {product.custom_image && <i className="icon-trash icons ml-1 cursor-pointer" onClick={this.deleteImage.bind(this)}/>}
                    </span>
                    </div>

                    <div className="kit-fields">
                        <EditableName name={product.name_custom ?? product.order_kit.name} product={product} orderId={order.id}/>
                        {(Object.keys(fields) && Object.keys(fields).length>0)?
                            Object.keys(fields).map((array,index)=>{
                                return(<Field
                                    key={index}
                                    admin={this.props.admin}
                                    productsEdit={this.props.productsEdit}
                                    field={fields[array]}
                                    calcCategoryId={this.props.product.order_kit.calcCategoryId}
                                    order={this.props.order}
                                />);
                            })
                            :''}
                    </div>
                    {!this.props.hidePrice&&
                        <PriceItem
                            product={product}
                            editable={this.props.admin && order.status === 'saved_cart'}
                            order={order}
                            getInfo={this.props.getInfo}
                        />
                    }
                    <Quantity product={product}  order={order} productsEdit={this.props.productsEdit}/>
                    { this.state.system_files?
                        <div className="product-quantity ml-3 ">
                            {this.state.system_files.map((file,Fileindex)=>
                                <a key={Fileindex}  className={'ordFile'} href={file.disk_name}>{file.file_name}</a>
                            )}
                        </div>
                        : ''}

                    {!this.props.hidePrice&&
                        <div className="product-total-price">
                            <div className="price">Total&nbsp;
                                <span>{formatPrice(product.price*product.quantity,true,true)}</span>
                            </div>

                        </div>
                    }
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
                    {!!this.props.admin &&
                        <div className="partner-container ">
                            <PartnerSelect product={product} label={true} />
                        </div>
                    }
                </div>
                <Modal open={this.state.openEditProductImageModal} center
                       onClose={this.toggleEditProductImageModalState}
                       styles={{
                           modal: {
                               maxWidth: "1200px"
                           }
                       }}
                >
                    <div className="container">
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <Row>
                                    <Col xs={12}>
                                        <Dropzone
                                            className={'mt-4'}
                                            type={'file'}
                                            id={'custom-image'}
                                            name={'custom-image'}
                                            placeholder="Text"
                                            onChangeHandler={e => {this.changeImage(e, product.id)}}
                                            multiple={true}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>

                </Modal>
        </>
        )
    }
}

export default KitItem;
