import React, { PureComponent } from 'react';
import loadable from '@loadable/component'
const QuickSearchInner = loadable(() => import('../parts/QuickSearchInner'));

class QuickSearch extends PureComponent {



    state={
       show:false,
    };


    componentDidMount() {

        //add click outside cart listener
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this.hideShow.bind(this),{passive: true});
        }
    }
    componentWillUnmount() {

        //remove click outside cart listener
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', this.hideShow.bind(this),{passive: true});
        }
    }


    toogleShow(e){
        if(e)
            e.preventDefault();

        let state = this.state.show;
        this.setState({show: !state})
    }


    hideShow(e){
        if(this.node && !this.node.contains(e.target)){
            this.setState({show: false});

            this.setState({result:false, query:'' })
        }

    }

    render() {

        return(
            <div className="header-search" ref={node=>this.node=node}>
                <button className={"search-button"+(this.state.show ? ' active ' : '')} aria-label="Button search" onClick={e=>this.toogleShow(e)}><svg className="search-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 16 16" style={{enableBackground: "new 0 0 16 16"}} xmlSpace="preserve"><g><g transform="translate(-521 -22)"><g><path className="st0" d="M536.8,37.8c-0.3,0.3-0.7,0.3-0.9,0c0,0,0,0,0,0L532,34c-2.9,2.4-7.1,1.9-9.5-0.9s-1.9-7.1,0.9-9.5c2.9-2.4,7.1-1.9,9.5,0.9c2,2.5,2,6.1,0,8.5l3.8,3.8C537,37.1,537.1,37.5,536.8,37.8C536.8,37.8,536.8,37.8,536.8,37.8zM533.1,28.7c0-3-2.4-5.4-5.4-5.4c-3,0-5.4,2.4-5.4,5.4c0,3,2.4,5.4,5.4,5.4C530.7,34.1,533.1,31.7,533.1,28.7z"/></g></g></g></svg><svg className="close-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10" style={{enableBackground:"new 0 0 10 10"}} xmlSpace="preserve"><g><g transform="translate(-1009 -25)"><g><path className="st0" d="M1014.7,30l4.2-4.2c0.2-0.2,0.2-0.5,0-0.7c-0.2-0.2-0.5-0.2-0.7,0l-4.2,4.2l-4.2-4.2c-0.2-0.2-0.5-0.2-0.7,0c-0.2,0.2-0.2,0.5,0,0.7l0,0l4.2,4.2l-4.2,4.2c-0.2,0.2-0.2,0.5,0,0.7c0.2,0.2,0.5,0.2,0.7,0l4.2-4.2l4.2,4.2c0.2,0.2,0.5,0.2,0.7,0c0.2-0.2,0.2-0.5,0-0.7l0,0L1014.7,30z"/></g></g></g></svg></button>

                {this.state.show &&
                    <QuickSearchInner
                        toogleShow={this.toogleShow.bind(this)}
                        show={this.state.show}
                    />
                }

            </div>
        )
    }
}

export default QuickSearch;

