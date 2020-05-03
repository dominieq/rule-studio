import React from 'react';
import PropTypes from "prop-types";
import RuleWorkBox from "../../Utils/Containers/RuleWorkBox";
import logoDark from "./resources/logo_transparent_dark.png";
import logoLight from "./resources/logo_transparent_light.png";
import styles from "./styles/Home.module.css";

function Home(props) {
    const { isDarkTheme } = props;

    return (
        <RuleWorkBox id={"home"} styleVariant={"body"}>
            <img
                alt={"logo"}
                className={styles.Logo}
                src={isDarkTheme ? logoDark : logoLight}
            />
        </RuleWorkBox>
    );
}

Home.propTypes = {
    isDarkTheme: PropTypes.bool
};

Home.defaultProps = {
    isDarkTheme: true
};

export default Home;