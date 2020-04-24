import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import RuleWorkTextField from "../../Inputs/RuleWorkTextField";
import StyledButton from "../../Inputs/StyledButton";
import StyledCheckbox from "../../Inputs/StyledCheckbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles/CSVDialog.module.css";

const separators = [
    {
        label: "tab",
        value: "%09"
    },
    {
        label: "space",
        value: " "
    },
    {
        label: "comma",
        value: ","
    },
    {
        label: "semicolon",
        value: ";"
    }
];

const StyledDialog = withStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.paper.background,
        color: theme.palette.paper.text,
        minWidth: "fit-content",
        width: "25%"
    }
}), {name: "CSVDialog"})(props => <Dialog {...props} />);

class CSVDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            header: false,
            separator: ";"
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

        console.log({header, separator} === this.state);

        this.props.onConfirm({ header, separator });
    };

    onEntering = () => {
        this.setState({
            header: false,
            separator: ";"
        });
    };

    render() {
        const { header, separator } = this.state;
        const { open } = this.props;

        return (
            <StyledDialog
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onEntering={this.onEntering}
                open={open}
                maxWidth={"md"}
            >
                <DialogTitle>
                    Specify CSV attributes
                </DialogTitle>
                <DialogContent className={styles.Content} dividers={true}>
                    <FormControlLabel
                        aria-label={"header checkbox"}
                        control={
                            <StyledCheckbox
                                checked={header}
                                inputProps={{ "aria-label": "csv header checkbox" }}
                                onChange={this.onHeaderChange}
                            />
                        }
                        label={"Header exists"}
                    />
                    <div aria-label={"separator selector"} className={styles.ContentRow}>
                        <RuleWorkTextField
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
                        </RuleWorkTextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <StyledButton
                        aria-label={"cancel upload"}
                        onClick={this.onCancel}
                        themeVariant={"secondary"}
                        variant={"outlined"}
                    >
                        Cancel
                    </StyledButton>
                    <StyledButton
                        aria-label={"confirm upload"}
                        onClick={this.onConfirm}
                        themeVariant={"primary"}
                        variant={"outlined"}
                    >
                        Confirm
                    </StyledButton>
                </DialogActions>
            </StyledDialog>
        );
    }
}

CSVDialog.propTypes = {
    onConfirm: PropTypes.func,
    open: PropTypes.bool.isRequired,
};

export default CSVDialog;