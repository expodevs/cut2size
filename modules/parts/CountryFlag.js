import React, { useState, useEffect } from "react";

const CountryFlag = () => {
    const [ipAddress, setIpAddress] = useState("");
    const [country, setCountry] = useState("");
    const [showCountryList, setShowCountryList] = useState(false);

    useEffect(() => {
        async function fetchIpAddress() {
            try {

                const storedCountry = localStorage.getItem('selectedCountry');
                if (storedCountry) {
                    setCountry(storedCountry);
                } else {
                    const response = await fetch("https://api64.ipify.org?format=json");
                    const data = await response.json();
                    setIpAddress(data.ip);
                    const countryResponse = await fetch(`https://ipinfo.io/${data.ip}?token=c6fc501331047b`);

                    const countryData = JSON.parse(await countryResponse.text());
                    setCountry(countryData.country);
                    localStorage.setItem('selectedCountry', country === 'US' ? 'US' : 'CA');
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchIpAddress();
    }, []);

    const handleCountryChange = (country) => {
        const selectedCountry = country;
        setCountry(selectedCountry);
        localStorage.setItem('selectedCountry', selectedCountry);
        console.log(country);
    };

    const toggleCountryList = () => {
        setShowCountryList(!showCountryList);
    };

    const flag = country === 'US' ? 'us' : 'canada';

    return (
        <div onClick={toggleCountryList}>
                I'm in <span className={"current-country " + flag}></span>
            {showCountryList && (
                <ul>
                    <li className="us" onClick={() => handleCountryChange('US')}>USA</li>
                    <li className="canada" onClick={() => handleCountryChange('CA')}>Canada</li>
                </ul>
            )}
        </div>
    );
};

export default CountryFlag;