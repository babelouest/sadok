import React, { useState, useEffect } from 'react';

export default function Cover({book, opacity, showCover}) {
  const [ imgData, setImgData ] = useState(false);
  
  useEffect(() => {
    if (showCover && book.book?.resources?.cover) {
      book.book.loadBlob(book.book.resources.cover.href)
      .then(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onloadend = () => {
          const dataUrlPrefix = `data:${book.book.resources.cover.mediaType};base64,`;
          setImgData(dataUrlPrefix+reader.result.split(",")[1]);
        };
      });
    } else {
      setImgData(false);
    }
  },[book,showCover]);

  if (showCover && imgData) {
    return (
      <div className="perfect-centering cover">
        <img src={imgData} className={"img-fluid opacity-"+opacity} />
      </div>
    );
  }
}
