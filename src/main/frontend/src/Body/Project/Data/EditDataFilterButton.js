import React, { Fragment } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './EditDataButtons.css';
import CustomTooltip from '../../../Utils/DataDisplay/CustomTooltip';
import StyledButton from "../../../Utils/Inputs/StyledButton";
import StyledPaper from "../../../Utils/Surfaces/StyledPaper";

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
            <CustomTooltip title={`Show filter`}>
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
                <div id={"rule-work-data-1"} className={"rule-work-data-toolbar"}>
                    <StyledPaper
                        id={"rule-work-data-1-bar"}
                        paperRef={this.upperBar}
                        styleVariant={"bar"}
                        square={true}
                        variant={"outlined"}
                    >
                        {this.renderToggleFilterButton("desktop")}
                        {this.getAppropriateButtonsBar("desktop")}
                    </StyledPaper>
                </div>

                <div id={"rule-work-data-2"} className={"rule-work-data-toolbar"}>
                    <StyledPaper
                        id={"rule-work-data-2-bar"}
                        paperRef={this.upperBar}
                        styleVariant={"bar"}
                        square={true}
                        variant={"outlined"}
                    >
                        {this.renderToggleFilterButton("mobile")}
                        {this.getAppropriateButtonsBar("mobile")}
                    </StyledPaper>
                </div>
            </Fragment>
        )
    }
}

export default EditDataFilterButton;