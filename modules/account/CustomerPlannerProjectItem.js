import React, {useState} from "react";
import WebpImage from "../parts/WebpImage";
import Modal from "react-responsive-modal";

const CustomerPlannerProjectItem = ({project_item}) => {
    const [modalShow,setModalShow] = useState(false);

    return (
        <React.Fragment>
            <div className={'project-item'} onClick={e=>setModalShow(true)}>
                <WebpImage
                    src={project_item.url}
                />
            </div>
            <Modal open={modalShow} onClose={e=>setModalShow(false)} blockScroll={false} center
            >
                <div className="modal-body">
                    <div className={'project-image-full'}>
                        <WebpImage
                            src={project_item.url}
                        />
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
}

export default CustomerPlannerProjectItem;