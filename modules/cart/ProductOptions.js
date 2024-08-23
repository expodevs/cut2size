import React from "react";

const ProductOptions = (props) => {

	let product_options = props.product_options;

	return <>
		{
			product_options.map((item,index)=> {
				return (
					<div className="item-option" key={index}>
						<div className="name-group-option">{item.product_addon_options_group.name}</div>
						<div className="name-option">{item.customValue ? item.customValue : item.name}</div>
					</div>
				)
			})
		}
	</>
};

export default ProductOptions;