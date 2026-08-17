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

import { READ_MODE } from '../lib/Constants';

export default function BrowseBookProfile({bookProfile}) {
  if (bookProfile) {
    if (bookProfile.offset >= bookProfile.tokens) {
      return (
        <span className="badge text-bg-secondary rounded-pill">
          <img className="elt-right" src="img/check_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
      );
    } else if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      if (bookProfile.tokens) {
        return (
            <span className="badge text-bg-secondary rounded-pill">
              {i18next.t("percent", {val: Math.floor(bookProfile.offset*100/bookProfile.tokens)})}
              <img className="elt-right" src="img/speed_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
            </span>
        );
      }
    } else if (bookProfile.readMode === READ_MODE.SPEECH) {
      if (bookProfile.tokens) {
        return (
          <span className="badge text-bg-secondary rounded-pill">
            {i18next.t("percent", {val: Math.floor(bookProfile.offset*100/bookProfile.tokens)})}
            <img className="elt-right" src="img/select_to_speak_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
        );
      }
    } else if (bookProfile.readMode === READ_MODE.SENTENCE) {
      if (bookProfile.tokens) {
        return (
          <span className="badge text-bg-secondary rounded-pill">
            {i18next.t("percent", {val: Math.floor(bookProfile.offset*100/bookProfile.tokens)})}
            <img className="elt-right" src="img/format_paragraph_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
        );
      }
    }
  }
}
