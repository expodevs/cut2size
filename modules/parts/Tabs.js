
import React, { useState } from 'react';
const Tabs = (props) => {
    const [activeTab, setActiveTab] = useState('0');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    };
    return (
        <div>
                <ul className="tab-navigation nav nav-tabs" role="tablist">
                    {props.data.map((item,index)=>
                        <li  className="navigation-item" key={index}>
                            <a
                                onClick={(e) => {e.preventDefault(); toggle(index); }}
                                href={item.name}
                                className={parseInt(activeTab) === parseInt(index) ? 'active show' : ''}
                                aria-controls={item.name}
                                data-toggle="tab" role="tab"> {item.name}</a>
                        </li>
                    )}
                </ul>
                <div className="tabs tab-content">
                {props.data.map((item,index)=>
                    <div key={index} role="tabpanel" id="description" className={parseInt(activeTab) === parseInt(index)  ? "tab tab-pane active" : 'tab tab-pane'}>
                                {item.content}
                    </div>
                )}
                </div>
        </div>
    );
};

export default Tabs;
