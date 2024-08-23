import React, {Component} from 'react';
import Modal from "react-responsive-modal";
import LazyLoadImage from "../parts/LazyLoadImage";

class InstagramModalGalleryItem extends Component {
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
        const item = this.props.item;

        return (
            <li className="gallery-item">
                <button
                    onClick={e=>this.onOpenModal(e,item)}
                aria-label="Button instagram image">
                    <LazyLoadImage src={item.media_url} alt="Instagram image" width="325" height="182"/>
                </button>
                <Modal open={this.state.modalOpen} onClose={this.onCloseModal} className="modal-material-gallery">
                    <LazyLoadImage className="gal-image" src={item.media_url} alt=""/>
                    <div className="text-instagram-wrap">
                        {item.caption}
                    </div>
                    <div className="btn-to-instagram-wrap">
                        <a href={item.permalink} className={'btn-to-instagram'}>Go to Instagram</a>
                    </div>
                </Modal>
            </li>
        )
    }
}



export default InstagramModalGalleryItem;
