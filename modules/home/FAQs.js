import React, { useEffect, useState } from "react";
import FAQsItem from "./FAQsItem";
import axios from "axios";

const getFaqs = async (type) => {
    try {
        const response = await axios.get('/api/v1/faq_blocks', {
            params: {
                model_type: type,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error loading faqs:", error);
        return [];
    }
};

const FAQs = ({ location, faq_items, type, disableForm}) => {

    const [faqItems, setFaqItems] = useState([]);

    let isMargin = location?.pathname?.indexOf('specification') !== -1;

    useEffect(() => {
        const fetchData = async () => {
            const items = (faq_items && faq_items.length) ? faq_items : await getFaqs(type);
            setFaqItems(items);
        };
        fetchData();
    }, [faq_items, location, type]);

    const colClassName = disableForm ? 'col-xl-12 col-lg-12 col-md-12 col-sm-12' : 'col-xl-7 col-lg-7 col-md-7 col-sm-7';

    return (
        <div className={colClassName + (isMargin ? ' margin-bottom' : '')}>
            <div className="full-width-title text-align-center">
                <h2 className={"title"}>FAQs</h2>
            </div>
            <div id='faqs' itemScope itemType="https://schema.org/FAQPage">
                {faqItems && faqItems.map((item, index) => {
                    return <FAQsItem key={index} item={item} />;
                })}
            </div>
        </div>
    );
};

export default FAQs;
