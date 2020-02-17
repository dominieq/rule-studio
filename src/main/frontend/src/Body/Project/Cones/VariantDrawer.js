import React, {Component} from 'react';
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class VariantDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
          currentVariants: this.props.variants,
        };
    }

    searchText = (event) => {
        const searchText = event.target.value;
        if (searchText === "") {
            this.setState({
                currentVariants: this.props.variants,
            });
            return;
        }

        let variants = [];

        for (let i = 0; i < this.props.variants.length; i++) {
            const variant = this.props.variants[i];

            if (variant.id.includes(searchText)) {
                variants = [...variants, variant];
            }
        }

        this.setState({
            currentVariants: variants,
        })
    };

    selectAndClose = (index) => {
        this.props.select(index);
        this.props.close(false);
    };

    render() {
        return (
            <div role={"presentation"}>
                <Paper>
                    <TextField
                        id={"variant-search"}
                        label={"Search variant"}
                        type={"search"}
                        variant={"outlined"}
                        onChange={this.searchText}
                    />
                </Paper>
                <List>
                    {this.state.currentVariants.map((variant, index) => (
                        <ListItem
                            button
                            key={variant.id}
                            onClick={() => this.selectAndClose(index)}
                        >
                            <ListItemText primary={variant.id} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

export default VariantDrawer;