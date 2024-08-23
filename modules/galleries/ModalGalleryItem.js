import React, { PureComponent } from 'react';
import Modal from "react-responsive-modal";
import LazyLoadImage from "../parts/LazyLoadImage";
const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;




class ModalGalleryItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false
        };

        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }



    onOpenModal(e,props) {

        this.setState({ modalOpen: true });
    }

    onCloseModal() {
        this.setState({ modalOpen: false });
    }

    render() {

        const props = this.props.item;
        return (
            <li className="gallery-item">
                <button
                    onClick={e=>this.onOpenModal(e,props)}
                    aria-label="Button instagram image"
                >
                    <LazyLoadImage src={props.small ? props.small[0].disk_name: ''} alt="" />
                    <p className="price"><b className="number">{currencySymbol}{props.small ? props.small[0].file_name.split('.')[0]: ''}</b></p>
                </button>
                <span className="material-title" dangerouslySetInnerHTML={{__html:props.caption}}/>

                <Modal open={this.state.modalOpen} onClose={this.onCloseModal} className="modal-material-gallery">
                    <LazyLoadImage className="gal-image" src={props.main[0].disk_name} alt=""/>
                </Modal>
            </li>
        )
    }
}



export default ModalGalleryItem;
