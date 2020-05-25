import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CustomControlLabel from "./Elements/CustomControlLabel";
import StyledDivider from "../../DataDisplay/StyledDivider";
import StyledRadioButton from "../StyledRadioButton";
import FormLabel from "@material-ui/core/FormLabel";
import Menu from "@material-ui/core/Menu";
import RadioGroup from "@material-ui/core/RadioGroup";
import Zoom from "@material-ui/core/Zoom";
import { AutoSizer, List } from "react-virtualized";
import Check from "@material-ui/icons/Check";

const orders = [
    {
        label: "ascending",
        value: "asc"
    },
    {
        label: "descending",
        value: "desc"
    }
];

const menuStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.main1,
        color: theme.palette.text.main1
    }
}), {name: "SortMenu"});

const labelStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.special1,
        marginBottom: "0.5rem"
    }
}), {name: "CustomLabel"});

const virtualStyles = makeStyles(theme => ({
    root: {
        scrollbarWidth: "thin",
        '&::-webkit-scrollbar': {
            width: 8
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.sub,
            borderRadius: 4,
            '&:hover': {
                backgroundColor: theme.palette.background.subDark
            }
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: 4,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
        }
    }
}), {name: "CategoriesBox"});

function SortMenu(props) {
    const { anchorE1, ContentProps, ...other } = props;
    const rowCount = ContentProps.categories.length;

    const [scrollToIndex, setScrollToIndex] = useState(undefined);

    const menuClasses = menuStyles();
    const labelClasses = labelStyles();
    const virtualClasses = virtualStyles();

    const getIndexOfValue = (value) => {
        for (let i = 0; i < rowCount; i ++) {
            if (ContentProps.categories[i].value === value) {
                return i;
            }
        }
        return -1;
    };

    const onEntering = () => {
        let newScrollToIndex = Math.min(rowCount - 1, getIndexOfValue(ContentProps.value));

        if (isNaN(newScrollToIndex)) {
            newScrollToIndex = undefined;
        }
        
        setScrollToIndex(newScrollToIndex);
    };

    const rowRenderer = ({key, index, style}) => {
        return (
            <CustomControlLabel
                control={Boolean(ContentProps.RadioComponent) ?
                    ContentProps.RadioComponent
                    :
                    <StyledRadioButton
                        checkedIcon={<Check />}
                        icon={<span style={{display: "none"}} />}
                        inputProps={{ style: {display: "none"}}}
                        style={{padding: 0}}
                    />
                }
                key={key}
                label={ContentProps.categories[index].label}
                style={style}
                value={ContentProps.categories[index].value}
            />
        );
    }

    return (
        <Menu
            anchorEl={anchorE1}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            classes={{...menuClasses}}
            getContentAnchorEl={null}
            keepMounted={true}
            onEntering={onEntering}
            open={Boolean(anchorE1)}
            MenuListProps={{
                style: {
                    paddingLeft: 16,
                    paddingRight: 0,
                    width: "auto"
                }
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            TransitionComponent={Zoom}
            {...other}
        >
            <FormLabel classes={{...labelClasses}} component={"header"} style={{outline: 0}}>
                Choose category to order by:
            </FormLabel>
            <RadioGroup
                onChange={ContentProps.onCategoryChange}
                value={ContentProps.value}
                style={{ width: "20rem", height: "20vh" }}
            >
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            className={virtualClasses.root}
                            height={height}
                            rowCount={rowCount}
                            rowHeight={ContentProps.rowHeight}
                            rowRenderer={rowRenderer}
                            scrollToIndex={scrollToIndex}
                            style={{outline: 0}}
                            width={width}
                        />
                    )}
                </AutoSizer>
            </RadioGroup>
            <StyledDivider
                color={"secondary"}
                flexItem={false}
                orientation={"horizontal"}
            />
            <FormLabel classes={{...labelClasses}} component={"header"} style={{marginTop: "0.5rem"}}>
                Choose sorting order:
            </FormLabel>
            {ContentProps.chooseOrder &&
                <RadioGroup
                    onChange={ContentProps.onOrderChange}
                    value={ContentProps.order}
                    style={{paddingRight: 8}}
                >
                    {orders.map((order, index) => (
                        <CustomControlLabel
                            control={Boolean(ContentProps.RadioComponent) ?
                                ContentProps.RadioComponent
                                :
                                <StyledRadioButton
                                    checkedIcon={<Check />}
                                    icon={<span style={{display: "none"}} />}
                                    inputProps={{ style: {display: "none"}}}
                                    style={{padding: 0}}
                                />
                            }
                            key={index}
                            label={order.label}
                            style={{height: ContentProps.rowHeight}}
                            value={order.value}
                        />
                    ))}
                </RadioGroup>
            }
        </Menu>
    )
}

SortMenu.propTypes = {
    anchorE1: PropTypes.any,
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.object,
    ContentProps: PropTypes.shape({
        categories: PropTypes.arrayOf(PropTypes.exact({
            label: PropTypes.string,
            value: PropTypes.string
        })),
        chooseOrder: PropTypes.bool,
        onCategoryChange: PropTypes.func,
        onOrderChange: PropTypes.func,
        order: PropTypes.oneOf(["asc", "desc"]),
        RadioComponent: PropTypes.node,
        rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        value: PropTypes.string,
    }),
    disableAutoFocusItem: PropTypes.bool,
    id: PropTypes.string,
    MenuListProps: PropTypes.object,
    onClose: PropTypes.func,
    onEnter: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
    PopoverClasses: PropTypes.object,
    transitionDuration: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            appear: PropTypes.number,
            enter: PropTypes.number,
            exit: PropTypes.number
        })
    ]),
    variant: PropTypes.oneOf(['menu', 'selected-menu'])
};

export default SortMenu;
