import React, { Component } from 'react';
import Modal from "react-responsive-modal";
import WebpImage from "./parts/WebpImage";

class ModalSamples extends Component {

    state = {
        isOpen: false,
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);

        this.hasScrolled = false;
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (!localStorage.samplesModal && !this.hasScrolled) {
            if (window.scrollY > 1000) {
                this.hasScrolled = true;
                this.checkAndOpenModal();
            }
        }
    };

    checkAndOpenModal() {
        this.setState({ isOpen: true });
        this.saveToStorage();
    }

    saveToStorage() {
        let now = Math.round(new Date().getTime() / 1000);
        let time = 30 * 24 * 60 * 60; // 1 month
        const item = {
            value: true,
            expire: now + time,
        };
        localStorage.setItem('samplesModal', JSON.stringify(item));
    }

    modalClose() {
        this.setState({ isOpen: false });
    }

    render() {
        return this.state.isOpen ? (
            <Modal
                open={this.state.isOpen}
                blockScroll={false}
                onClose={this.modalClose.bind(this)}
                classNames={{
                    modal: 'samples-modal',
                    closeButton: 'samples-modal-close-btn',
                    closeIcon: 'samples-modal-close-icon',
                }}
            >
                <div className="samples-modal-body">
                    <div className={'samples-modal-left'}>
                        <div className={'samples-modal-img-wrapper'}>
                            <WebpImage src="/images/phone-instagram-popup.jpg" alt="" />
                        </div>
                    </div>
                    <div className={'samples-modal-right'}>
                        <div className={'samples-modal-buttons'}>
                            <a href='https://www.instagram.com/cut2size.ca/' target={'_blank'}>
                                <WebpImage src="/images/btn-instagram-popup.jpg" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        ) : '';
    }
}

export default ModalSamples;
