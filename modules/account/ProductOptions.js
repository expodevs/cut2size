import React from "react";
import {FieldItem} from "./Product/Kit/Field";

const ProductOptions = (props) => {

	let product_options = props.product_options;
	return <>
		{
			product_options.map((item)=> {
				const option = item.product_addon_option;
				const name = item.notes ?? option.name;

				return <FieldItem
					field={{name: option.product_addon_options_group.name, value: name, id: item.id}}
					isCatalogProduct={true}
				/>
			})
		}
	</>
};

export default ProductOptions;