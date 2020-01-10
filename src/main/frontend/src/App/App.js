import React from 'react';
import logo from "./logo_transparent.png"
import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <div className={"App-header"}>

                </div>
                <div className={"App-body"}>
                    <img src={logo} className={"App-logo"} alt={"logo"} />
                </div>
            </div>
        );
    }
}

export default App;
