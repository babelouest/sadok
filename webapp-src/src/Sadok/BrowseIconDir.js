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

export default function BrowseIconDir({dir, cbOpenDir}) {
  return (
    <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12">
      <div className="card">
        <a href={"#"} onClick={() => cbOpenDir(dir.title)}>
          <img src="img/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" className="card-img-top" style={{"height": 350}} alt={dir.title}/>
        </a>
        <div className="card-body">
          <p className="card-text">{dir.title}</p>
        </div>
      </div>
    </div>
  );
}
