import React, { PureComponent } from 'react';
import loadable from '@loadable/component'
import {  Modal, ModalBody, ModalHeader } from 'reactstrap';
const Form = loadable(() => import('../Form'));


class ModalCallbackInner extends PureComponent {




    render() {
        return <React.Fragment>
            {this.props.state.modal &&
            <Modal isOpen={this.props.state.modal} toggle={this.props.toggle} className="modal-dialog">
                <ModalHeader toggle={this.toggle}>NEED ANY HELP?</ModalHeader>
                <ModalBody>
                    <Form isModal={true} afterSubmit={this.props.toggleSuccess} toggleForm={this.props.toggle}/>
                </ModalBody>
            </Modal>
            }
            {this.props.state.success &&

            <Modal isOpen={this.props.state.success} toggle={e=>this.props.toggleSuccess(false)} className="modal-dialog modal-success">
                <ModalHeader toggle={e=>this.props.toggleSuccess(false)}>Success</ModalHeader>
                <ModalBody>{this.props.state.success}</ModalBody>
            </Modal>
            }
        </React.Fragment>
    }
}

export default ModalCallbackInner;
