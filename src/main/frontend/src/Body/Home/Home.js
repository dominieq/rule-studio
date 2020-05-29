import React from 'react';
import PropTypes from "prop-types";
import { Footer, NavigateButton } from "./Elements";
import CustomBox from "../../Utils/Containers/CustomBox";
import logoDark from "./resources/logo_transparent_dark.png";
import logoLight from "./resources/logo_transparent_light.png";
import styles from "./styles/Home.module.css";

function Home(props) {
    const { isDarkTheme } = props;

    return (
        <React.Fragment>
            <CustomBox id={"home"} variant={"Body"}>
                <NavigateButton
                    id={"navigate-new-project"}
                    introText={"In order to start, create a"}
                    onClick={props.goToNewProject}
                    buttonText={"new project."}
                    tooltipText={"Click to create new project."}
                />
                <img
                    alt={"logo"}
                    className={styles.Logo}
                    src={isDarkTheme ? logoDark : logoLight}
                />
                <NavigateButton
                    id={"navigate-help"}
                    introText={"If you don't know what to do, go to"}
                    onClick={props.goToHelp}
                    buttonText={"help."}
                    tooltipText={"Click to open help page."}
                />
            </CustomBox>
            <Footer />
        </React.Fragment>
    );
}

Home.propTypes = {
    goToHelp: PropTypes.func,
    goToNewProject: PropTypes.func,
    isDarkTheme: PropTypes.bool
};

Home.defaultProps = {
    isDarkTheme: true
};

export default Home;
