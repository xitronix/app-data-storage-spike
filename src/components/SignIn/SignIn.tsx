import React from 'react';
import './SignIn.css';
import { getGapi } from '../../useGoogle';
import GoogleIcon from './GoogleIcon.svg';

async function handleCredentials(profile: any) {
  if (!(window as any).PasswordCredential) {
    return alert('Your Browser does not support PasswordCredential')
  }
  const credential = await window.navigator.credentials.get({ password: true } as any);
  if (credential) {
    return;
  }
  const newCredential = new (window as any).PasswordCredential({
    id: profile.getEmail(),
    password: 'privateKey from PasswordManager'
  })
  await window.navigator.credentials.store(newCredential);
}

export interface ISignIn {
  onSuccess: (name: string, accessToken: string) => void;
  onFailure?: () => void;
}

export const SignIn = ({ onSuccess, onFailure }: ISignIn) => {

  async function signIn() {
    const googleUser = await getGapi().auth2.getAuthInstance().signIn();
    await handleCredentials(googleUser.getBasicProfile());
    onSuccess(
      googleUser.getBasicProfile().getName(),
      getGapi().auth.getToken().access_token,
    );
  }

  return <div className="sign-in-container">
    <h1>Sign with google</h1>
    <button id="sign-in-button" onClick={() => signIn()}>
      <div className="sign-in-button-container">
        <img src={GoogleIcon} alt='' />
        <div className="sign-in-text">Login with Google</div>
      </div>
    </button>
  </div>
};
