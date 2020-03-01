import React from 'react';
import PropTypes from 'prop-types';
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

function RuleWorkButton(props) {
    const {tooltipTitle, variant, uploadAccept, buttonLabel, content, onButtonClick} = props;

    return (
        <Tooltip id={"rule-work-button-tooltip"} title={tooltipTitle}>
            {variant === "upload" ?
                <UploadElementForwardRef id={buttonLabel} accept={uploadAccept} onFileChanged={onButtonClick}>
                    <Button
                        aria-label={buttonLabel}
                        component={"span"}
                        color={"inherit"}
                    >
                        {content}
                    </Button>
                </UploadElementForwardRef>
                :
                <Button
                    aria-label={buttonLabel}
                    onClick={onButtonClick}
                    color={"inherit"}
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