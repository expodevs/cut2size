import WebpImage from "../parts/WebpImage";
import React, {memo} from "react";

const ProductImageMain=memo(({file, setOpenModal})=>{

    return <div className="main-item" data-hash={file.file_name}>
        <a href={file.disk_name} title="image title" rel="product-gallery" onClick={e=>{e.preventDefault();setOpenModal(true)}}>
            <WebpImage className="gallery-image" id={'gallery-image'} src={file.disk_name} alt="" />
        </a>
    </div>
});
export default ProductImageMain;
