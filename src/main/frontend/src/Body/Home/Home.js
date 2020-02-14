import React from 'react';
import logo from "./logo_transparent.png";

function Home(props) {
    return (
        <div className={"App-body"}>
            <img src={logo} className={"App-logo"} alt={"logo"} />
        </div>
    );
}

export default Home;