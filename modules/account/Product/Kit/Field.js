import {formatName} from "../../../../../../functions/frontend";
import {convertDimensionToFront} from "../../../../../../functions/main";
import React, {useState} from "react";
import FieldItemEdit from "./FieldItemEdit";
import {sendPost} from "../../../../../../actions/admin";
import {store} from "../../../../../../store";
import {setNotification} from "../../../../../../actions/init";
const Url = process.env.REACT_APP_SERVER_URL;
const ApiUrl = process.env.REACT_APP_API_SERVER_URL;


export const Field=({field,admin, calcCategoryId,order,productsEdit})=>{

    return <div  className="row no-padding">{field.map((fieldItem,fieldIndex)=> {
                    let field = {...fieldItem};
                    return (field.value) ?
                        (productsEdit ?
                                <FieldItemEdit order={order} calcCategoryId={calcCategoryId} key={fieldIndex} field={field} admin={admin}/>
                                :
                                <FieldItem key={fieldIndex} field={field} admin={admin}/>

                        )
                        : null
                }
            )}
            </div>
};


export const FieldItem=({field, isCatalogProduct = false})=>{

    const [edit,setEdit] = useState(false);
    const [note,setNote] = useState(field.notes || '');
    const [value,setValue] = useState(
        ((field.name==='height'|| field.name==='width' || field.name==='depth') && field.value)
            ?
            convertDimensionToFront(field.value)
            :
            field.value
    );

    if(field.name.toLowerCase()==='cb'){
        field.name = 'Cabinet base'
    }

    let nameFormated  = formatName(field.name);

    if((field.name==='height'|| field.name==='width' || field.name==='depth') && field.value){
        field.value = convertDimensionToFront(field.value);
    }




    const saveNote=()=>{

        const saveRequestUrl = isCatalogProduct ? '/orders/save-order-product-addons-note/' : '/orders/save-order-kit-fields-note/';

        store.dispatch(sendPost(`${Url+ApiUrl}${saveRequestUrl}${field.id}`,{
            note:note
        })).then(result=>{
            setEdit(!edit);
            store.dispatch(setNotification('Saved!','success'));
        }).catch(err=>{
            console.error(err);

        });
    };


    return <div  className="select-item col-12 text" >
                <span className="properties">{nameFormated}:</span>
                {
                    edit
                    ?
                        <span className="value">
                        <input type="text" value={note} onChange={(e)=>setNote(e.target.value)}/>
                        <i className="icon-check icons ml-1 cursor-pointer " onClick={saveNote}/>
                        </span>
                    :
                <>
                    <span className="value">
                    {
                        note ?

                        note
                            :
                        (
                        (value===true||parseInt(value)===1)
                        ?
                        'YES'
                        :
                        (parseInt(value)===0 ? 'NO':value)
                        )
                    }
                        <i className="icon-pencil icons ml-1 cursor-pointer "
                           onClick={()=>{
                               setEdit(!edit)
                           }}
                        />
                    </span>
                </>
                }
            </div>
};

export default Field;
