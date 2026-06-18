import React, { useState, useEffect } from 'react';

export default function BrowseDir({item, cbOpenDir}) {
  return (
    <tr onClick={() => cbOpenDir(item.title)} className="clickable">
      <td>
        {item.title}
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
        <span className="badge text-bg-secondary rounded-pill pull-right">
          <img src="img/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
      </td>
    </tr>
  );
}
