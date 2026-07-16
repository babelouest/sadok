/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <https://www.gnu.org/licenses/>. 
 * 
 */

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
