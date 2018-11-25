/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import * as UserPrefs from './UserPrefs';
import mockFetch from './Mock';

const Config = require('Config');

function cortexFetch(input, init) {
  const requestInit = init;
  const { pathForProxy } = Config.cortexApi;
  let { path } = Config.cortexApi;

  if (requestInit && requestInit.headers) {
    requestInit.headers['x-ep-user-traits'] = `LOCALE=${UserPrefs.getSelectedLocaleValue()}, CURRENCY=${UserPrefs.getSelectedCurrencyValue()}`;
  }

  if (Config.enableOfflineMode) {
    return mockFetch(input, requestInit);
  }

  // Added by Newell: temporarily use the pathForProxy key as api domain.
  if (pathForProxy) {
    path = `${pathForProxy}${path}`;
  }

  // return fetch(`${Config.cortexApi.path + input}`, requestInit);

  // Added by Newell: force auth_token to request params
  const token = localStorage.getItem(`${Config.cortexApi.scope}_oAuthToken`);
  if (token) {
    // console.log(`${path + input}&auth_token=${token.split(' ').pop()}`, requestInit);
    return fetch(`${path + input}&auth_token=${token.split(' ').pop()}`, requestInit);
  }

  return fetch(path + input, requestInit);

  /* return fetch(`${Config.cortexApi.path + input}`, requestInit)
    .then((res) => {
      if (res.status === 504 || res.status === 503) {
        if (window.location.href.indexOf('/maintenance') === -1) {
          window.location.pathname = '/maintenance';
        }
      }
      return res;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }); */
}

export default cortexFetch;
