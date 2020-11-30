import React from "react";
import PropTypes from "prop-types";
import CustomPopper from "../../Utils/Surfaces/CustomPopper";
import CustomTooltip from "../../Utils/DataDisplay/CustomTooltip";
import { StyledIconButton } from "../../Utils/Inputs/StyledButton";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FileQuestion from "mdi-material-ui/FileQuestion";
import {fetchProjectDetails} from "../../Utils/utilFunctions/fetchFunctions";

function Wrapper(props) {
    const { component, ...other } = props;

    return React.createElement(component, {...other});
}

Wrapper.propTypes = {
    component: PropTypes.elementType.isRequired
};

// To get unblurred tooltip text in Google Chrome
const disableGPUOptions = {
    modifiers: {
        computeStyle: {
            enabled: true,
            gpuAcceleration: false
        }
    }
};

/**
 * Presents files that are used in current project.
 * Idea for a composition was taken from this
 * <a href="https://material-ui.com/components/button-group/#split-button" target="_blank">tutorial</a>.
 *
 * @constructor
 * @category Header
 * @subcategory Elements
 * @param {Object} props
 * @param {boolean} props.disableGpu - If <code>true</code> tooltip text will be unblurred in Google Chrome.
 * @param {function} props.onSnackbarOpen - Callback fired when the component requests to display an error.
 * @param {string} props.projectId - The identifier of a selected project.
 * @param {string} props.serverBase - The host and port in the URL of an API call.
 * @param {React.ElementType} - props.WrapperComponent - The HTML element that will be used as a Wrapper.
 * @param {Object} props.WrapperProps - The props applied to the Wrapper element.
 * @returns{React.PureComponent}
 */
class FilesDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            files: []
        };

        this.anchorRef = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.open && this.state.open) {
            this.getProjectDetails();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getProjectDetails = () => {
        this.setState({
            files: [{label: "Loading details"}]
        }, () => {
            const { projectId, serverBase } = this.props;
            const pathParams = { projectId };

            fetchProjectDetails(
                pathParams, serverBase
            ).then(result => {
                if (this._isMounted && result != null) {
                    let files = []

                    if (result.hasOwnProperty("metadataFileName"))
                        files.push({ label: "Metadata", value: result.metadataFileName });

                    if (result.hasOwnProperty("dataFileName"))
                        files.push({ label: "Data", value: result.dataFileName });

                    if (result.hasOwnProperty("rulesFileName"))
                        files.push({ label: "Rules", value: result.rulesFileName });

                    if (result.hasOwnProperty("externalClassifiedDataFileName"))
                        files.push({ label: "Classified external data", value: result.externalClassifiedDataFileName });

                    this.setState({ files: files });
                }
            }).catch(exception => {
                this.props.onSnackbarOpen(exception);
            }).finally(() => {
                if (this._isMounted) {
                    this.setState(({files}) => {
                        if (files.length === 1 && files[0].hasOwnProperty("label")
                            && files[0].label === "Loading details") {

                            return { files: [{label: "Error when fetching details"}]};
                        }

                        return { files };
                    });
                }
            });
        });
    };

    onToggleButtonClick = () => {
        this.setState(({open}) => ({
            open: !open
        }));
    };

    onPopperClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({
            open: false
        });
    };

    render() {
        const { open, files } = this.state;
        const { disableGPU, WrapperComponent, WrapperProps } = this.props;

        return (
            <Wrapper component={WrapperComponent} {...WrapperProps}>
                <CustomTooltip title={"Show project's files details"}>
                    <StyledIconButton
                        aria-controls={open ? 'files-details' : undefined}
                        aria-expanded={open ? true : undefined}
                        aria-label={"files-details-button"}
                        aria-haspopup={"menu"}
                        ButtonRef={this.anchorRef}
                        onClick={this.onToggleButtonClick}
                    >
                        <FileQuestion />
                    </StyledIconButton>
                </CustomTooltip>
                <Popper
                    anchorEl={this.anchorRef.current}
                    aria-label={"files-details"}
                    open={open}
                    popperOptions={disableGPU ? disableGPUOptions : undefined}
                    role={undefined}
                    style={{zIndex: 2000}}
                    transition={true}
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <CustomPopper style={{outline: "none"}}>
                                <ClickAwayListener onClickAway={this.onPopperClose}>
                                    <List>
                                        {files.map((file, index) => (
                                            <ListItem
                                                key={index}
                                                divider={index < files.length - 1}
                                            >
                                                <ListItemText
                                                    primary={file.label}
                                                    secondary={file.value}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </ClickAwayListener>
                            </CustomPopper>
                        </Grow>
                    )}
                </Popper>
            </Wrapper>
        );
    };
}

FilesDetails.propTypes = {
    disableGPU: PropTypes.bool,
    onSnackbarOpen: PropTypes.func,
    projectId: PropTypes.string,
    serverBase: PropTypes.string,
    WrapperComponent: PropTypes.elementType,
    WrapperProps: PropTypes.object
};

FilesDetails.defaultProps = {
    disableGPU: true,
    WrapperComponent: "div"
};

export default FilesDetails;
