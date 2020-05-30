import React from 'react';
import PropTypes from "prop-types";
import { Footer, NavigateButton } from "./Elements";
import CustomBox from "../../Utils/Containers/CustomBox";
import logoDark from "./resources/logo_transparent_dark.png";
import logoLight from "./resources/logo_transparent_light.png";
import styles from "./styles/Home.module.css";

/**
 * The Home page in RuLeStudio application. It consists of a main box and a footer.
 * There are two navigate buttons on both of sides of a logo. The one on the left is navigating to the New Project page.
 * On the other hand, the right one navigates to the Help page. There is a list of authors in the footer as well as
 * a button linking to GitHub repository.
 * @param {object} props
 * @param {function} props.goToHome A function that is going to be forwarded to onClick event in the right NavigateButton.
 * It should open the Help page.
 * @param {function} props.goToNewProject A function that is going to be forwarded to onClick event in the left NavigateButton.
 * It should open the New Project page.
 * @param {boolean} props.isDarkTheme A value that determines whether a blue or green logo should be displayed.
 * @returns {React.Fragment}
 * @constructor
 */
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
    /**
     * A function that is going to be forwarded to onClick event in the right NavigateButton.
     * It should open the Help page.
     */
    goToHelp: PropTypes.func,
    /**
     * A function that is going to be forwarded to onClick event in the left NavigateButton.
     * It should open the New Project page.
     */
    goToNewProject: PropTypes.func,
    /**
     * A value that determines whether a blue or green logo should be displayed.
     */
    isDarkTheme: PropTypes.bool
};

Home.defaultProps = {
    isDarkTheme: true
};

export default Home;
