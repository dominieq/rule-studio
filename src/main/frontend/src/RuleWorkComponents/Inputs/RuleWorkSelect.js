import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {useOutlinedInputStyles} from "./MakeOutlinedInputStyles";
import StyledTypography from "../DataDisplay/StyledTypography";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function RuleWorkSelect(props) {
    const {children, disabledChildren, label, labelVariant, ...other} = props;
    const classes = useOutlinedInputStyles();

    return (
        <Fragment>
            {label ?
                <StyledTypography styleVariant={"label"} variant={labelVariant}>
                    {label}
                </StyledTypography>
                :
                null
            }
            <FormControl classes={{root: classes.root}} margin={"dense"} variant={"outlined"}>
                <Select {...other}>
                    {children.map((option, index) => (
                        <MenuItem
                            disabled={disabledChildren ? disabledChildren.includes(option) : false}
                            key={index}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Fragment>
    );
}

RuleWorkSelect.propTypes = {
    children: PropTypes.array.isRequired,
    disabledChildren: PropTypes.array,
    label: PropTypes.string,
    labelVariant: PropTypes.string,
};

RuleWorkSelect.defaultProps = {
    labelVariant: "body1",
};

export default RuleWorkSelect;