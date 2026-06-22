import React, { useState, useEffect } from 'react';

export default function Cover({book, opacity, showCover}) {
  const [ imgData, setImgData ] = useState(false);
  
  useEffect(() => {
    if (book && showCover && book.resources?.cover) {
      book.loadBlob(book.resources.cover.href)
      .then(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onloadend = () => {
          const dataUrlPrefix = `data:${book.resources.cover.mediaType};base64,`;
          setImgData(dataUrlPrefix+reader.result.split(",")[1]);
        };
      });
    } else {
      setImgData(false);
    }
  },[book,showCover]);

  if (showCover && imgData && book.resources?.cover) {
    return (
      <div className="perfect-centering cover">
        <img src={imgData} className={"img-fluid opacity-"+opacity} />
      </div>
    );
  }
}
