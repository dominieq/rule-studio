import React, { Fragment } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './EditDataButtons.css';
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import { StyledButton, StyledIconButton } from "../../../Utils/Inputs/StyledButton";

/**
 * This class generates Filter button and passes all the other buttons as children.
 * 
 * @name DataFilterButton
 * @class
 * @category Tabs
 * @subcategory DataFilter
 * @param {Object} props
 * @param {boolean} props.enableFilter - True if the filter is enabled, else false (here always true).
 * @param {function} props.onToggleFilter - Method used from the external library (react-data-grid).
 * @returns {React.ReactElement}
 */
class EditDataFilterButton extends React.Component {
    componentDidMount() {
        this.props.onToggleFilter();
    }

    renderToggleFilterButton = (name) => {
        if (this.props.enableFilter) {
          return (
            <CustomTooltip disableGpu={true} title={`Show filter`}>
                {name === "desktop" ?
                    <StyledButton
                        color={"primary"}
                        disableElevation={true}
                        onClick={this.props.onToggleFilter}
                        startIcon={<SearchIcon />}
                        variant={"contained"}
                    >
                        Filter
                    </StyledButton>
                :   <StyledIconButton
                        onClick={this.props.onToggleFilter}
                    >
                        <SearchIcon />
                    </StyledIconButton>
                }
            </CustomTooltip>
          );
        }
    };

    getAppropriateButtonsBar = (name) => {
        return React.Children.map(this.props.children, child => React.cloneElement(child, {whichDevice: name}))
    }

    render() {
        return(
            <Fragment>
                <div id={"rule-studio-data-1"} className={"rule-studio-data-toolbar"}>
                    <CustomHeader elevation={0} id={"rule-studio-data-1-bar"} variant={"outlined"}>
                        {this.renderToggleFilterButton("desktop")}
                        {this.getAppropriateButtonsBar("desktop")}
                    </CustomHeader>
                </div>

                <div id={"rule-studio-data-2"} className={"rule-studio-data-toolbar"}>
                    <CustomHeader elevation={0} id={"rule-studio-data-2-bar"} variant={"outlined"}>
                        {this.renderToggleFilterButton("mobile")}
                        {this.getAppropriateButtonsBar("mobile")}
                    </CustomHeader>
                </div>
            </Fragment>
        )
    }
}

export default EditDataFilterButton;