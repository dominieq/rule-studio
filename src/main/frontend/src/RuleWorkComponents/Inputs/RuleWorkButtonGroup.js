import React, {Component} from "react";
import PropTypes from "prop-types";
import RuleWorkButton from "./RuleWorkButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

class RuleWorkButtonGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selected: 0,
        };

        this.anchorRef = React.createRef();
    }

    onToggleButtonClick = () => {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    };

    onPopperClose = () => {

    };

    onMenuItemClick = (event, index) => {
        this.setState({
            open: false,
            selected: index
        })
    };

    render() {
        const {open, selected} = this.state;
        const {children, options, ...other} = this.props;
        const childrenArray = React.Children.toArray(children);

        return (
            <div {...other}>
                <ButtonGroup aria-label={"split button"} ref={this.anchorRef} variant={"text"} >
                    <RuleWorkButton
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? true : undefined}
                        ariaLabel={"select classification method"}
                        aria-haspopup={"menu"}
                        buttonVariant={"icon"}
                        onClick={this.onToggleButtonClick}
                        title={"Choose method of performing classification"}
                    >
                        <ArrowDropDownIcon />
                    </RuleWorkButton>
                    {childrenArray[selected]}
                </ButtonGroup>
                <Popper
                    anchorEl={this.anchorRef.current}
                    disablePortal={true}
                    open={open}
                    role={undefined}
                    transition={true}
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center-top' : 'center-bottom',
                            }}
                        > 
                            <div>
                                <ClickAwayListener onClickAway={this.onPopperClose}>
                                    <MenuList >
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={index}
                                                onClick={event => this.onMenuItemClick(event, index)}
                                                selected={selected === index}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </div>
                        </Grow>
                    )}
                </Popper>
            </div>
        )
    }
}

RuleWorkButtonGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RuleWorkButtonGroup;