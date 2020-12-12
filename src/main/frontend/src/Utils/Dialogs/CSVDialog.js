import React from "react";
import PropTypes from "prop-types";
import StyledDialogContent from "./StyledDialogContent";
import { AcceptButton, CancelButton } from "../Buttons";
import CustomTextField from "../Inputs/CustomTextField";
import CustomTooltip from "../DataDisplay/CustomTooltip";
import StyledCheckbox from "../Inputs/StyledCheckbox";
import StyledPaper from "../Surfaces/StyledPaper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/CSVDialog.module.css";

const separators = [
    {
        label: "comma",
        value: ","
    },
    {
        label: "semicolon",
        value: ";"
    },
    {
        label: "space",
        value: " "
    },
    {
        label: "tab",
        value: "\t"
    }
];

/**
 * Allows user to choose properties for uploaded CSV file.
 * User can choose delimiter and check header.
 *
 * @constructor
 * @category Dialogs
 * @param {Object} props
 * @param {function} [props.onConfirm] - Callback fired when the dialog requests to be closed.
 * @param {boolean} props.open - If <code>true</code> the dialog will show up.
 * @returns {React.ReactElement}
 */
class CSVDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            header: false,
            separator: ","
        };
    }

    onHeaderChange = (event) => {
        this.setState({
            header: event.target.checked
        });
    };

    onSeparatorChange = (event) => {
        this.setState({
            separator: event.target.value
        });
    };

    onCancel = () => {
        this.props.onConfirm(null);
    };

    onConfirm = () => {
        const { header, separator } = this.state;

        this.props.onConfirm({ header, separator });
    };

    onEntering = () => {
        this.setState({
            header: false,
            separator: ","
        });
    };

    render() {
        const { header, separator } = this.state;
        const { open } = this.props;

        return (
            <Dialog
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onEntering={this.onEntering}
                maxWidth={"md"}
                open={open}
                PaperComponent={StyledPaper}
                PaperProps={{ className: styles.Paper }}
            >
                <DialogTitle>
                    Specify CSV attributes
                </DialogTitle>
                <StyledDialogContent className={styles.Content}>
                    <FormControlLabel
                        aria-label={"header checkbox"}
                        control={
                            <CustomTooltip
                                title={"File contains header row"}
                                WrapperComponent={'span'}
                            >
                                <StyledCheckbox
                                    checked={header}
                                    inputProps={{ "aria-label": "csv header checkbox" }}
                                    onChange={this.onHeaderChange}
                                />
                            </CustomTooltip>
                        }
                        label={"Header"}
                    />
                    <div aria-label={"separator selector"} className={styles.ContentRow}>
                        <CustomTextField
                            fullWidth={true}
                            onChange={this.onSeparatorChange}
                            outsideLabel={"Separator"}
                            select={true}
                            SelectProps={{
                                style: { textAlign: "left" }
                            }}
                            value={separator}
                        >
                            {separators.map((sep, index) => (
                                <MenuItem key={index} value={sep.value}>
                                    {sep.label}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </div>
                </StyledDialogContent>
                <DialogActions>
                    <CancelButton aria-label={"cancel-upload"} onClick={this.onCancel}/>
                    <AcceptButton aria-label={"confirm upload"} onClick={this.onConfirm}>
                        Confirm
                    </AcceptButton>
                </DialogActions>
            </Dialog>
        );
    }
}

CSVDialog.propTypes = {
    onConfirm: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default CSVDialog;
