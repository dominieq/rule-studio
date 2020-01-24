import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import "./TabBody.css";


class TabBody extends Component {

    render() {
        return (
            <Grid container spacing={2} direction={"row"}>
                <Grid item xs container spacing={2} direction={"column"}>
                    <Grid item>
                        <div className={"input-wrapper"}>
                            <input type={"file"} name={"file"} id={"file"} className={"file-input"}/>
                            <label htmlFor={"file"}>{this.props.textValue}</label>
                        </div>
                    </Grid>
                    <Grid item>
                        <div className={"input-wrapper"}>
                            <input type={"file"} name={"file"} id={"file"} className={"file-input"}/>
                            <label htmlFor={"file"}>Select metadata</label>
                        </div>
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