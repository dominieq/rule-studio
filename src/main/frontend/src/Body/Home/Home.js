import React from 'react';
import RuleWorkBox from "../../Utils/Containers/RuleWorkBox";
import logo from "./logo_transparent.png";
import "./Home.css";

function Home() {
    return (
        <RuleWorkBox id={"rule-work-home"} styleVariant={"body"}>
            <img src={logo} className={"rule-work-logo"} alt={"logo"} />
        </RuleWorkBox>
    );
}

export default Home;