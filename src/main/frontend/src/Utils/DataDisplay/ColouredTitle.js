import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const titleStyles = makeStyles(theme => ({
    element: {
        minWidth: "fit-content",
    },
    flexBox: {
        display: "flex",
        alignItems: "center",
        '& > div:first-of-type': {
            marginRight: 4,
        },
    },
    primary: {
        color: theme.palette.text.main1,
    },
    secondary: {
        color: theme.palette.text.special1,
    }
}), {name: "coloured-title"});


/**
 * <h3>Overview</h3>
 * Displays a list of primary-secondary elements. Applies custom colours and optional brackets.
 *
 * @constructor
 * @category Utils
 * @subcategory Data Display
 * @param {Object} props
 * @param {Object[]} props.text - The list of objects that represent to be rendered nodes.
 * @param {number|string} [props.text[].primary] - An element that will be coloured with primary colour.
 * @param {number|string} [props.text[].secondary] - An element that will be coloured with secondary colour.
 * @param {boolean} [props.text[].brackets] - If <code>true</code> brackets will be added before and after a node.
 * @param {function} [props.text[].toString] - Returns a string that represents current object.
 * @returns {React.ReactElement}
 */
function ColouredTitle(props) {
    const { text } = props;
    const titleClasses = titleStyles();

    const AND = (a, b) => {
        return a && b;
    };

    const XOR = (a, b) => {
        return (a || b) && !(a && b);
    };

    return (
        <Fragment>
            {text.map((element, index) => (
                <Fragment key={index}>
                    {AND(Object.keys(element).includes("primary"), Object.keys(element).includes("secondary")) &&
                        <div id={"flex-box-" + index} className={titleClasses.flexBox}>
                            {element.brackets &&
                                <span className={titleClasses.primary}>(</span>
                            }
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
                            {element.brackets &&
                                <span className={titleClasses.primary}>)</span>
                            }
                        </div>
                    }
                    {XOR(Object.keys(element).includes("primary"), Object.keys(element).includes("secondary")) &&
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
            primary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            secondary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            brackets: PropTypes.bool,
            toString: PropTypes.func,
        }).isRequired
    )
};

export default ColouredTitle;
