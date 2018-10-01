import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Jumbotron,
} from 'reactstrap';

import { ServiceBaseService } from './services/service-base/service-base.service';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sTwitterUsername: '',
        };

        this.mBaseService = new ServiceBaseService();

        // TODO: can we .bind(this) when passing in component?
        this.fHandleArrayChange = this.fHandleArrayChange.bind(this);
        this.fHandleChange = this.fHandleChange.bind(this);
        this.fHandleTwitterUsernameSubmission = this.fHandleTwitterUsernameSubmission.bind(this);
    }

    // currently, can only handle changing one property on an object
    // that object is within some array
    // sArr must be on this.state
    fHandleArrayChange(e, i, sArr) {
        const arr = this.state[sArr];
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const oNew = arr[i];

        oNew[name] = value;
        arr[i] = oNew;

        this.setState({
            sArr: arr,
        });
    }

    fHandleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    async fHandleTwitterUsernameSubmission(e) {
        e.preventDefault()

        const oResult = await this.mBaseService.fpPost('tweet', {
            bAsRawResponse: true,
            oRequestBody: {
                sTwitterUsername: this.state.sTwitterUsername,
            }
        });

        if (oResult.sLatestTweetText) {
            this.setState({
                sLatestTweetText: oResult.sLatestTweetText,
            });
        } else { 
            this.setState({
                sLatestTweetText: oResult.result,
            });
        }
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Tweet to Dynamo</h1>
        </header>

        <Jumbotron style={{
            background: `linear-gradient(to bottom, rgba(97, 218, 251, 0), rgba(97, 218, 251, 0.05)),
                radial-gradient(circle at 51% 47%, rgba(97, 218, 251, 0.5), rgba(225, 229, 245, 0.5))`
        }}>
            <p className="App-intro">
                Enter in a Twitter username and submit to get that user's latest tweet!
            </p>
            <Form className="row" onSubmit={e => this.fHandleTwitterUsernameSubmission(e)} >
                    <div className="offset-4" />
                    <input className="col-2"
                        name="sTwitterUsername"
                        onChange={e => this.fHandleChange(e)}
                        placeholder="Twitter Username"
                        type="text"
                        value={this.state.sTwitterUsername}
                    />
                    <Button className="col-2" style={{ marginLeft: 20 }} type="submit">
                        <span className="icon ion-md-log-out mr-1" /> Get Latest Tweet
                    </Button>
            </Form>
        </Jumbotron>

        <p id="twitter-username-output">
            Last tweet taken from Twitter user: { this.state.sTwitterUsername }
        </p>
        <p>
            Tweet text: { this.state.sLatestTweetText }
        </p>
      </div>
    );
  }
}

export default App;
