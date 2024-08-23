import React, {Component} from 'react';
import Modal from "react-responsive-modal";

class ModalSaveChanges extends Component {

    state = {
        isOpen: false,
    }

    componentDidMount() {
        let self = this;
        let intViewportWidth = window.innerWidth;
        let intViewportHeight = window.innerHeight;
        document.addEventListener("mouseleave", function (e) {
            if (self.props.hideForm && (e.clientY <= 0 || e.clientY > intViewportHeight || e.clientX <= 0 || e.clientX > intViewportWidth)) {
                self.setState({isOpen: true});
            }
        });
    }

    modalClose() {
        this.setState({isOpen: false});
    }

    saveChanges() {
        const form = document.getElementById('account-settings-form');
        if (form) {
            if (typeof form.requestSubmit === 'function') {
                form.requestSubmit();
            } else {
                form.dispatchEvent(new Event('submit', {cancelable: true}));
            }
        }
    }

    render() {
        return (
            this.props.hideForm ?
                <Modal open={this.state.isOpen} onClose={this.modalClose.bind(this)} blockScroll={false} center
                       styles={{
                           modal: {
                               maxWidth: "350px",
                               textAlign: 'center',
                           }
                       }}
                       classNames={{
                           modal: 'orders-modal',
                       }}
                >
                    <div className="modal-body">
                        <div className={'check-email-title'}>Save Changes?</div>
                        <p className={'check-email-text'}>Account information was changed. <br />Do you want to save it?</p>
                        <button className="btn btn-primary" onClick={e=>this.saveChanges()}>Save Changes</button>
                        <button className="btn btn-outline-danger" onClick={e=>{this.props.changeHideForm();this.modalClose.bind(this)}}>Discard Changes</button>
                    </div>
                </Modal> : ''
        )
    }
}

export default ModalSaveChanges;
