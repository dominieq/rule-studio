import React, { Fragment } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './EditDataButtons.css';
import CustomHeader from "../../../Utils/Surfaces/CustomHeader";
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import StyledButton from "../../../Utils/Inputs/StyledButton";

class EditDataFilterButton extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onToggleFilter();
    }

    renderToggleFilterButton = (name) => {
        if (this.props.enableFilter) {
          return (
            <CustomTooltip disableGpu={true} title={`Show filter`}>
                {name === "desktop" ?
                    <StyledButton
                        disableElevation
                        onClick={this.props.onToggleFilter}
                        startIcon={<SearchIcon />}
                        themeVariant={"primary"}
                        variant={"contained"}
                    >
                        Filter
                    </StyledButton>
                :   <StyledButton
                        isIcon={true}
                        onClick={this.props.onToggleFilter}
                    >
                        <SearchIcon />
                    </StyledButton>
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