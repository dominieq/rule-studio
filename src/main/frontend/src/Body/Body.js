import React, {Component} from 'react';
import Home from './Home/Home';
import Import from './Import/Import';
import Help from './Help/Help';

class Body extends Component {

    render() {
        switch (this.props.display) {
            case "Import":
                return <Import uploadFiles={() => this.props.uploadFiles}/>;
            case "Help":
                return <Help />;
            default:
                return <Home />
        }
    }
}

export default Body;
