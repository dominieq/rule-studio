import React from 'react';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { createMuiTheme } from '@material-ui/core/styles';

class EditDataFilterButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.theme = createMuiTheme({
            spacing: 1,
        })
    }

    componentDidMount() {
        this.props.onToggleFilter();
    }

    renderToggleFilterButton = () => {
        if (this.props.enableFilter) {
          return (
            <Button
            variant="contained"
            color="primary"
            style={{margin: this.theme.spacing(8)}}
            className={"left-aligned"}
            startIcon={<SearchIcon />}
            onClick={this.props.onToggleFilter}
            >
            Filter
            </Button>          
          );
        }
      };

    render() {
        
        return(
            <div className="left-aligned">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                {this.renderToggleFilterButton()}
                {this.props.children}
        </div>
        )
    }
}

export default EditDataFilterButton;