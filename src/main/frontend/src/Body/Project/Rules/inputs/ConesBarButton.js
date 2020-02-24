import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import "./ConesBarButton.css";

function UploadElement(props, ref)  {
    const {children, onFileChanged, ...other} = props;

    return (
        <div ref={ref} {...other}>
            <input id={"upload-button"} type={"file"} onChange={event => onFileChanged(event)}/>
            <label htmlFor={"upload-button"}>
                {children}
            </label>
        </div>
    )
}

const UploadElementForward = React.forwardRef(UploadElement);

function ConesBarButton(props) {
    const {variant, title, label, icon} = props;

    return (
        <Tooltip title={title}>
            {variant === "upload" ?
                <UploadElementForward onFileChanged={props.onButtonClick}>
                    <Button aria-label={label} component={"span"}>
                        {icon}
                    </Button>
                </UploadElementForward>
                :
                <Button aria-label={label} onClick={props.onButtonClick}>
                    {icon}
                </Button>
            }
        </Tooltip>
    )
}

ConesBarButton.propTypes = {
    variant: PropTypes.oneOf(["default", "upload"]),
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    onButtonClick: PropTypes.func.isRequired,
};

ConesBarButton.defaultProps = {
    variant: "default",
};

export default ConesBarButton;