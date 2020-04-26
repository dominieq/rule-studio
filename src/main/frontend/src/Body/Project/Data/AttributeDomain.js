import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { withStyles } from '@material-ui/styles';
import StyledButton from "../../../RuleWorkComponents/Inputs/StyledButton";
import { StyledDefaultTextField } from './StyledComponents';

const styles = ({
  root: {
    marginTop: 15,
    marginBottom: 0
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
    this.timer = null;
  }

  startTime = (e) => {
    e.persist();

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.textFieldOnChange(e),300);
  }

  textFieldOnChange = (e) => {
    for (let i in this.state.domainElements) {
      if (this.state.domainElements[i].id == e.target.id) {
        const newText = e.target.value;
        this.setState(prevState => {
          let newDomainElements = [...prevState.domainElements];
          newDomainElements[i].text = newText;
            return {
              domainElements: newDomainElements
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
          <ListItem key={x.id.toString()}>
            <ListItemText primary={num + 1} classes={{ root: classes.root }} />
            <StyledDefaultTextField
              variant = "standard"
              id={x.id.toString()}
              label="Domain element"
              onChange={this.startTime}
              defaultValue={x.text}
              autoComplete="off"
              required
            />

            <StyledButton
              isIcon={true}
              aria-label="up"
              className={classes.root}
              size="small"
              value={x.id}
              onClick={this.switchUpward}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </StyledButton>
            <StyledButton
              isIcon={true}
              aria-label="down"
              className={classes.root}
              disableRipple={false}
              disableFocusRipple={false}
              size="small"
              value={x.id}
              onClick={this.switchDownward}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </StyledButton>
            
            <StyledButton
              isIcon={true}
              edge="start"
              aria-label="delete"
              className={classes.root}
              onClick={this.onClickRemoveElement}
              size="small"
              value={x.id}
            >
              <DeleteIcon />
            </StyledButton>
          </ListItem>
       
      );
    });
    return <List dense={false} style={{overflow: "auto"}} > {elements} </List>;
  };

  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
          <StyledButton
            disableElevation={true}
            onClick={this.onClickAddElement}
            themeVariant={"primary"}
            variant={"contained"}
            style={{display: "flex", margin: "0 auto"}}
          >
            Add domain element
          </StyledButton>
            
            {this.renderElements(classes)}
        </React.Fragment>
    );
  }
}

AttributeDomain.defaultProps = {
  defaultValue: [],
}
export default withStyles(styles)(AttributeDomain);