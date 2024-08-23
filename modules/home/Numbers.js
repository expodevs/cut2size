import React, {PureComponent} from "react";
import {connect} from "react-redux";
import NumbersItem from "./parts/NumbersItem";


class Numbers extends PureComponent {

    state = {
        show: false,

    };

    componentDidMount() {

        if(typeof window !=='undefined'){
            window.addEventListener('scroll', this.handleScroll.bind(this),{passive: true});
        }

    }

    componentWillUnmount() {
        if(typeof window !=='undefined'){
            window.removeEventListener('scroll', this.handleScroll.bind(this),{passive: true});
        }
    }


    handleScroll(event) {
        let numbers = document.getElementById('numbers');
        if(numbers){
            let targetPosition = {
                    top: window.pageYOffset + numbers.getBoundingClientRect().top,
                    bottom: window.pageYOffset + numbers.getBoundingClientRect().bottom
                },
                windowPosition = {
                    top: window.pageYOffset,
                    bottom: window.pageYOffset + document.documentElement.clientHeight
                };
            if (!this.state.show) {
                if (targetPosition.bottom > windowPosition.top &&
                    targetPosition.top < windowPosition.bottom) {


                    this.setState({
                        show:true
                    })
                }
            }
        }

    }

    render() {
        let items= [
            {
                number: 8,
                text: 'years in business'
            },
            {
                number: 1020+this.props.countOrders,
                text: 'completed orders'
            },
            {
                number: 24,
                text: 'days average delivery time'
            },
        ];

        return <div id="numbers">
            <div className="full-width-title text-align-center"><h2 className={"title"}>Cut2Size in numbers</h2></div>
            {!!this.state.show &&
                items.map((item, index) => {
                    return <NumbersItem
                        key={index}
                        item={item}
                    />
                })
            }

        </div>
    }
}

const mapStateToProps = (state) => ({
    countOrders: state.init.countOrders,
});
export default connect(mapStateToProps)(Numbers);

