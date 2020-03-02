import React from 'react';
import RuleWorkBody from "../../RuleWorkComponents/Surfaces/RuleWorkBody";
import "./Home.css";
import logo from "./logo_transparent.png";

function Home() {
    return (
        <RuleWorkBody id={"rule-work-home"} variant={"body"}>
            <img src={logo} className={"rule-work-logo"} alt={"logo"} />
        </RuleWorkBody>
    );
}

export default Home;