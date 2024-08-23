import React, {useState} from "react";
import {groupArrayByNestedObjKey} from "../../../../functions/main";
import {UncontrolledTooltip} from "reactstrap";
import {formatPrice,isMobile} from "../../../../functions/frontend";

const ProductAddonOptions=({options,setTotal,total,setSelectedAddons})=>{

    const [items,setItems] = useState(groupArrayByNestedObjKey(options,'name','product_addon_options_group'));

    const setChecked = (checkedOption, customValue = false) => {
        let newItems = {...items};

        let newTotal= 0
        let selectedAddons= []

        for (let key in items){
            // eslint-disable-next-line no-loop-func
            newItems[key] = newItems[key].map(option=>{
                if(checkedOption.group_id === option.group_id && customValue === false){
                    option.checked = checkedOption.id===option.id ? !checkedOption.checked : false
                    console.log('option',option)
                }

                if(option.checked){

                    if (customValue) {
                        option.customValue = customValue;
                    }

                    newTotal +=option.price;
                    selectedAddons.push(option);
                }

                return option;
            })
        }
        setItems(newItems);
        setTotal(newTotal);
        setSelectedAddons(selectedAddons);
    }

    return <div className="options product-options">
        {Object.keys(items).map(item=>
            <div className="option" key={item}><p className="option-name">{item}:</p>
                <ul className="option-list">
                    {items[item].map(option=>
                        <Option setChecked={setChecked} option={option} key={option.id}/>
                    )}
                </ul>
            </div>
        )}
        <OptionsResult total={total}/>
    </div>
}

const Option=({option,setChecked})=>{


    return <>
        <li id={`product-option-addon-${option.id}`}  onClick={(e)=> {
            e.preventDefault();
            setChecked(option);
        }} className={"option-item "+(option.checked? ' checked' : '')}><label>
            {!!option.image && <img
                src={option.image.url}/>}
            <input
                type="radio"
                name="product-width" value={option.id} />
            <span className="value">{option.name}</span></label>
            {!isMobile() ?
                <UncontrolledTooltip placement="top" autohide={true} target={`product-option-addon-${option.id}`}>{formatPrice(option.price,true,true,true,)}<br/>{option.tooltip}</UncontrolledTooltip>
                : ''}
        </li>
        {option.checked && option.set_custom &&
            <li>
                <input type={'text'}
                       className={'thumb option-item'}
                       placeholder={option.placeholder}
                       onChange={(e)=> {
                           e.preventDefault();
                           setChecked(option, e.target.value);
                       }}/>
            </li>
        }
    </>
}

const OptionsResult=({total})=>{

    if(!total)
        return null;

    return <div>Add-on(s): <span><span className="mw-price">{formatPrice(total,true,true,true)}</span></span></div>

}

export default ProductAddonOptions;