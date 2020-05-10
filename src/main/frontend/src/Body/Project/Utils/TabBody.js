import React from "react";
import PropTypes from "prop-types";
import FilterNoResults from "./Filtering/FilterNoResults";
import CustomBox from "../../../Utils/Containers/CustomBox";
import { ResultList, ResultListSubheader } from "../../../Utils/DataDisplay/ResultList";
import StyledCircularProgress from "../../../Utils/Feedback/StyledCircularProgress";

function TabBody(props) {
    return (
        <React.Fragment>
            {props.isLoading &&
                <StyledCircularProgress />
            }
            {!props.isLoading &&
                <CustomBox id={props.id} variant={"TabScrollable"}>
                    {props.isArray &&
                    <ResultList
                        subheader={
                            <ResultListSubheader {...props.ListSubheaderProps}>
                                {props.subheaderContent}
                            </ResultListSubheader>
                        }
                        {...props.ListProps}
                    >
                        {props.content}
                    </ResultList>
                    }
                    {props.noFilterResults &&
                    <FilterNoResults />
                    }
                </CustomBox>
            }
        </React.Fragment>
    );
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