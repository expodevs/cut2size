import React, {memo, useEffect, useState} from 'react';
import ProductImageMain from "./ProductImageMain";
import ProductImageSlider from "./ProductImageSlider";
import WebpImage from "../parts/WebpImage";
import ReactResponsiveModal from "react-responsive-modal";
import {getFullImageName} from "../../../../functions/frontend";

const ProductImage = memo(({system_files, hover=true, fullImage=true}) => {
    const [activeImage, setActiveImage] =  useState((system_files && system_files[0]) ?{...system_files[0]}: null);
    const [toggledImage, setToggledImage] = useState((system_files && system_files[0]) ? {...system_files[0]} : null);
    const [openModal,setOpenModal] = useState(false);
    const [imageClass, setClassImage] = useState('');

    const toggle = (image) => {
        setToggledImage({...image});
        setActiveImage({...image});
    };

    const hoverImage=(image)=>{
        if(!hover)
            return;

        if(image){
            setClassImage('active');
            setTimeout(function () {
                setActiveImage({...image})
            }, 200);

            setTimeout(function () {
                setClassImage('');
            }, 400);
        }else{
            setActiveImage({...toggledImage})
        }
    };

    useEffect(()=>{
        if(system_files && system_files[0]){
            setActiveImage({...system_files[0]});
        }
    },[system_files]);


    return (
        <div id="product-page-gallery" className="product-gallery">
            {system_files &&system_files.length>0 ?
                <div id="mainImage" className={'main-images owl-carousel ' + imageClass} >
                    <div className={'lens-icon'}  onClick={() => {setOpenModal(true)}}/>
                    <ProductImageMain file={activeImage}  setOpenModal={setOpenModal} />
                    <ReactResponsiveModal open={openModal} onClose={() => setOpenModal(false)} center
                                          styles={{
                                              modal: {
                                                  maxWidth: "1200px"
                                              },
                                              "modal-body": {
                                                  marginTop: "10%"
                                              }
                                          }}
                    >
                        <div className="modal-body">
                            {/*<h2 className={''}>{product.name}</h2>*/}
                            <div className="sample-full-image">
                                <WebpImage src={fullImage ? getFullImageName(activeImage.disk_name) :(activeImage.disk_name || '/images/product_placeholder.jpg')} alt="image"/>
                            </div>
                        </div>
                    </ReactResponsiveModal>
                </div>
                :''
            }
               <ProductImageSlider hoverImage={hoverImage} toggle={toggle} system_files={system_files}/>
        </div>
    );
});

export default ProductImage;
