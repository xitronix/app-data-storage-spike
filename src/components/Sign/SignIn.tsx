import React from 'react';
import './SignIn.css';
import { getGapi } from '../../useGoogle';
import GoogleIcon from './GoogleIcon.svg';


export interface ISignInButton {
  onSuccess: (name: string, accessToken: string) => void;
  onFailure?: () => void;
}

export const SignInWithGoogle = ({ onSuccess }: ISignInButton) => {
  return <div className="sign-in-container">
    <h1>Sign with google</h1>
    <SignInButton onSuccess={onSuccess} />
  </div>
};

interface ISignButton {
  onClick: () => void;
  value: string;
}

const SignButtton = ({ onClick, value }: ISignButton) => (
  <button id="sign-in-button" onClick={onClick}>
    <div className="sign-in-button-container">
      <img src={GoogleIcon} alt='' />
      <div className="sign-in-text">{value}</div>
    </div>
  </button>);


export const SignInButton = ({ onSuccess }: ISignInButton) => {
  async function signIn() {
    const googleUser = await getGapi().auth2.getAuthInstance().signIn();
    onSuccess(
      googleUser.getBasicProfile().getName(),
      getGapi().auth.getToken().access_token,
    );
  }

  return <SignButtton onClick={signIn} value="Login with Google" />
}

export interface ISignOutButton {
  onSuccess: () => void;
  onFailure?: () => void;
}

export const SignOutButton = ({ onSuccess }: ISignOutButton) => {
  async function onClick() {
    const auth2 = getGapi().auth2.getAuthInstance();
    await auth2.signOut().then(auth2.disconnect().then(() => onSuccess()))
  }
  return <SignButtton onClick={onClick} value="Sing out" />
}
