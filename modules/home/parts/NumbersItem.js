import React from "react";
import CountUp from "react-countup";

const NumbersItem = (props) => {
    let item = props.item;

    return <div className={"item text-align-center"}>
        <div className="number" data-max={item.number}><CountUp delay={0} end={item.number} /></div>
        <div className="text">{item.text}</div>
    </div>
}

export default NumbersItem;