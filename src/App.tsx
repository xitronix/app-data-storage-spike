import React, { useState } from 'react';
import './App.css';
import { useGoogle, getGapi } from './useGoogle';
import { SignIn } from './components/SignIn/SignIn';

const fetchSaveToDrive = (fileContent: string, accessToken: string, name = 'UniFetchFile') => {
  const file = new Blob([fileContent], { type: 'text/plain' });
  const metadata = {
    name,
    'mimeType': 'text/plain', // mimeType at Google Drive
    'parents': [], // Folder ID at Google Drive
  };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form,
  }).then((res) => {
    return res.json();
  }).then(function (val) {
    console.log(val);
  });
}

async function listAppDataFolder() {
  try {
    const { result } = await getDrive().files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name, appProperties)',
    });
    result.files.forEach((file: any) => {
      console.log('Found file:', file, file.name, file.id);
    });
  } catch (err) {
    console.error(err);
  }
}

async function savePrivateKeyAsAppData(privateKey: string, name = 'UniLoginData') {
  try {
    const { result } = await getDrive().files.create({
      resource: {
        mimeType: 'application/json',
        name,
        parents: ['appDataFolder'],
        appProperties: {
          privateKey,
          rand: Math.random() * 1000
        },
        // id: '1bC-jAhNsj6p6Hfj_0M2176MePOGSbDWmmzEesfob75mwStym2A'
      },
      fields: 'id',
    }).getPromise();
    console.log('Folder Id:', result.id);
  } catch ({ result }) {
    console.error(result);
  }
}

async function fileOperation(operation: 'delete' | 'get', fileId: string | undefined) {
  if (!fileId) {
    return alert('Please enter file id');
  }
  try {
    const {result} = await getDrive().files[operation]({ 
      fileId,
      fields: 'id, appProperties, name'
    })
    console.log('Result:', result)
  } catch (err) {
    console.error('Error', err.result || err)
  }
}

function getDrive() {
  return getGapi().client.drive;
}

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState<string | undefined>(undefined);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [instanceName, setInstanceName] = useState<string | undefined>(undefined);
  const [value, setValue] = useState('');
  const [privateKey, setPrivateKey] = useState('0x123...789');

  const onSignInSuccess = (name: string, accessToken: string) => {
    setUser(name);
    setAccessToken(accessToken);
    setIsSignedIn(getGapi().auth2.getAuthInstance().isSignedIn.get());
  }

  useGoogle();

  return (
    <div className="App">
      {!isSignedIn ? <SignIn onSuccess={onSignInSuccess} /> : <>
          <h1>Hello, {user}</h1>
          <div className="buttons" >
            <h2> Create </h2>
              <label>Value: </label><input value={value} onChange={event => setValue(event.target.value)} />
              <button onClick={() => fetchSaveToDrive(value, accessToken!, instanceName)}>Save string on your drive</button>
            <div>
              <h2> Application-specific data</h2>
              <label>Id: </label><input value={id} onChange={event => setId(event.target.value)} /> <br />
              <label>Instance name: </label><input value={instanceName} onChange={event => setInstanceName(event.target.value)} /> <br />
              <label>Private Key: </label><input value={privateKey} onChange={event => setPrivateKey(event.target.value)} />
              <br />
              <button onClick={() => savePrivateKeyAsAppData(privateKey)}>Save private key</button>
              <button onClick={listAppDataFolder}>List App Data Folder</button>
              <button onClick={() => fileOperation('delete', id)}>Delete file by id</button>
              <button onClick={() => fileOperation('get', id)}>Get file by id</button>
            </div>
            <button onClick={async () => {
              const auth2 = getGapi().auth2.getAuthInstance();
              await auth2.signOut().then(auth2.disconnect().then(() => setIsSignedIn(false)));
            }}>Sing out</button>
          </div>
        </>}
    </div>
  );
}

export default App;
