import React, { PureComponent } from 'react';
import loadable from '@loadable/component'
const ModalCallbackInner = loadable(() => import('./parts/ModalCallbackInner'));

class ModalCallback extends PureComponent {

    state={
        modal:false,
        submitButtonDisable:false,
        success:false,
    };


    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.toggleSuccess = this.toggleSuccess.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    toggleSuccess(message = false) {
        this.setState({
            success: message ? message : false,
        });
    }


    render() {
        return <div className={'header-search'}><button onClick={this.toggle} aria-label="Button search" className="search-button callback-button"><i className={'fa fa-question fa-2x'}></i></button>
            {(this.state.modal || this.state.success )&&
                <ModalCallbackInner
                    state={this.state}
                    toggle={this.toggle}
                    toggleSuccess={this.toggleSuccess}
                />
            }

        </div>
    }
}

export default ModalCallback;
