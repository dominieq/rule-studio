import React from 'react';
import PropTypes from "prop-types";
import { Footer, NavigateButton } from "./Elements";
import CustomBox from "../../Utils/Containers/CustomBox";
import logoDark from "./resources/logo_transparent_dark.png";
import logoLight from "./resources/logo_transparent_light.png";
import styles from "./styles/Home.module.css";

/**
 * <h3>Overview</h3>
 * The Home section in RuLeStudio. It consists of a main box and a footer.
 * There are two navigate buttons on both of sides of a logo.
 * The one on the left is navigating to the {@link Import} section.
 * On the other hand, the right one navigates to the {@link Help} section.
 * There is a list of authors in the footer as well as a button linking to GitHub repository.
 *
 * @constructor
 * @category Home
 * @param {Object} props
 * @param {function} props.goToHelp - Callback fired when user requests to go to the {@link Help} section.
 * @param {function} props.goToNewProject - Callback fired when user requests to go to the {@link Import} section.
 * @param {boolean} [props.isDarkTheme = true] - If <code>true</code> the green logo will be used. Otherwise blue logo is used.
 * @returns {React.ReactElement}
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
    goToHelp: PropTypes.func,
    goToNewProject: PropTypes.func,
    isDarkTheme: PropTypes.bool
};

Home.defaultProps = {
    isDarkTheme: true
};

export default Home;
