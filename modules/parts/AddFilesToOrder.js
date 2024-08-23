import WebpImage from "./WebpImage";
import { UncontrolledTooltip} from "reactstrap";
import React, {useState} from "react";
import Modal from "react-responsive-modal";
import FilesForm from "../../../../admin/views/Base/Files/FilesForm";
import {setNotification} from "../../../../actions/init";
import {store} from "../../../../store";
import {updateItem} from "../../../../actions/admin";


const Url = process.env.REACT_APP_SERVER_URL;
const ApiServer = process.env.REACT_APP_API_SERVER_URL;

const AddFilesToOrder=({order})=>{

    const [modalShow,setModalShow] = useState(false);
    const [files,setFiles] = useState(order.client_files||[]);


    const afterDelete=(file)=>{

        let newFiles = [...files].filter((item)=>{
            return item.id!==file.id
        });

        store.dispatch(setNotification('Deleted successfully!', 'success', 4000));

        setFiles(newFiles);

    };
    const saveFiles=(e)=>{
        e.preventDefault();
        store.dispatch(updateItem(e))
            .then(result=>{
                if(result && result.data && result.data[0] && result.data[0].id){
                    store.dispatch(setNotification('Saved successfully!', 'success', 4000));
                    let newFiles = [...files];
                    newFiles = newFiles.concat(result.data);
                    setFiles(newFiles);
                }

            })
    };

    return <>
            <button
                        id={'add-files-' + order.id}
                        className="btn btn-outline-primary"
                        onClick={e=>{
                            e.preventDefault();
                            setModalShow(true)}}
                    >
                    <WebpImage src={'/images/icon_upload.png'} width={20} height={20}/>
                    <UncontrolledTooltip placement="top" autohide={true} target={'add-files-' + order.id}>Add Files</UncontrolledTooltip>
            </button>
                <Modal open={modalShow}
                       onClose={e=>setModalShow(false)}
                       blockScroll={false} center
                       styles={{
                           modal: {
                               maxWidth: "600px",
                               textAlign: 'center',
                           }
                       }}

                >
                    <form  className={'client-files-form'} onSubmit={saveFiles} encType="multipart/form-data" method="PUT" action={`${Url}${ApiServer}/orders/add-files/${order.id}`}>
                        <div className="container">
                            <FilesForm
                                name={`system_files`}
                                multiple={true}
                                value={files}
                                showImage={false}
                                afterDelete={afterDelete}
                                deleteUrl={'/files/customer/'}
                            />
                            <button type="submit" className={'btn btn-success'}>Save</button>
                        </div>

                    </form>


                </Modal>
            </>
}
export default AddFilesToOrder
