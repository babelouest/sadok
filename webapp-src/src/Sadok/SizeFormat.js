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

import i18next from 'i18next';

export default function SizeFormat({size}) {
  if (!isNaN(size)) {
    if (size > 1024*1024) {
      return (<>{i18next.t("size-mb", {val: Math.floor(100*size/(1024*1024))/100})}</>);
    } else if (size > 1024) {
      return (<>{i18next.t("size-kb", {val: Math.floor(100*size/(1024))/100})}</>);
    } else {
      return (<>{i18next.t("size-b", {val: Math.floor(100*size)/100})}</>);
    }
  } else {
    return <></>
  }
}
