import React, { Component } from 'react';
import {store} from "../../../../store";
import {getInfo} from "../../../../actions/admin";
import SelectMap from "../../../../admin/views/Base/Forms/SelectMap";
import InputMask from 'react-input-mask';
import CustomerLocationAutocomplete from "../parts/CustomerLocationAutocomplete";
import AccountSettingsEdit from "./AccountSettingsEdit";
import CheckoutSettings from "./CheckoutSettings";

class AccountSettings extends Component {

    state={
        passwordType:'password',
        provinces:false,
        countries:false,
        usa:false,
        country: 'Canada',
    };

    constructor(props) {
        super(props);
        this.getUsaStates();
        this.getProvinces();
        this.getCountries();
    }

    getProvinces(){
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        store.dispatch(
            getInfo(ApiUrl+'/orders/provinces'))
            .then(res=>{
                if(res.errors){
                    this.props.setResponces(false, res.errors)
                }else{

                    if(res && res.value){
                        let provinces = res.value;
                        provinces = provinces.map(s =>{ return ({id : s.code.trim(), name:s.province.trim()})});
                        this.setState({provinces:provinces});
                    }
                }
            })
            .catch(error=>{
                if(this.props.setResponses)
                    this.props.setResponses(false, error)

            });

    }

    getCountries(){
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        store.dispatch(
            getInfo(ApiUrl+'/orders/countries'))
            .then(res=>{
                if(res.errors){
                    this.props.setResponces(false, res.errors)
                }else{
                    if(res && res.value){
                        let countries = res.value;
                        countries = countries.map(s =>{ return ({id : s, name:s})});
                        this.setState({countries:countries});
                    }
                }
            })
            .catch(error=>{
                if(this.props.setResponses)
                    this.props.setResponses(false, error)

            });

    }

    getUsaStates(){
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        store.dispatch(
            getInfo(ApiUrl+'/orders/usa-states'))
            .then(res=>{
                if(res.errors){
                    this.props.setResponces(false, res.errors)
                }else{
                    if(res && res.value){

                        let value = res.value;

                        let usa = [];
                        for (let key in value) {
                            usa.push({ id: value[key], name: value[key] });
                        }

                        this.setState({usa:usa});
                    }
                }
            })
            .catch(error=>{
                if(this.props.setResponses)
                    this.props.setResponses(false, error)

            });

    }


    setPassType(e,type){
        e.preventDefault();
        this.state[type]==='password' ? this.setState({[type]:'text'}): this.setState({[type]:'password'})
    }



    render() {

        let account = this.props.account;
        return (
            (this.props.customer && account)?

                (this.props.isCheckout ?
                        <CheckoutSettings
                            account={account}
                            customer={this.props.customer}
                            saveAccountData={this.props.saveAccountData}
                            hideForm={true}
                            edit={this.props.edit}
                            changeEdit={this.props.changeEdit}
                            passwordType={this.state.passwordType}
                            setPassType={this.setPassType.bind(this)}
                            shipping={this.props.shipping}
                            changeShipping={this.props.changeShipping}
                            provinces={this.state.provinces}
                            countries={this.state.countries}
                            usa={this.state.usa}
                            isCheckout={this.props.isCheckout}
                        />
                        :
                        <AccountSettingsEdit
                            account={account}
                            customer={this.props.customer}
                            saveAccountData={this.props.saveAccountData}
                            hideForm={this.props.hideForm}
                            edit={this.props.edit}
                            changeEdit={this.props.changeEdit}
                            passwordType={this.state.passwordType}
                            setPassType={this.setPassType.bind(this)}
                            shipping={this.props.shipping}
                            changeShipping={this.props.changeShipping}
                            provinces={this.state.provinces}
                            countries={this.state.countries}
                            usa={this.state.usa}
                            isCheckout={this.props.isCheckout}
                        />
                )
            : ''

        )
    }
}

export class FieldsWrapper extends React.Component {
    render() {
        return (!this.props.hideForm) ?

                    <form className={this.props.className} method={this.props.method} action={this.props.action}
                          onSubmit={this.props.onSubmit} id={this.props.formId}>{this.props.children}</form>
                    :

                    <div className={this.props.className}
                         >{this.props.children}</div>

    }
}

