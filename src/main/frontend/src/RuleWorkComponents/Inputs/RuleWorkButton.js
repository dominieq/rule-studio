import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import "./RuleWorkButton.css";

function UploadElement(props, ref)  {
    const {children, id, accept, onFileChanged, ...other} = props;

    return (
        <div ref={ref} id={"rule-work-upload-button"} {...other}>
            <input id={id} accept={accept} type={"file"} value={""} onChange={event => onFileChanged(event)} />
            <label htmlFor={id}>
                {children}
            </label>
        </div>
    )
}

const UploadElementForwardRef = React.forwardRef(UploadElement);

const useStylesButton = makeStyles({
    root: {
        minWidth: 0,
    }
});

function RuleWorkButton(props) {
    const {tooltipTitle, variant, uploadAccept, buttonLabel, content, onButtonClick} = props;
    const classesButton = useStylesButton();

    return (
        <Tooltip
            id={"rule-work-button-tooltip"}
            title={tooltipTitle}
            arrow={true}
        >
            {variant === "upload" ?
                <UploadElementForwardRef id={buttonLabel} accept={uploadAccept} onFileChanged={onButtonClick}>
                    <Button
                        aria-label={buttonLabel}
                        classes={{root: classesButton.root}}
                        color={"inherit"}
                        component={"span"}
                    >
                        {content}
                    </Button>
                </UploadElementForwardRef>
                :
                <Button
                    aria-label={buttonLabel}
                    classes={{root: classesButton.root}}
                    color={"inherit"}
                    onClick={onButtonClick}
                >
                    {content}
                </Button>
            }
        </Tooltip>
    )
}

RuleWorkButton.propTypes = {
    tooltipTitle: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["default", "upload"]),
    uploadAccept: PropTypes.string,
    buttonLabel: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    onButtonClick: PropTypes.func.isRequired,
};

RuleWorkButton.defaultProps = {
    variant: "default",
    uploadAccept: "*",
};

export default RuleWorkButton;