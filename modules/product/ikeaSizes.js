import React from "react";

const IkeaSizes = ({sizes, selectedSize, setSelectedSize}) => {
    return <div className="option product-options">
        <div className="option"><p className="option-name">Size:</p>
            {Object.keys(sizes).map(item=>
                <ul className="option product-options option-list" >
                    <Option
                        option={sizes[item]}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                    />
                </ul>
            )}
        </div>
    </div>
}

const Option=({option, selectedSize, setSelectedSize})=>{

    const handleOptionClick = () => {
        setSelectedSize(option);
    };

    return <>
        <li
            key={option.id}
            id={`product-option-addon-${option.id}`}
            className={"thumb option-item "+(selectedSize.id === option.id ? ' checked' : '')}
            onClick={handleOptionClick}>
                <label>
                <input
                    type="radio"
                    name="product-width"
                    value={option.id}
                />
                <span className="value">{option.product_property.name}</span>
            </label>
        </li>
    </>
}

export default IkeaSizes;