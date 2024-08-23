import {isWebpSupported} from 'react-image-webp/dist/utils';

export const getWebpImage=(src)=> {
    if(isWebpSupported){
        src = src.replace('.jpg','.webp');
        src = src.replace('.png','.webp');
        src = src.replace('.gif','.webp');
        src = src.replace('.svg','.webp');
    }
    return src;
};
