import { useEffect, useState } from 'react';
import loadScript from "./load-script";
import removeScript from './remove-script';

export function getGapi() {
  return gapi as any;
}


const GOOGLE_CLIENT_ID = '935123975864-lof3d1u5e77lo5rr07412vtu8i3m4a3a.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB72cfCUB9Thdxnba0_JZLpytyweN2alUg';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata'; //https://www.googleapis.com/auth/drive


export const useGoogle = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loadScript(document, 'script', 'google-api', 'https://apis.google.com/js/api.js', async () => {
      // const params = {
      //   cookie_policy: cookiePolicy,
      //   login_hint: loginHint,
      //   hosted_domain: hostedDomain,
      //   fetch_basic_profile: fetchBasicProfile,
      //   ux_mode: uxMode,
      //   redirect_uri: redirectUri,
      //   access_type: accessType
      // }

      getGapi().load('client:auth2', async () => {
        await getGapi().client.init({
          apiKey: API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        });
        setLoaded(true)
      })
    })

    return () => {
      removeScript(document, 'google-api')
    }
  }, []);
  return [loaded];
}
