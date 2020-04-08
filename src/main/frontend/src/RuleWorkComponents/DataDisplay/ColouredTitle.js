import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const titleStyles = makeStyles(theme => ({
    element: {
        height: "fit-content",
        width: "fit-content",
    },
    flexBox: {
        display: "flex",
        alignItems: "center",
        '& > div:first-child': {
            marginRight: 4,
        },
    },
    primary: {
        color: theme.palette.button.primary,
    },
    secondary: {
        color: theme.palette.button.secondary,
    }
}), {name: "coloured-title"});


function ColouredTitle(props) {
    const { text } = props;
    const titleClasses = titleStyles();

    return (
        <Fragment>
            {text.map((element, index) => (
                <Fragment key={index}>
                    {Object.keys(element).length === 2 &&
                        <div id={"flex-box-" + index} className={titleClasses.flexBox}>
                            <div
                                id={"element-primary-" + index}
                                className={clsx(titleClasses.element, titleClasses.primary)}
                            >
                                {element.primary}
                            </div>
                            <div
                                id={"element-secondary-" + index}
                                className={clsx(titleClasses.element, titleClasses.secondary)}
                            >
                                {element.secondary}
                            </div>
                        </div>
                    }
                    {Object.keys(element).length === 1 &&
                        <div
                            id={"element-" + Object.keys(element)[0] + "-" + index}
                            className={clsx(titleClasses.element, titleClasses[Object.keys(element)[0]])}
                        >
                            {element[Object.keys(element)[0]]}
                        </div>
                    }
                </Fragment>
            ))}
        </Fragment>
    )
}

ColouredTitle.propTypes = {
    text: PropTypes.arrayOf(
        PropTypes.shape({
            primary: PropTypes.string,
            secondary: PropTypes.string,
        }).isRequired
    )
};

export default ColouredTitle;