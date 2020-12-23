import React from "react";
import PropTypes from "prop-types";
import FilterNoResults from "../../Body/Project/Filtering/FilterNoResults";
import CustomBox from "./CustomBox";
import { ResultList, ResultListSubheader } from "../DataDisplay/ResultList";
import StyledCircularProgress from "../Feedback/StyledCircularProgress";

/**
 * Utility that presents results from calculations in tabs.
 * Takes care of displaying progress circle when results are being generated.
 * Displays a message when user tried to filter result list but no matches were found.
 *
 * @constructor
 * @category Utils
 * @subcategory Containers
 * @param {Object} props
 * @param {Object[]} props.content - The content of the {@link ResultList} element. Should be a list of list-items.
 * @param {string} props.id - The id of the {@link CustomBox} element that wraps around the {@link ResultList}.
 * @param {boolean} [props.isArray = false] - If <code>true</code> the {@link ResultList} element is displayed.
 * @param {boolean} [props.isLoading = false] - If <code>true</code> the {@link StyledCircularProgress} element is displayed.
 * @param {Object} props.ListProps - Props applied to the {@link ResultList} element.
 * @param {Object} props.ListSubheaderProps - Props applied to the {@link ResultListSubheader} element.
 * @param {boolean} [props.noFilterResults = false] - If <code>true</code> the {@link FilterNoResults} element is displayed.
 * @param {Object[]} props.subheaderContent - The content of the {@link ResultListSubheader} element.
 * @returns {React.ReactElement}
 */
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