export class CustomerFields extends React.Component {
    render() {
        let account = this.props.account;
        let type = this.props.type;
        let edit = this.props.isCheckout ? this.props.edit : this.props.hideForm;
        return (
            this.props.isCheckout ?
                <FieldsWrapper
                    className={"account-form "+(edit ? '' : ' default')}
                    action={"/customers/"+this.props.customer.id}
                    method="post"
                    onSubmit={e=>this.props.saveAccountData(e, type)}
                    hideForm={this.props.isCheckout}>
                    <AccountFields
                        account={account}
                        type={type}
                        edit={edit}
                        provinces={this.props.provinces}
                        countries={this.props.countries}
                        shipping={this.props.shipping}
                        usa={this.props.usa}
                    />
                </FieldsWrapper>
                    :
                <AccountFields
                    account={account}
                    type={type}
                    edit={edit}
                    provinces={this.props.provinces}
                    countries={this.props.countries}
                    usa={this.props.usa}
                    shipping={this.props.shipping}
                />
        );

    }
}

export class AccountFields extends Component {

    state={
        country: this.props.account[this.props.type+"_country"],
    };

    handleCountryChange = (newValue) => {

        this.setState({ country: newValue.target.value });
    }

    render() {
        let account = this.props.account;
        let type = this.props.type;
        let edit = this.props.edit;

        return (
            <React.Fragment>
                <div className="field"><label><span className="field-name">First Name:</span><input name={type+"_firstname"} type="text" readOnly={!edit}   defaultValue={account[type+"_firstname"]} /></label></div>
                <div className="field"><label><span className="field-name">Last Name:</span><input name={type+"_lastname"} type="text" readOnly={!edit}   defaultValue={account[type+"_lastname"]} /></label></div>
                <div className="field"><label><span className="field-name">Company:</span><input name={type+"_company"} type="text" readOnly={!edit}  defaultValue={account[type+"_company"]} /></label></div>
                <div className="field"><label><span className="field-name">Address:</span><input name={type+"_address"} type="text" readOnly={!edit}   defaultValue={account[type+"_address"]} /></label></div>
                <div className="field"><label><span className="field-name">City:</span>
                    <CustomerLocationAutocomplete name={type+"_city"} readOnly={!edit}  defaultValue={account[type+"_city"]} />
                </label>
                </div>
                <div className="field"><label><span className="field-name">
                    {this.state.country === 'Canada' ? (
                    <span className="field-name">Province:</span>
                    ) : (
                    <span className="field-name">State:</span>
                    )}</span>
                    <SelectMap name={type+'_province'} label={this.state.country === 'Canada' ? 'Province' : 'State'} readOnly={!edit}  data={this.props.provinces && this.props.usa ? (this.state.country === 'Canada' ? this.props.provinces : this.props.usa) : false } value ={account[type+"_province"]} />
                </label></div>
                <div className="field"><label><span className="field-name">Postal Code:</span><InputWithMask    name={type+"_postal_code"} readOnly={!edit} mask="*** ***" type="text" value={account[type+"_postal_code"]} /></label></div>
                <div className="field"><label><span className="field-name">Country:</span>
                    <SelectMap
                        name={type + '_country'}
                        label={"Country"}
                        readOnly={!edit}
                        data={this.props.countries ? this.props.countries : false}
                        value={account[type+"_country"] === 'Canada' ? 'Canada' : 'USA'}
                        onChange={this.handleCountryChange}
                    />
                </label></div>
                <div className="field"><label><span className="field-name">Phone:</span><InputWithMask     mask="(999) 999-9999"  readOnly={!edit} name={type+"_cell_phone"} type="tel" maskChar=" " value={account[type+"_cell_phone"]} /></label></div>
                {!this.props.shipping ? <input type="hidden" name={'ship_pay'} readOnly={!edit} defaultValue={true}/> : '' }
            </React.Fragment>
        );
    }
}


export class InputWithMask extends React.Component {
    state = {
        value: this.props.value ? this.props.value : ''
    };

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
    };

    beforeMaskedValueChange = (newState, oldState, userInput) => {
        let { value } = newState;
        let selection = newState.selection;
        let cursorPosition = selection ? selection.start : null;

        // keep minus if entered by user
        if (value.endsWith('-') && userInput !== '-' && !this.state.value.endsWith('-')) {
            if (cursorPosition === value.length) {
                cursorPosition--;
                selection = { start: cursorPosition, end: cursorPosition };
            }
            value = value.slice(0, -1);
        }

        return {
            value,
            selection
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.value !==nextProps.value){
            this.setState({
                value: nextProps.value
            });
        }
    }

    render() {
        return <InputMask mask={this.props.mask} name={this.props.name} type={this.props.type} readOnly={this.props.readOnly} maskChar={null} value={this.state.value} onChange={this.onChange} beforeMaskedValueChange={this.beforeMaskedValueChange} placeholder={''}/>;
    }
}



export default AccountSettings;
