import React, { Component } from 'react';
import {formatPrice} from "../../../../functions/frontend";
import WebpImage from "../parts/WebpImage";
import PartnerSelect from "../../../../admin/views/Orders/partnerSelect";
import Quantity from "./Product/Quantity";
import {Button, Col, FormGroup, Label, Row, UncontrolledTooltip} from "reactstrap";
import ProductOptions from "./ProductOptions";
import Modal from "react-responsive-modal";
import ProductSeries from "../../../../admin/views/Orders/Product/ProductSeries";
import EditableName from "./Product/EditableName";
import PriceItem from "./Product/PriceItem";
import Dropzone from "../../../../admin/views/Base/Files/Dropzone";
import {setNotification} from "../../../../actions/init";
import {deleteItem} from "../../../../actions/admin";
import axios from "axios";

const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;

class ProductItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openEditProductModal: false,
            openEditProductImageModal: false,
            product: this.props.product,
        };
    }

    toggleEditProductModalState = () => {
        this.setState({ openEditProductModal: !this.state.openEditProductModal });
    }

    toggleEditProductImageModalState = () => {
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
        console.clear();
        console.log('this', this.state);
        console.log('props', this.props);

        let product = this.state.product;
        let image = product.custom_image ? product.custom_image : false;

        if (image) {
            setNotification('Image successfully deleted', 'success');
            axios.delete(process.env.REACT_APP_API_SERVER_URL + '/files/' + image.id);
            window.location.reload();
        }
    }

    render() {
        let product = this.state.product;
        let image = product.custom_image
            ? product.custom_image.disk_name
            :((product.product.system_files && product.product.system_files.length>0) ? product.product.system_files[0].disk_name: '');
        let order = this.props.order;
				let product_options = product.order_products_addons;
        return (
            <div className="product-item">
                <div className="product-image">
                    <span><WebpImage id={'orderItemImage-'+product.product_id} src={image} alt={image}/></span>
                    <span>
                        <i className="icon-pencil icons ml-1 cursor-pointer" onClick={this.toggleEditProductImageModalState}/>
                        {product.custom_image && <i className="icon-trash icons ml-1 cursor-pointer" onClick={this.deleteImage.bind(this)}/>}
                    </span>

                </div>
                <div className={'kit-fields'}>
                    <EditableName name={product.name_custom ?? product.product.name} product={product} orderId={order.id}/>
                    <div className="row no-padding">
                        {(product_options) &&
                            <ProductOptions
                                product_options={product_options}
                            />
                        }
                        <div className="select-item col-12 text"><span
                            className="properties">Product Number:</span><span className="value">{product.product.code}</span>
                        </div>
                    </div>
                </div>
                <div className="product-price">
                    {!this.props.hidePrice &&
                        <PriceItem
                            product={product}
                            editable={this.props.admin && order.status === 'saved_cart'}
                            order={order}
                            getInfo={this.props.getInfo}
                        />
                    }
                </div>
                <Quantity product={product} order={this.props.order} productsEdit={this.props.productsEdit}/>
                {!!this.props.admin && <div className="product-quantity ml-3 "></div>}
                {!this.props.hidePrice&&
                <div className="product-total-price">
                    <div className="price">Total&nbsp;
                        <span>{formatPrice((product.price_new ?product.price_new: product.price)*product.quantity,true,true)}</span>
                    </div>
                </div>
                }
                <div className="product-btn-block">
                    {(order.status === 'saved_cart' || (this.props.admin && order.status !== 'canceled')) && this.props.deleteProduct &&
                        <>
                            <React.Fragment>
                                <button
                                    id={'delete-product-' + product.product_id}
                                    onClick={(e) => this.props.deleteProduct(e, order, product)}
                                    className="btn btn-danger btn-delete">
                                    <WebpImage src={'/images/delete.svg'}/>
                                </button>
                                <UncontrolledTooltip placement="top" autohide={true} target={'delete-product-' + product.product_id}>Remove Item</UncontrolledTooltip>
                            </React.Fragment>
                            <React.Fragment>
                                <button
                                    id={'test-' + product.product_id}
                                    className="btn btn-outline-primary"
                                    onClick={this.toggleEditProductModalState.bind(this)}
                                    type="button"
                                >
                                    <WebpImage src={'/images/edit.svg'}/>
                                </button>
                            </React.Fragment>
                        </>
                    }
                </div>
                {!!this.props.admin &&
                <div className="product-quantity ml-3 ">
                    <PartnerSelect product={product} label={true} />
                </div>
                }
                <Modal open={this.state.openEditProductModal} center
                       onClose={this.toggleEditProductModalState}
                       styles={{
                           modal: {
                               maxWidth: "1200px"
                           }
                       }}
                >
                    <div className="container">
                        <div className="row mt-4">
                            <div className="col-md-12">
                                <ProductSeries product={product} order_id={order.id}/>
                            </div>
                        </div>
                    </div>

                </Modal>
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
            </div>
        )
    }
}


export default ProductItem;
