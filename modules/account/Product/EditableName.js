import React, { useState } from 'react';
import { store } from "../../../../../store";
import { sendPost } from "../../../../../actions/admin";
import { setNotification } from "../../../../../actions/init";

const Url = process.env.REACT_APP_SERVER_URL;
const ApiUrl = process.env.REACT_APP_API_SERVER_URL;

const ProductItem = ({ name, product, orderId }) => {
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState(name || '');
    const [productName, setName] = useState(name || '');

    const saveName = async () => {
        let result = await store.dispatch(sendPost(`${Url + ApiUrl}/orders/change-order-product/${orderId}`,
            {
                product_id: product.product_id,
                kit_id: product.kit_id,
                order_id: product.order_id,
                name_custom: value,
            }, 'PUT'));

        if (result && result.data && result.data.success) {
            setName(value);
            store.dispatch(setNotification('Name successfully changed!', 'success'));
            setEdit(!edit);
        }
    };

    return (
        <div>
            <span className="product-title">{productName}</span>
            {edit ? (
                <span className="value">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <i className="icon-check icons ml-1 cursor-pointer" onClick={saveName} />
                </span>
            ) : (
                <i
                    className="icon-pencil icons ml-1 cursor-pointer"
                    onClick={() => {
                        setEdit(!edit);
                    }}
                />
            )}
        </div>
    );
};

export default ProductItem;
