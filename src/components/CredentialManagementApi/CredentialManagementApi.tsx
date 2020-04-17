import React, { useState } from 'react';
import { getAuth2 } from '../../useGoogle';


export const CredentialManagementApi = () => {
  const [credential, setCredential] = useState('0x123...789');
  const [storedCredential, setStoredCredential] = useState<any>({});

  function ensurePasswordCredentialExist() {
    if (!(window as any).PasswordCredential) {
      return alert('Your Browser does not support PasswordCredential')
    }
  }
  
  async function storeCredential(profile: any) {
    ensurePasswordCredentialExist();
    const newCredential = new (window as any).PasswordCredential({
      id: profile.getEmail(),
      password: credential,
    })
    await window.navigator.credentials.store(newCredential);
    await showStoredCredential();
  }

  async function showStoredCredential() {
    ensurePasswordCredentialExist();
    const cred = await window.navigator.credentials.get({ password: true } as any);
    if (!cred) {
      return alert('No saved credentials');
    }
    setStoredCredential(cred);
  }

  return <>
    <h2> Credential Management API</h2>
    <label>Credential: </label><input value={credential} onChange={event => setCredential(event.target.value)} />
    <button onClick={() => storeCredential(getAuth2().currentUser.get().getBasicProfile())}>Store credential</button>
    <button onClick={showStoredCredential}>Show stored credentials</button>
    <br />
    <h3>Stored credential: </h3>
    <b>Id: </b> {storedCredential.id}
    <br />
    <b>Password:</b> {storedCredential.password}
  </>;
}