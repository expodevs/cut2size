import React, {Component} from "react";
import Form from "../Form";


class ContactUs extends Component {
    state={
        submitButtonDisable:false,
    };

    constructor(props) {
        super(props);
        this.toggleSuccess = this.toggleSuccess.bind(this);
    }

    toggleSuccess(message = false) {
        this.setState({
            success: message ? message : !this.state.success,
        });
    }


    render() {
        return <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5">
            <div className="full-width-title text-align-center"><h2 className={"title"}>Any Questions? CONTACT US!</h2></div>
            <div id='contact-us'>
                <Form isModal={false} afterSubmit={this.toggleSuccess}/>
                {this.state.success ?
                    <div className={'alert alert-success'}>{this.state.success}</div>
                    : ''
                }
            </div>
        </div>
    }
}

export default ContactUs;
