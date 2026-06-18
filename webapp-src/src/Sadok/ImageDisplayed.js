import React, { useState, useEffect } from 'react';

export default function ImageDisplayed({node, book}) {
  const [ imgData, setImgData ] = useState(false);
  
  useEffect(() => {
    if (book) {
      let imgSrc = node?.src||"";
      while (imgSrc.startsWith("../")) {
        imgSrc = imgSrc.slice(3);
      }
      book.imgResources.forEach(imgR => {
        if (imgR.id === node.id || imgR.href.endsWith(imgSrc)) {
          book.book.loadBlob(imgR.href)
          .then(res => {
            const reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onloadend = () => {
              const dataUrlPrefix = `data:${imgR.mediaType};base64,`;
              setImgData(dataUrlPrefix+reader.result.split(",")[1]);
            };
          });
        }
      });
    }
  },[]);

  if (!imgData) {
    return (
      <img alt={node.alt} className={node.classList}/>
    );
  } else {
    return (
      <img alt={node.alt} className={node.classList} src={imgData} />
    );
  }
}
