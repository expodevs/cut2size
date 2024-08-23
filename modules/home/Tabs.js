import React, { PureComponent} from "react";
import {connect} from "react-redux";
import { forceCheck } from 'react-lazyload';
import {isMobile} from "../../../../functions/frontend";
import TabsInner from "./parts/TabsInner";
import TabsInnerMobile from "./parts/TabsInnerMobile";


class Tabs extends PureComponent {


    state={
        index:0
    };

    check=(e,index)=>{
        e.preventDefault();
        this.setState({
            index:index
        },()=>{
            forceCheck();
        });


    };
    render() {
        return <div id="tabs">
            <div className="full-width-title text-align-center"><h2 className={"title"}>Products</h2></div>
                <div className="tab-subtitle text-align-center"><h3 className="title">Take a look at our most popular items. {this.props.countOrders} orders completed this month</h3></div>
                <TabsInnerMobile
                    galleries={this.props.galleries}
                />
                <TabsInner
                    galleries={this.props.galleries}
                    stateIndex={this.state.index}
                    check={this.check.bind(this)}
                />
        </div>
    }
}
const mapStateToProps = (state) => ({
    countOrders: state.init.countOrders,
});
export default connect(mapStateToProps)(Tabs);
