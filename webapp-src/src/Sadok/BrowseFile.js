import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import SizeFormat from './SizeFormat';
import DateFormat from './DateFormat';

import { READ_MODE } from '../lib/Constants';

export default function BrowseFile({item, bookProfile, cbOpenBook, cbViewBook}) {
  const viewBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cbViewBook(item);
  };

  let bookProfileJsx;
  if (bookProfile) {
    if (bookProfile.offset >= bookProfile.tokens) {
      bookProfileJsx = 
        <span className="badge text-bg-secondary rounded-pill">
          <img className="elt-right" src="img/check_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
    } else if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      if (bookProfile.tokens) {
        bookProfileJsx = 
          <span className="badge text-bg-secondary rounded-pill">
            {i18next.t("percent", {val: Math.floor(bookProfile.offset*100/bookProfile.tokens)})}
            <img className="elt-right" src="img/speed_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
      }
    }
  }
  return (
    <tr onClick={() => cbOpenBook(item)} className="clickable">
      <td className="text-break">
        {item.title}
      </td>
      <td>
         <SizeFormat size={item.size} />
      </td>
      <td>
        <DateFormat date={item.date} />
      </td>
      <td>
        <a href="#" onClick={viewBook} className="elt-left">
          <span className="badge text-bg-secondary rounded-pill">
            <img src="img/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
        </a>
        {bookProfileJsx}
      </td>
    </tr>
  );
}
