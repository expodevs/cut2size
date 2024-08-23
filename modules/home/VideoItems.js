import React, {PureComponent} from "react";
import loadable from '@loadable/component'
import VideoItem from "./parts/VideoItem";
import {isMobile} from "../../../../functions/frontend";

const Modal = loadable(() => import('react-responsive-modal'));

const items = [
    {
        id: 1,
        icon: isMobile() ? '/images/parts.png' : '/images/panels.svg',
        title: 'How to order panels?',
        text: 'Cut2Size is a manufacturing company located in Calgary, Alberta, formed to answer the growing need for CNC cutting service',
        link: 'https://www.youtube.com/embed/MaAB8s1zvOk'
    },{
        id: 2,
        icon: isMobile() ? '/images/cabinet_doors.png' : '/images/door.svg',
        title: 'How to order cabinet doors?',
        text: 'Cut2Size is a manufacturing company located in Calgary, Alberta, formed to answer the growing need for CNC cutting service',
        link: 'https://www.youtube.com/embed/39sBKzQD-oY'
    },{
        id: 3,
        icon: isMobile() ? '/images/drawers1.png' : '/images/drawers.svg',
        title: 'How to order dovetail drawers?',
        text: 'Cut2Size is a manufacturing company located in Calgary, Alberta, formed to answer the growing need for CNC cutting service',
        link: 'https://www.youtube.com/embed/qkqjZXoprRg'
    },
];

class VideoItems extends PureComponent {

    state={
        modalOpen:false,
        link:false,
    };
    onCloseModal = () => {
        if(this.props.onCloseModal){
            this.props.onCloseModal();
        }
        this.setState({ modalOpen: false,link:false });
    };
    openModal=(e,link)=>{
        e.preventDefault();
        this.setState({ modalOpen: true ,link:link});

    };


    render() {
        return <div id="video-items">
            <div className="full-width-title text-align-center"><h2 className={"title"}>SIMPLE VIDEO INSTRUCTIONS</h2></div>
            {items.map((item, index) => {
                return <VideoItem
                    key={index}
                    item={item}
                    openModal={this.openModal.bind(this)}
                />
            })}

            {this.state.modalOpen&&
            <Modal open={this.state.modalOpen} onClose={this.onCloseModal} center
                   styles={{
                       modal: {
                           maxWidth: "100%"
                       }
                   }}
            >
                <iframe
                    src={this.state.link}
                    className={'youtube-iframe'}
                    width="768" height="500" frameBorder="0" allowFullScreen title="youtube frame"></iframe>
            </Modal>
            }

        </div>
    }
}

export default VideoItems;
