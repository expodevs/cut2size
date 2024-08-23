
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Breadcrumbs from "./modules/breadcrumbs";
import SampleItem from "./modules/samples/SampleItem";
import {compare, groupArrayByNestedObjKey} from "../../functions/main";
import {isMobile} from "react-device-detect";
import SampleAnchor from "./modules/samples/SampleAnchor";

const noGroupedName = 'noGrouped';

const Samples=()=>{
    const apiUrl = process.env.REACT_APP_API_URL;

    const [samples,setSamples]=useState(null);

    const dots = useRef();
    const moreText = useRef();
    const moreBtn = useRef();

    const texts = {
        'HIGH GLOSS' : 'Also known as acrylic panels, these are high sheen UV lacquered panels with an MDF core. Flat-panel high gloss doors are a very popular choice in contemporary spaces. They give a clean, sleek look to your space and are easy to maintain and clean - simply wipe down the doors with a dampened microfibre cloth.',
        'TEXTURED MELAMINE' : 'Textured melamine is an amazing option for people who are looking for an affordable and durable solution for millwork. There is a huge selection of colours, textures and finishes. We use well known in Europe and North America Egger boards which are famous for high quality, UV resistance, variety of colours, and textures.',
        'MATT MATERIAL' : 'Matte material is a great option when you would like to achieve a solid colour painted look for your cabinet doors and panels. Compare to MDF lacquered fronts, matte material is more durable. All the matte materials are fingerprint resistant especially when it comes to dark colours which tend to show marks more.',

    }


    const showMore = () => {
        console.log('samples', samples)
        if (dots !== undefined && moreText !== undefined && moreBtn !== undefined) {
            let dotsCur = dots.current;
            let moreTextCur = moreText.current;
            let moreBtnCur = moreBtn.current;

            if (dotsCur.style.display === "none") {
                dotsCur.style.display = "inline";
                moreBtnCur.innerHTML = "Read more";
                moreTextCur.style.display = "none";
            } else {
                dotsCur.style.display = "none";
                moreBtnCur.innerHTML = "Read less";
                moreTextCur.style.display = "inline";
            }
        }


    }

    const fetchData=async ()=>{
        let result = await axios.get(apiUrl+'/kit/api/product-attribute-values?fields=name,slug,use_as_image_in_calc,calc_clear&expand=products&filter[slug]=sample')
        if(result.data){

            if(result.data && result.data.products){
                let products = result.data.products;
                products.sort((a, b) => compare(a,b,'group','sort'));
                products = groupArrayByNestedObjKey(products,'name','group',noGroupedName);
                setSamples(products)
            }

        }
    };
    useEffect(()=>{
        fetchData();
    },[]);


    return  <main>
                <section className="no-padding-bottom">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: 'Samples',
                                },
                            ]
                        }
                    />
                </section>
                    <section className="no-padding-top ">
                                <div className="container">
                                    <div className={'samples-header' + (isMobile ? ' mobile' : '')}>
                                        <h1 className="samples-title">Cut2Size Samples</h1>
                                        {isMobile ?
                                            <p className={'samples-text'}>Get the kitchen of your dream with custom cabinets available for order through our Cut2Size platform!
                                                <span ref={dots}>...</span><span ref={moreText} id={'moreText'}>
                                                 You can save up to 50% when you purchase kitchen cabinets, doors, and drawers from us. All of our cabinets are made from high-quality materials and hardware. We pride ourselves on selling cabinetry that is built to last.</span> <span id={'moreBtn'} ref={moreBtn} onClick={showMore}>Read more</span></p>
                                        :
                                            <p className={'samples-text'}>Get the kitchen of your dream with custom cabinets available for order through our Cut2Size platform! You can save up to 50% when you purchase kitchen cabinets, doors, and drawers from us. All of our cabinets are made from high-quality materials and hardware. We pride ourselves on selling cabinetry that is built to last.</p>

                                        }
                                        <div className="category-anchors row">
                                            {(samples) ?
                                            Object.keys(samples).map((key,index) => {
                                                let product = samples[key][0];
                                                return <SampleAnchor name={key} productImage={product.image} />
                                            }) : ''
                                            }
                                        </div>
                                    </div>
                                    {(samples) ?
                                    Object.keys(samples).map((key,index)=>{
                                        console.log('samples', samples)
                                        let products = samples[key];

                                        return <div className={"category samples row" + (isMobile ? ' mobile' : '')} id={'anchor-'+key}>
                                                    <div className="category-content col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                        <div className="category-title"><h1>{key}</h1></div>
                                                        {!isMobile ?
                                                            <p className={'samples-text'}>
                                                                {texts[key]}
                                                            </p>
                                                            : ''
                                                        }

                                                        <div className="row">
                                                        {products.map((product,index)=>
                                                            <SampleItem key={index} sample={product}/>
                                                        )}
                                                        </div>
                                                    </div>
                                            </div>

                                    })
                                        :
                                        'No results found'
                                    }
                                </div>
                    </section>
                </main>
};
export default Samples;
