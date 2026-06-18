import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import SizeFormat from './SizeFormat';
import DateFormat from './DateFormat';

import { READ_MODE } from '../lib/Constants';

export default function BrowseFile({item, bookProfile, cbOpenBook}) {
  let bookProfileJsx;
  if (bookProfile) {
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      if (bookProfile.tokens) {
        bookProfileJsx = 
          <span className="badge text-bg-info rounded-pill elt-right">
            {i18next.t("percent", {val: Math.floor(bookProfile.offset*100/bookProfile.tokens)})}
            <img className="elt-right" src="img/speed_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
      }
    }
  }
  return (
    <tr onClick={() => cbOpenBook(item.url)} className="clickable">
      <td>
        {item.title}
      </td>
      <td>
         <SizeFormat size={item.size} />
      </td>
      <td>
        <DateFormat date={item.date} />
      </td>
      <td>
        {bookProfileJsx}
      </td>
    </tr>
  );
}
