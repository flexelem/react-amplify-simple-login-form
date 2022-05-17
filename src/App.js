import './App.css';
import React, { useState } from 'react'
import Amplify, {Auth} from 'aws-amplify';
import { Navigate } from 'react-router-dom';

Amplify.configure({
  Auth: {

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_USERPOOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_USERPOOL_WEB_CLIENT_ID,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
});

function App(props) {
  const [isVerifyStep, setIsVerifyStep] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [userFormFields, setUserFormFields] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    setUserFormFields({...userFormFields, [event.target.name]: event.target.value});
  }

  async function handleLogIn(event) {
    event.preventDefault();
    const password = userFormFields.password;
    const email = userFormFields.email;
    try {
      const user = await Auth.signIn(email, password);
      setUserLoggedIn(true);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    const password = userFormFields.password;
    const email = userFormFields.email;
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email: email,
          // family_name: 'foobar',
          // 'custom:tenant_id': '1234567890',
          // 'custom:created_at': '2022-01-01',
          // 'custom:employee_id': '10',
          // 'custom:is_admin': false,
        },
      });
      setIsVerifyStep(true);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  async function handleVerifyCode(event) {
    event.preventDefault();
    const email = userFormFields.email;
    try {
      const result = await Auth.confirmSignUp(email, verifyCode);
      setIsVerifyStep(false);
    } catch (error) {
      console.log('error at verify code step');
    }
  }

  if (userLoggedIn) {
    return <Navigate to="/dashboard" replace={true} />
  }

  return (
      <div className="container">
        {!isVerifyStep ?
            <form>
              <h1>Signup</h1>
              <div className="ui divider"></div>
              <div className="ui form">
                <div className="field">
                  <label>Email</label>
                  <input type="text" value={userFormFields.email} onChange={handleChange} name="email" placeholder="Email"/>
                </div>

                <div className="field">
                  <label>Password</label>
                  <input type="password" value={userFormFields.password} onChange={handleChange} name="password" placeholder="Password"/>
                </div>
                <button onClick={handleSignUp} className="fluid ui button blue">Submit</button>
              </div>
              <div className="ui divider"></div>
              <div>
                <button onClick={handleLogIn} className="fluid ui button blue">Log In</button>
              </div>
            </form>
            :
            <form>
              <div className="ui form">
                <div className="field">
                  <label>Verify Code</label>
                  <input type="text" value={verifyCode} onChange={e => setVerifyCode(e.target.value)} name="verifyCode" placeholder="code"/>
                </div>
                <button onClick={handleVerifyCode} className="fluid ui button blue">Submit</button>
              </div>
            </form>
        }
      </div>
  );
}

export default App;
