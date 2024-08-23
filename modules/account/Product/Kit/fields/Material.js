import PopupButton from "../../../../../../calc/blocks/PopupButton";
import React, {useState} from "react";
import {store} from "../../../../../../../store";
import axios from "axios";
import {setNotification} from "../../../../../../../actions/init";
import {compare, groupArrayByNestedObjKey} from "../../../../../../../functions/main";
import {formatName} from "../../../../../../../functions/frontend";
import {sendPost} from "../../../../../../../actions/admin";
import LoadingIndicator from "../../../../parts/LoadingIndicator";

const apiUrl =process.env.REACT_APP_API_URL;
const noGroupedName = 'noGrouped';

const Material=({field,calcCategoryId,setProduct})=>{

    const [loading,setLoading] = useState(false);
    const [modalOpen,setModalOpen] = useState(false);
    const [modalProducts,setModalProducts] = useState(false);
    const [modalImage,setModalImage] = useState(false);

    const [material,setMaterial] = useState({name:field.value});

    const onOpenModal = async (e,) => {
        e.preventDefault();
        setModalOpen(true);
        await  getProducts(field.name);
    };

    const getProducts=async(type)=>{
        try {
            setLoading(true);
            let products = await axios.get(apiUrl+'/kit/api/product-attribute-values?fields=name,slug,use_as_image_in_calc,calc_clear&expand=products&filter[slug]='+type+'&kit_calc_category='+(calcCategoryId || '' ))
            products = products.data;
            setModalImage( (products.products&& products.products[0]) ? products.products[0].image:false);

            if(products && products.products){

                products.products.sort((a, b) => compare(a,b,'group','sort'));
                products.products = groupArrayByNestedObjKey(products.products,'name','group',noGroupedName);
            }

            setModalProducts(products);
            setLoading(false);
        }catch (e){
            setLoading(false);
            store.dispatch(setNotification(e.message,'error'))
        }
    };


    const chooseMaterial=async (e, type,product=false)=>{
        e.preventDefault();

        setModalOpen(false);

        let result = await setProduct({
            oldProduct:field,
            newProduct:{...field,...{
                    erp_id:product.product_id,
                    value:product.name,
                }}
        });
        if(result && result.data && result.data.success){
            setMaterial({name:product.name});
        }
    };


    if(loading){
        return <div className="select-item col-12 text">
            <LoadingIndicator/>
        </div>
    }


    return <PopupButton
                containerClassName="select-item col-12 text"
                type={{
                    name:formatName(field.name)
                }}
                validationErrorsFields={{}}
                material={material}
                onOpenModal={(e)=>onOpenModal(e)}
                onCloseModal={()=>{
                    setModalOpen(false)
                }}
                chooseMaterial={chooseMaterial}
                setModalImage={(image)=>{
                    setModalImage(image)
                }}
                modalOpen={modalOpen}
                modalImage={modalImage}
                modalProducts={modalProducts}
                noGroupedName={noGroupedName}
                tooltip={false}
                tooltipImage={false}
            />
}
export default Material;
