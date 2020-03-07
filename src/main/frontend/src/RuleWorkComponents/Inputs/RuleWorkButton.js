import React from 'react';
import PropTypes from 'prop-types';
import StyledButton from "./StyledButton";
import Tooltip from "@material-ui/core/Tooltip";
import "./RuleWorkButton.css";

function UploadElement(props, ref)  {
    const {children, id, accept, onChange, ...other} = props;

    return (
        <div id={"rule-work-upload-button"} ref={ref} {...other}>
            <input accept={accept} id={id} onChange={onChange} type={"file"} value={""} />
            <label htmlFor={id}>
                {children}
            </label>
        </div>
    )
}

const UploadForwardRef = React.forwardRef(UploadElement);

function DefaultElement(props, ref) {
    const {children, ...other} = props;
    return (
        <div ref={ref} {...other}>
            {children}
        </div>
    )
}

const DefaultForwardRef = React.forwardRef(DefaultElement);

function RuleWorkButton(props) {
    const {children, accept, ariaLabel, isUpload, onClick, title, ...other} = props;

    return (
        <Tooltip id={"rule-work-button-tooltip"} title={title} arrow={true}>
            {isUpload ?
                <UploadForwardRef id={ariaLabel} accept={accept} onChange={onClick}>
                    <StyledButton
                        {...ariaLabel ? {'aria-label': ariaLabel} : null}
                        component={"span"}
                        {...other}
                    >
                        {children}
                    </StyledButton>
                </UploadForwardRef>
                :
                <DefaultForwardRef>
                    <StyledButton
                        {...ariaLabel ? {'aria-label': ariaLabel} : null}
                        onClick={onClick}
                        {...other}
                    >
                        {children}
                    </StyledButton>
                </DefaultForwardRef>
            }
        </Tooltip>
    )
}

RuleWorkButton.propTypes = {
    children: PropTypes.node,
    accept: PropTypes.string,
    ariaLabel: PropTypes.string,
    buttonVariant: PropTypes.oneOf(["text", "outlined", "contained", "icon"]),
    isUpload: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    styleVariant: PropTypes.oneOf(["inherit", "green", "red"]),
    title: PropTypes.string.isRequired,
};

RuleWorkButton.defaultProps = {
    accept: "*",
    buttonVariant: "text",
    isUpload: false,
    styleVariant: "inherit",
};

export default RuleWorkButton;