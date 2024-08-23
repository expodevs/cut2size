import React from 'react';

const ProductDescription = (props) => {

    return (
        props.description ?
            <div className={'product-description'}>
                {props.description.map((item, index) => {
                    return <div className={'description-item'} key={index}>
                        <div className={'title'}>{item.name}</div>
                        <div className={'content'}>{item.content}</div>
                    </div>;
                })}
            </div>
        : ''
    );
}
export default ProductDescription;
