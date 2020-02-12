import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import "./Import.css";

class Import extends Component{
    constructor(props) {
        super(props);

        this.state = {
            chosenName: "new project",
            chosenFiles: [],
        };
    }

    render() {
        return (
            <Box component={"div"} className={"import-root"}>
                <Paper square={true} className={"import-panel"}>
                    <img src={"https://miro.medium.com/max/12000/1*U6BGoYgGAqEElQdCR_zEtA.jpeg"} alt={"empty"}/>
                </Paper>
            </Box>
        );
    }
}

export default Import;