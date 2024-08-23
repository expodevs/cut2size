import React, {PureComponent} from "react";
import HowCut2sizeWorksItem from "./parts/HowCut2sizeWorksItem";

class HowCut2sizeWorks extends PureComponent {
    render() {
        return <div id="how-cut2size-works">
            <div className="full-width-title text-align-center"><h2 className={"title"}>EASY QUOTE & ORDER</h2></div>
            <HowCut2sizeWorksItem
                itemClass={'item-first'}
                img={'/images/Shopping-Bag.svg'}
                text={'Select a cabinet, drawer or door'}
            />
            <HowCut2sizeWorksItem
                itemClass={'item-second'}
                img={'/images/king-size.svg'}
                text={'Set needed dimensions'}
            />
            <HowCut2sizeWorksItem
                itemClass={'item-third'}
                img={'/images/Shopping-Cart2.svg'}
                text={'Get instant price and order'}
            />
            <HowCut2sizeWorksItem
                itemClass={'item-fourth'}
                img={'/images/delivery-truck.svg'}
                text={'Meet your new furniture'}
            />
        </div>
    }
}

export default HowCut2sizeWorks;
