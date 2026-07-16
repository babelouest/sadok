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

export default function BrowseDir({item, cbOpenDir}) {
  return (
    <tr onClick={() => cbOpenDir(item.title)} className="clickable">
      <td className="text-break">
        {item.title}
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
        <span className="badge text-bg-secondary rounded-pill">
          <img src="img/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
      </td>
    </tr>
  );
}
