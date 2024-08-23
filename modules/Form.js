import React, {Component} from "react";
import {store} from "../../../store";
import {updateItem} from "../../../actions/admin";
import {Button, FormGroup} from "reactstrap";
import WebpImage from "./parts/WebpImage";

const apiUrl = process.env.REACT_APP_API_SERVER_URL;

class Form extends Component{
    state={
        submitButtonDisable:false,
    };

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.afterSubmit = this.props.afterSubmit;
        this.toggleForm = this.props.toggleForm;
    }

    submit (e){
        e.preventDefault();

        this.setState({submitButtonDisable: true});
        this.setState({errors:false});
        store.dispatch(updateItem(e)).then(res=>{

            this.setState({submitButtonDisable: false});
            if(res.data.errors){
                this.setState({errors:res.data.errors})
            }

            if(res.data.success){
                if (this.toggleForm) this.toggleForm();
                this.afterSubmit(res.data.success);
            }

        });
    }


    render() {
        return <form method={'post'} encType={'multipart/form-data'} onSubmit={this.submit} action={apiUrl+'/callback-form/frontend'}>
            <div className="form-group">
                <label htmlFor="phone" className="col-form-label">Phone*:</label>
                <input type="tel" className="form-control" id="phone" name={'phone'} required={true}/>
            </div>
            <div className="form-group">
                <label htmlFor="email" className="col-form-label">Email*:</label>
                <input type="email" className="form-control" id="email" name={'email'} required={true}/>
            </div>
            <div className="form-group">
                <label htmlFor="message" className="col-form-label">Message:</label>
                <textarea className="form-control" id="message" name={'message'}></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="attachment" className="col-form-label">Attachment</label>
                <input type="file" className="form-control" id="attachment" name={'system_files[]'}/>
            </div>
            <FormGroup>
                <div className="row">
                    <div className="col-md-8">
                        <Button className="callback-sumbit" type={'submit'} disabled={this.state.submitButtonDisable} >Submit</Button>
                        {this.props.isModal ? <Button className="callback-cancel"  onClick={this.toggleForm}>Cancel</Button>: ''}
                    </div>
                </div>
            </FormGroup>
            {this.state.errors && this.state.errors.map(error=>
                <div className={'alert alert-danger'}>{error.message ? error.message : JSON.stringify(error)}</div>
            )}
        </form>
    }
}

export default Form;
