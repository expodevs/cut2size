import React, { PureComponent} from 'react';
import Modal from "react-responsive-modal";

class FormErrors extends PureComponent {



    constructor(props){
        super(props);
        this.state={
            modalOpen:false
        }
    }

    onOpenModal = (e) => {

        this.setState({ modalOpen: true });

    };

    onCloseModal = () => {
        if(this.props.onCloseModal){
            this.props.onCloseModal();
        }
        this.setState({ modalOpen: false });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if((!prevProps.formErrors && this.props.formErrors && (this.props.formErrors.length || Object.keys(this.props.formErrors).length))
        || (!prevProps.success && this.props.success && (this.props.success.length || Object.keys(this.props.success).length))
        ){
            this.setState({
                modalOpen: true ,
            });
        }
    }
    componentDidMount() {
        if(this.props.formErrors && (this.props.formErrors.length || Object.keys(this.props.formErrors).length)
        || this.props.success && (this.props.success.length || Object.keys(this.props.success).length)
        ){
            this.setState({
                modalOpen: true ,
            });
        }
    }

    showErrors(formErrors) {
        return <div style={{marginTop:"10%"}}>

            {
                (formErrors && typeof formErrors !== 'undefined')
                    ?
                    (typeof formErrors ==='string')
                        ?
                        (<div  className={'alert alert-danger fade show'}>{formErrors}</div>)
                        :
                        (formErrors.length>0)?
                            formErrors.map((error,index) => {
                                    return (<div key={index} className={'alert alert-danger fade show'}>{error.message ?error.message : error }</div>)
                                }
                            )
                            :
                            Object.keys(formErrors).map((error,index) => {
                                    return (<div key={index} className={'alert alert-danger fade show'}>{formErrors[error]}</div>)
                                }
                            )

                    :
                    ''
            }
        </div>
    }

    showSuccess(success) {
        return <div style={{marginTop:"10%"}}>

            {
                (success && typeof success !== 'undefined')
                    ?
                    (typeof success ==='string')
                        ?
                        (<div  className={'alert alert-success fade show'}>{success}</div>)
                        :
                        (success.length>0)?
                            success.map((error,index) => {
                                    return (<div key={index} className={'alert alert-success fade show'}>{error.message ?error.message : error }</div>)
                                }
                            )
                            :
                            Object.keys(success).map((error,index) => {
                                    return (<div key={index} className={'alert alert-success fade show'}>{success[error]}</div>)
                                }
                            )

                    :
                    ''
            }
        </div>
    }

    render() {
        let formErrors = this.props.formErrors;
        let success = this.props.success;
        return (
            <div>
                {
                    (this.props.notModal)
                        ?
                        this.showErrors(formErrors)
                        : <Modal open={this.state.modalOpen} onClose={this.onCloseModal} center blockScroll={false}
                                 styles={{
                                     modal: {
                                         maxWidth: "1200px"
                                     }
                                 }}
                        >
                            {this.showErrors(formErrors)}
                            {this.showSuccess(success)}
                        </Modal>
                }
            </div>
        )
    }

}

export default FormErrors;
