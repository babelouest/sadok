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

import profile from '../lib/Profile';

export default function ParametersProfile({config, cbSaveProfile}) {
  const [ profileName, setProfileName ] = useState(profile.profileApiName||"");
  const [ changeProfile, setChangeProfile ] = useState(false);

  useEffect(() => { // [config]
    if (profile.profileApiName) {
      setProfileName(profile.profileApiName);
    }
  },[config]);

  const saveProfile = () => {
    cbSaveProfile(profileName);
    setChangeProfile(false);
  };

  if (profile.useProfileApi) {
    return (
      <>
        <div className="input-group">
          <input type="text"
                 className="form-control"
                 placeholder={i18next.t("profile-name")}
                 value={profileName}
                 onChange={(e) => setProfileName(e.target.value)}
                 disabled={!changeProfile} />
          <button className="btn btn-secondary"
                  type="button"
                  title={i18next.t("profile-name-edit")}
                  onClick={() => setChangeProfile(true)}
                  disabled={changeProfile}>
            <img src="img/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("profile-name-edit")} />
          </button>
          <button className="btn btn-secondary"
                  type="button"
                  title={i18next.t("profile-name-save")}
                  onClick={saveProfile}
                  disabled={!changeProfile}>
            <img src="img/save_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("profile-name-save")} />
          </button>
        </div>
        <hr/>
      </>
    );
  }
}
