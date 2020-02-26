import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import { Button } from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 10,
    marginTop: 10,
    maxWidth: 30,//752,
  }  
});


class AttributeDomain extends React.Component {
  constructor(props) {
    super(props);

    this.max = 0;
    if(props.defaultValue.length > 0) {
      props.defaultValue.forEach(x => { if(x.id > this.max) this.max = x.id})
      this.max++;
    }

    this.state = {
      domainElements: props.defaultValue,
      id: this.max,
    };
    
    this.props.setDomainElements(props.defaultValue);
  }

  textFieldOnChange = (e) => {
    for (let i in this.state.domainElements) {
      if (this.state.domainElements[i].id == e.target.id) {
        const newText = e.target.value;
        this.setState(
          prevState => {
            prevState.domainElements[i].text = newText;
            return {
              domainElements: prevState.domainElements
            };
          },
          () => this.props.setDomainElements(this.state.domainElements)
        );
      }
    }
  };

  onClickRemoveElement = (e) => {
    const id = e.currentTarget.value;
    this.setState(
      prevState => {
        const tmp = [...prevState.domainElements];
        for (let i in tmp) {
          if (tmp[i].id == id) {
            tmp.splice(i, 1);
            break;
          }
        }
        return { domainElements: tmp };
      },
      () => this.props.setDomainElements(this.state.domainElements)
    );
  };

  onClickAddElement = (e) => {
    const newElement = { id: this.state.id, text: "" };
    this.setState(
      prevState => {
        return {
          domainElements: [...prevState.domainElements, newElement],
          id: prevState.id + 1
        };
      },
      () => this.props.setDomainElements(this.state.domainElements)
    );
  };

  switchUpward = (e) => {
    if (this.state.domainElements.length > 1) {
      const id = e.currentTarget.value;
      const newDomainElements = this.state.domainElements;
      if (newDomainElements[0].id == id) {
        //if this is the first element, then go last
        newDomainElements.push(newDomainElements[0]);
        newDomainElements.splice(0, 1);
      } else {
        //if any other element then go up
        for (let i in newDomainElements) {
          if (newDomainElements[i].id == id) {
            const prevElement = newDomainElements[i - 1];
            newDomainElements[i - 1] = newDomainElements[i];
            newDomainElements[i] = prevElement;
            break;
          }
        }
      }

      this.setState(
        {
          domainElements: newDomainElements
        },
        () => this.props.setDomainElements(this.state.domainElements)
      );
    }
  };

  switchDownward = (e) => {
    if (this.state.domainElements.length > 1) {
      const id = e.currentTarget.value;
      const newDomainElements = this.state.domainElements;
      if (newDomainElements[newDomainElements.length - 1].id == id) {
        //if this is the last element, then go first
        newDomainElements.unshift(
          newDomainElements[newDomainElements.length - 1]
        );
        newDomainElements.pop();
      } else { //if any other element then go down
        for (let i = 0; i < newDomainElements.length; i++) {
          if (newDomainElements[i].id == id) {
            const prevElement = newDomainElements[i];
            newDomainElements[i] = newDomainElements[i + 1];
            newDomainElements[i + 1] = prevElement;
            break;
          }
        }
      }

      this.setState(
        {
          domainElements: newDomainElements
        },
        () => this.props.setDomainElements(this.state.domainElements)
      );
    }
  };

  renderElements = classes => {
    const elements = [];
    this.state.domainElements.forEach((x, num) => {
      elements.push(
        <List dense={false} key={x.id.toString()}>
          <ListItem>
            <ListItemText primary={num + 1} classes={{ root: classes.root }} />
            <TextField
              id={x.id.toString()}
              label="Domain element"
              onChange={this.textFieldOnChange}
              defaultValue={x.text}
            />

            <IconButton
              aria-label="up"
              className={classes.margin}
              size="small"
              value={x.id}
              onClick={this.switchUpward}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="down"
              className={classes.margin}
              disableRipple={false}
              disableFocusRipple={false}
              size="small"
              value={x.id}
              onClick={this.switchDownward}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </IconButton>

            <ListItemSecondaryAction>
              <IconButton
                edge="start"
                aria-label="delete"
                onClick={this.onClickRemoveElement}
                value={x.id}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      );
    });
    return elements;
  };

  render() {
    const { classes } = this.props;
    return (
        <div className={classes.demo}>
            <Button
              onClick={this.onClickAddElement}
              color="primary"
              variant="outlined"
              size="large"
            >
              Add domain element
            </Button>
            {this.renderElements(classes)}
        </div>
    );
  }
}

AttributeDomain.defaultProps = {
  defaultValue: [],
}
export default withStyles(styles)(AttributeDomain);