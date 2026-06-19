import React, { useState, useEffect } from 'react';

export default function SortIcon({column, asc}) {
  if (column) {
    if (asc) {
      return (
        <img src="img/arrow_drop_up_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
      );
    } else {
      return (
        <img src="img/arrow_drop_down_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
      );
    }
  }
}
