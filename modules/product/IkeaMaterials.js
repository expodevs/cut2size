import React from "react";
import {formatPrice, isMobile} from "../../../../functions/frontend";
import {UncontrolledTooltip} from "reactstrap";

const IkeaMaterials = ({materials, selectedMaterial, setSelectedMaterial}) => {
    return <div className="option product-options">
        <div className="option">
            <p className="option-name">Material:</p>
            <ul className="option option-list" >
            {Object.keys(materials).map(item=>
                    <Option
                        option={materials[item]}
                        selectedMaterial={selectedMaterial}
                        setSelectedMaterial={setSelectedMaterial}
                    />
            )}
            </ul>
        </div>
    </div>
}

const Option=({option, selectedMaterial, setSelectedMaterial})=>{

    const handleOptionClick = () => {
        setSelectedMaterial(option);
    };

    return <>
        <li
            key={option.id}
            id={`product-option-addon-${option.id}`}
            className={"thumb option-item "+(selectedMaterial.id === option.id ? ' checked' : '')}
            onClick={handleOptionClick}>
                <label>
                {!!option.system_files && option.system_files[0] &&
                    <img src={option.system_files[0].url}/>
                }
                <input
                    type="radio"
                    name="product-width"
                    value={option.id}
                />
                <span className="value">{option.name}</span>
            </label>
        </li>
    </>
}

export default IkeaMaterials;