import React, {useEffect, useRef, useState} from "react"
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import PropTypes from "prop-types";


const MY_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const CustomerLocationAutocomplete=({readOnly,name,defaultValue,value})=>{
    const [search,setSearch]=useState('');
    const [valueTemp,setValueTemp]=useState(defaultValue||value||'');
    const [valueSet,setValueSet]=useState(defaultValue||value||'');
    const [otherCity,setOtherCity]=useState(false);
    useEffect(()=>{
        setValueTemp(defaultValue||value||'');
        setValueSet(defaultValue||value||'');
    },[defaultValue,value])

    const handleInputChange = e => {
        setValueSet(e.target.value);

        setSearch(e.target.value);
        setValueTemp(e.target.value);

    };
    const input = useRef();
    const handleSelectSuggest = (geocodedPrediction, originalPrediction) => {

        if(input && input.current){
            input.current.blur();
        }
        setSearch('');
        setValueSet(originalPrediction.structured_formatting.main_text);
        setValueTemp(originalPrediction.structured_formatting.main_text);
    };

    const handleNoResult = () => {
        console.log("No results for ", search)
    };

    const handleStatusUpdate = status => {
        // console.log(status)
    };


    return <ReactGoogleMapLoader
        params={{
            key: MY_API_KEY,
            libraries: "places,geocode",
        }}
        render={googleMaps =>
        {

            return googleMaps && (
                <ReactGooglePlacesSuggest
                    googleMaps={googleMaps}
                    autocompletionRequest={{
                        input: search,
                        types: ['(cities)'],
                        componentRestrictions: {country:'CA'}
                        // Optional options
                        // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                    }}
                    // Optional props
                    onNoResult={handleNoResult}
                    onSelectSuggest={handleSelectSuggest}
                    onStatusUpdate={handleStatusUpdate}
                    textNoResults="My custom no results text" // null or "" if you want to disable the no results item
                    displayPoweredByGoogle={false}
                    customRender={prediction => (
                        <div className="customWrapper">
                            {prediction
                                ? prediction.description
                                :
                                <div
                                    style={{cursor:'pointer'}}
                                    onClick={()=>{
                                    if(input && input.current){
                                        input.current.blur();
                                    }
                                    setValueSet(search);
                                    setValueTemp(search);
                                    setSearch('');
                                    setOtherCity(true);
                                }
                                }>Other city</div>
                            }
                        </div>
                    )}
                >
                    <input
                        ref={input}
                        type="text"
                        value={valueTemp}
                        name={'tempCity'}
                        placeholder="Search a location"
                        autoComplete={'off'}
                        className="form-control"
                        onChange={handleInputChange}
                        readOnly={readOnly}
                    />
                    <input
                        type="hidden"
                        value={valueSet}
                        name={name}
                    />
                </ReactGooglePlacesSuggest>
            )
        }
        }
    />
};

CustomerLocationAutocomplete.defaultProps={
    readOnly:false,
    name:'city',
    defaultValue:'',
};
CustomerLocationAutocomplete.propTypes={
    readOnly:PropTypes.bool.isRequired,
    name:PropTypes.string.isRequired,
    defaultValue:PropTypes.string.isRequired,
};
export default CustomerLocationAutocomplete;
