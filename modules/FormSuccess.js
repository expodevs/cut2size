import React, { Component } from 'react';

class FormSuccess extends Component {






    render() {
        let success = this.props.success;
        return (<div >

            {
                (success && typeof success !== 'undefined')
                    ?
                    (typeof success ==='string')
                        ?
                             (<div  className={'alert alert-success fade show'}>{success}</div>)
                        :
                        (success.length>0)?
                            success.map((mes,index) => {
                                    return (<div key={index} className={'alert alert-success fade show'}>{mes.message ?mes.message : mes }</div>)
                                }
                            )
                            :
                        Object.keys(success).map((mes,index) => {
                                return (<div key={index} className={'alert alert-success fade show'}>{success[mes]}</div>)
                            }
                        )

                        :
                        ''
            }
        </div>)
    }

}

export default FormSuccess;