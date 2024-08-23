import React from "react";
import WebpImage from "./parts/WebpImage";
import {UncontrolledTooltip} from "reactstrap";
import AddFilesToOrder from "./parts/AddFilesToOrder";

const OrdersBtnBlock = (props) => {
    let order = props.order;
    let project = props.project;
    return (
        <React.Fragment>


            {order && order.partner_invoice ?
                <a
                    href={order.partner_invoice.disk_name}
                    id={'partner_invoice-' + order.id}
                    className="btn btn-primary"
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                >
                    <WebpImage src={'/images/pdf-icon.svg'} width={'20px'}/>
                    <UncontrolledTooltip placement="top" autohide={true} target={'partner_invoice-' + order.id}>Partner Invoice</UncontrolledTooltip>
                </a> : ''
            }

            {order && order.status === 'saved_cart' ?
                    <AddFilesToOrder order={order}/>
                : ''
            }
            {order && (order.status === 'saved_cart' || order.status === 'pending') && props.deleteOrder ?
                    <button
                        id={'delete-project-' + order.id}
                        className="btn btn-danger btn-delete deleteCartOrder"
                        onClick={e => props.deleteOrder(e, order)}>
                        <WebpImage src={'/images/delete.svg'}/>
                        <UncontrolledTooltip placement="top" autohide={true} target={'delete-project-' + order.id}>Remove Order</UncontrolledTooltip>
                    </button>
                : ''
            }
            {order && props.toggleModal ?
                    <button
                        id={'print-' + order.id}
                        className="btn btn-outline-primary"
                        onClick={e => props.toggleModal(order)}>
                        <WebpImage src={'/images/print.svg'}/>
                        <UncontrolledTooltip placement="top" autohide={true} target={'print-' + order.id}>Print</UncontrolledTooltip>
                    </button> : ''
            }
            {order && props.setShow ?
                <button
                    id={'view-hide-' + order.id}
                    className="btn btn-outline-primary"
                    onClick={e=> props.setShow()}
                    data-toggle="collapse"
                    data-target={'#collapse'+order.id}
                    aria-expanded={props.show}
                    aria-controls={'#collapse'+order.id} >
                    {!props.show ? 'View' : 'Hide'}
                    <UncontrolledTooltip placement="top" autohide={true} target={'view-hide-' + order.id}>{!props.show ? 'View' : 'Hide'} Order Details</UncontrolledTooltip>
                </button> : ''
            }
            {project && props.deleteProject &&
                <button
                    id={'delete-project-' + props.project.project_id}
                    className="btn btn-danger btn-delete deleteCartOrder"
                    onClick={(e) => props.deleteProject(e, project)}>
                    <WebpImage src={'/images/delete.svg'}/>
                    <UncontrolledTooltip placement="top" autohide={true} target={'delete-project-' + project.project_id}>Remove Project</UncontrolledTooltip>
                </button>
            }
            {project && props.editProject &&
                <button
                    id={'edit-product-' + props.project.project_id}
                    onClick={(e)=> props.editProject(e,project ) }
                    className="btn btn-outline-primary product-item-edit" >
                    <WebpImage src={'/images/edit.svg'}/>
                    <UncontrolledTooltip placement="top" autohide={true} target={'edit-product-' + project.project_id}>Edit Project</UncontrolledTooltip>
                </button>
            }
            {project && props.setShow ?
                <button
                    id={'view-hide-' + project.project_id}
                    className="btn btn-outline-primary"
                    onClick={e=> props.setShow(!props.show)}
                    data-toggle="collapse"
                    data-target={'#collapse'+project.project_id}
                    aria-expanded={props.show}
                    aria-controls={'#collapse'+project.project_id} >
                    {!props.show ? 'View' : 'Hide'}
                    <UncontrolledTooltip placement="top" autohide={true} target={'view-hide-' + project.project_id}>{!props.show ? 'View' : 'Hide'} Project Details</UncontrolledTooltip>
                </button> : ''
            }
        </React.Fragment>
    );
}

export default OrdersBtnBlock;
