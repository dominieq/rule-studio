import React from "react";
import PropTypes from "prop-types";
import FilterNoResults from "./Filtering/FilterNoResults";
import RuleWorkBox from "../../../RuleWorkComponents/Containers/RuleWorkBox";
import { RuleWorkList, RuleWorkListSubheader } from "../../../RuleWorkComponents/DataDisplay/RuleWorkList";
import StyledCircularProgress from "../../../RuleWorkComponents/Feedback/StyledCircularProgress";

function TabBody(props) {
    const { content, id, isArray, isLoading, ListProps, ListSubheaderProps, noFilterResults, subheaderContent } = props;

    return (
        <RuleWorkBox id={id} styleVariant={"tab-body"}>
            {isLoading &&
                <StyledCircularProgress />
            }
            {!isLoading && isArray &&
                <RuleWorkList
                    subheader={
                        <RuleWorkListSubheader {...ListSubheaderProps}>
                            {subheaderContent}
                        </RuleWorkListSubheader>
                    }
                    {...ListProps}
                >
                    {content}
                </RuleWorkList>
            }
            {noFilterResults &&
                <FilterNoResults />
            }
        </RuleWorkBox>
    )
}

TabBody.propTypes = {
    content: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    isArray: PropTypes.bool,
    isLoading: PropTypes.bool,
    ListProps: PropTypes.shape({
        onItemSelected: PropTypes.func,
    }),
    ListSubheaderProps: PropTypes.object,
    noFilterResults: PropTypes.bool,
    subheaderContent: PropTypes.arrayOf(PropTypes.object)
};

TabBody.defaultProps = {
    isArray: false,
    isLoading: false,
    noFilterResults: false,
};

export default TabBody;