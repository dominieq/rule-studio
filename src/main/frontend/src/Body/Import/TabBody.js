import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import "./TabBody.css";
import DnDZone from "./DnDZone";


class TabBody extends Component {
    constructor(props) {
        super(props);

        this.parseJson = this.parseJson.bind(this);
        this.parseXML = this.parseXML.bind(this);
    }

    parseJson(file) {
        const jsonFile =  JSON.parse(file);
        console.log(jsonFile);
    }

    parseXML(file) {
        console.log(file)
    }

    render() {
        return (
            <Grid container spacing={2} direction={"row"}>
                <Grid item xs container spacing={2} direction={"column"}>
                    <Grid item>
                        <DnDZone onChange={(f) => this.parseJson(f)}>
                            {this.props.textValue}
                        </DnDZone>
                    </Grid>
                    <Grid item>
                        <DnDZone onChange={(f) => this.parseXML(f)}>
                            Select metadata
                        </DnDZone>
                    </Grid>
                </Grid>
                <Grid item xs>
                    {this.props.children}
                </Grid>
            </Grid>
        )
    }
}

export default TabBody;