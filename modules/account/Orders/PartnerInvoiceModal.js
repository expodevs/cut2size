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
import { Col, Input, Row} from "reactstrap";

const PartnerInvoiceModal=({modalItem,partnerModal,closeModal,getOrders})=>{



    const [products,setProducts] = useState((modalItem.order_products && modalItem.order_products.length) ?
        [...modalItem.order_products]
            .map(item=>{
            item.id = uniqId();
            item.price = 0;
            return item;
        })
        : []);


    const [services,setServices] = useState([]);


    const [total,setTotal] = useState(0);
    const [invoiceNumber,setInvoiceNumber] = useState('');
    const [gst,setGst] = useState('');


    useEffect(()=>{
        if(modalItem && modalItem.order_products&& modalItem.order_products.length){
            setProducts(    [...modalItem.order_products].map(item=>{
                item.price = 0;
                return item;
            }))
        }

    },[modalItem.order_products]);


    useEffect(()=>{
        addTotal()
    },[products,services]);

    const addTotal=()=>{
        let total = 0;


        if(products && products.length){

            for(let item of products){
                total+=parseInt(item.quantity)*parseFloat(item.price)
            }

        }
        if(services && services.length){

            for(let service of services){
                total+=parseFloat(service.amount)
            }

        }

        setTotal(total);

    };

    const setProductPrice=(product,price)=>{

        let newProducts = [...products];

        newProducts = newProducts.map(item=>{

            let newProduct = {...item};

            if(item.id===product.id){
                newProduct.price = parseFloat(price);
            }
            return newProduct;
        });
        setProducts(newProducts);


    };



    const addServicePrice=(services)=>{
        setServices(services)
    };



    const generateInvoice=(e)=>{
        e.preventDefault();

        let newOrder = {...modalItem};
        newOrder.order_products = products;
        newOrder.subtotal_price = total;
        newOrder.total_price = total;
        newOrder.order_services = services;
        newOrder.invoice_number = invoiceNumber;
        newOrder.gst = gst;
        const url = process.env.REACT_APP_API_SERVER_URL+'/orders/customer/generate-partner-invoice'
         store.dispatch(formSubmit(e,'PUT', {
            order:newOrder
        },url)).then(result=>{
             store.dispatch(setNotification('Invoice generated!', 'success', 5000));
             closeModal()
             getOrders();
         }).catch(err=>{
             store.dispatch(setNotification(err.message, 'error', 5000));
         })

    };



    if(!modalItem || !modalItem.order_products)
        return null;






    return <Modal open={partnerModal} onClose={()=>{
        closeModal()
        }} blockScroll={false} center
               styles={{
                   modal: {
                       textAlign: 'center',
                       maxWidth:'100%'
                   }
               }}
               classNames={{
                   modal: 'orders-modal partner-modal',
               }}
        >
            <div className="modal-body account-content">
                <form  className={'orders-history'} onSubmit={(e)=>generateInvoice(e)}>

                    <div className="row mb-5">
                        <div className="col-md-4">
                            <Input
                                onChange={e=>{
                                    setInvoiceNumber(e.target.value)
                                }}
                                type={'text'}
                                name={`invoice_number`}
                                placeholder="Invoice number"
                                defaultValue={invoiceNumber}
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                onChange={e=>{
                                    setGst(e.target.value)
                                }}
                                type={'text'}
                                name={`gst`}
                                placeholder="GST"
                                defaultValue={gst}
                            />
                        </div>
                    </div>
                    <div className={'order-products'}>
                        {products.map((product,index)=>{
                                const order = modalItem;
                                return (
                                    <div key={index} className={'row'}>
                                        <div className="col-lg-10">
                                            {(!!product.product) &&<ProductItem hidePrice={true} product={product} order={order} />}
                                            {(!!product.order_sample) &&<OrderSample hidePrice={true}  product={product} order={order}/>}
                                            {(!!product.order_kit) &&<KitItem
                                                hidePrice={true}
                                                product={product}
                                                order={order}

                                            />}
                                        </div>
                                        <div className="col-lg-2 price-col">
                                            <div className="form-group">
                                                <label htmlFor={`product-price-${index}`}>Price/pc</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                                    <span className="input-group-text"
                                                                          id="inputGroupPrepend">{getCurrency()}</span>
                                                    </div>
                                                    <input onChange={(e)=>setProductPrice(product,e.target.value)} min="1" step="any" required={true}   aria-describedby="inputGroupPrepend" id={`product-price-${index}`} className={'form-control'} type="number" name={'price'}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                        <PartnerServices addServicePrice={addServicePrice}/>
                    <div className="row">
                        <div className="col-lg-12">
                            {!!total &&
                            <p className="alert alert-warning">
                                The total amount of the Invoice is {formatPrice(total,true,true,true,false)} Is everything correct?
                            </p>
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <button className={'btn btn-primary'} type="submit">Generate</button>
                    </div>
                </form>
            </div>
        </Modal>
};



const PartnerServices=({addServicePrice})=>{

    const [items,setItems] = useState([]);


    useEffect(()=>{
        addServicePrice(items);
    },[items]);


    const addService=()=>{

        let newItems = [...items];
        newItems.push({
            id:uniqId()
        });
        setItems(newItems)

    };
    const deleteService=(id)=>{

        let newItems = [...items];
        newItems = newItems.filter(item=>item.id!==id);
        setItems(newItems);

    };

    const addPrice=(item)=>{
        let newItems = [...items].map(k=>{
            if(k.id===item.id){
                k=item;
            }
            return k;
        });
        setItems(newItems);
    };


    return <Row className="mt-5 mb-3">
            <div className="col-lg-12"><h3 className="title">Services</h3></div>
            <div className="col-lg-12 mt-2 mb-2">
                <button className="btn btn-dark" onClick={(e)=>{e.preventDefault();addService()}}>Add service</button>
            </div>
                <div className="col-lg-12">
                    {
                        !!items && items.map((item,index)=>
                            <Row className="mb-5" key={item.id} >
                            <PartnerServiceItem item={item} addPrice={addPrice} index={index}/>
                                <div className="col-md-3">
                                    <button className="btn btn-danger mt-0" onClick={(e)=>{e.preventDefault();deleteService(item.id)}}>Delete</button>
                                </div>
                            </Row>
                        )
                    }
                </div>
        </Row>

};

const PartnerServiceItem=({item,addPrice,index})=>{


    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    return <>
                <Col xs="12" md="5">
                    <Input required={true} onChange={e=>{
                        setName(e.target.value)
                        addPrice({...item,...{name:e.target.value}})
                    }} type={'text'}  name={`services[${index}][name]`}  placeholder="Name"  defaultValue={name}/>
                </Col>
                <Col xs="12" md="4">
                    <Input required={true} onChange={e=>{
                        setPrice(e.target.value);
                        addPrice({...item,...{amount:e.target.value}})
                    }} type={'text'}  name={`services[${index}][amount]`}  placeholder="Price"  defaultValue={price}/>
                </Col>
            </>
};



export default withRouter(PartnerInvoiceModal)
