import React, { Fragment } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './EditDataButtons.css';
import RuleWorkTooltip from '../../../RuleWorkComponents/DataDisplay/RuleWorkTooltip';
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import StyledPaper from "../../../RuleWorkComponents/Surfaces/StyledPaper";

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
            <RuleWorkTooltip title={`Show filter`}>
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
            </RuleWorkTooltip>    
          );
        }
    };

    getAppropriateButtonsBar = (name) => {
        return React.Children.map(this.props.children, child => React.cloneElement(child, {whichDevice: name}))
    }

    render() {
        return(
            <Fragment>
                <RuleWorkBox id={"rule-work-data-1"} styleVariant={"tab"}>
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
                </RuleWorkBox>

                <RuleWorkBox id={"rule-work-data-2"} styleVariant={"tab"}>
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
                </RuleWorkBox>

            </Fragment>
        )
    }
}

export default EditDataFilterButton;