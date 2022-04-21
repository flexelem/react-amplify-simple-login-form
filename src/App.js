import './App.css';
import React from 'react'
import Amplify, { Auth } from 'aws-amplify';

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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVerifyStep: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleVerifyCode = this.handleVerifyCode.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async signUp(event) {
    event.preventDefault();
    const password = this.state.password;
    const email = this.state.email;
    console.log(`password ${password}  email: ${email}`);
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email: email,
          family_name: 'foobar',
          'custom:tenant_id': '1234567890',
          'custom:created_at': '2022-01-01',
          'custom:employee_id': '10',
          'custom:is_admin': false,
        },
      });
      console.log(user);
      this.setState({
        isVerifyStep: true
      });
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  handleSubmit(event) {
    console.log(this.state);
    const password = this.state.password;
    const email = this.state.email;
    console.log(`password ${password}  email: ${email}`);

    event.preventDefault();
  }

  async handleVerifyCode(event) {
    event.preventDefault();
    console.log(this.state);
    const email = this.state.email;
    const verifyCode = this.state.verifyCode;
    const result = await Auth.confirmSignUp(this.state.email, verifyCode);

    console.log('printing confirm result');
    console.log(result);
  }

  render() {
    return (
        <div className="container">
          {!this.state.isVerifyStep ?
            <form>
              <h1>Registration Form</h1>
              <div className="ui divider"></div>
              <div className="ui form">
                <div className="field">
                  <label>Email</label>
                  <input type="text" value={this.state.email} onChange={this.handleChange} name="email"
                         placeholder="Email"/>
                </div>

                <div className="field">
                  <label>Password</label>
                  <input type="password" value={this.state.password} onChange={this.handleChange} name="password"
                         placeholder="Password"/>
                </div>
                <button onClick={this.signUp} className="fluid ui button blue">Submit</button>
              </div>
            </form>
              :
              <form>
                <div className="ui form">
                  <div className="field">
                    <label>Verify Code</label>
                    <input type="text" value={this.state.verifyCode} onChange={this.handleChange} name="verifyCode" placeholder="code"/>
                  </div>
                  <button onClick={this.handleVerifyCode} className="fluid ui button blue">Submit</button>
                </div>
              </form>
          }
        </div>
    );
  }
}

export default App;
