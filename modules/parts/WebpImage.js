import React, {useEffect, useState} from "react";
import {isWebpSupported} from 'react-image-webp/dist/utils';

const WebpImage =({alt,src,id,width=false,height=false, classImage=''})=> {

    const getSrc=(src)=>{
        if(isWebpSupported && src){
            src = src.replace('.jpg','.webp');
            src = src.replace('.png','.webp');
            src = src.replace('.gif','.webp');
            src = src.replace('.svg','.webp');
        }
        return src;
    };

    const [image,setImage] = useState(getSrc(src));
    const [originalImage,setOriginalImage] = useState(src);

    const onError = () => {
        setImage(originalImage);
    };

    useEffect(()=>{
        setImage(getSrc(src));
        setOriginalImage(src);
    },[src]);


        return <img src={image} alt={alt}
                    className={classImage}
                    onError={onError}
                    id={id}
                    width={width || undefined }
                    height={height|| undefined}
        />

}
export default React.memo(WebpImage);
