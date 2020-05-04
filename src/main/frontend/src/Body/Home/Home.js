import React from 'react';
import PropTypes from "prop-types";
import CustomBox from "../../Utils/Containers/CustomBox";
import logoDark from "./resources/logo_transparent_dark.png";
import logoLight from "./resources/logo_transparent_light.png";
import styles from "./styles/Home.module.css";

function Home(props) {
    const { isDarkTheme } = props;

    return (
        <CustomBox id={"home"} styleVariant={"body"}>
            <img
                alt={"logo"}
                className={styles.Logo}
                src={isDarkTheme ? logoDark : logoLight}
            />
        </CustomBox>
    );
}

Home.propTypes = {
    isDarkTheme: PropTypes.bool
};

Home.defaultProps = {
    isDarkTheme: true
};

export default Home;