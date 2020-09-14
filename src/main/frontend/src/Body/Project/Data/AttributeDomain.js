import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { withStyles } from '@material-ui/styles';
import { StyledButton, StyledIconButton } from "../../../Utils/Inputs/StyledButton";
import { StyledDefaultTextField } from './StyledComponents';

const styles = ({
  root: {
    marginTop: 15,
    marginBottom: 0
  }
});

/**
 * @name Attribute Domain
 * @class
 * @category Utils
 * @subcategory Inputs
 * @param {Object} props
 * @param {Array} props.defaultValue - Array containing domain elements
 * @param {function} props.setDomainElements - Method fired when adding, removing, editing the domain element or changing the order of domain elements.
 * @returns {React.Component}
 */
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

  /**
   * Method responsible for starting event (after inserting character in the text field) after 300ms.
   * This way it won't be lagging if many characters are quickly entered into the textfield.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
  startTime = (e) => {
    e.persist();

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.textFieldOnChange(e),300);
  }

  /**
   * Method runs on change in the domain element.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
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

  /**
   * Method runs if the domain element is removed.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
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

  /**
   * Method runs if the domain element is added.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
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

  /**
   * Method runs if the order of domain elements changes (in this case arrow up has been clicked).
   * Example: Let's say we have 4 elements: a,b,c,d
   * If the up arrow is clicked on the "b" element order will look as follows: b,a,c,d.
   * So the element below goes upper, and upper element goes below. (like in the switch)
   * If the first element is clicked, i.e. "a" then the order will look as follows: b,c,d,a
   * so the first element goes at the bottom (like in the queue) and rest of elements goes up.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
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

   /**
   * Method runs if the order of domain elements changes (in this case arrow down has been clicked).
   * Example: Let's say we have 4 elements: a,b,c,d
   * If the down arrow is clicked on the "b" element order will look as follows: a,c,b,d.
   * So the element below goes upper, and upper element goes below. (like in the switch)
   * If the last element is clicked, i.e. "d" then the order will look as follows: d,a,b,c
   * so the last element goes at the top (like in the queue) and rest of elements goes down.
   * 
   * @function
   * @memberOf AttributeDomain
   * @param {Object} e - Represents an event that takes place in DOM tree.
   */
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

  /**
   * Method prepares array of html elements which will be displayed through the render method.
   * It is responsible for displaying all the domain elements (whole rows)
   * 
   * @function
   * @memberOf AttributeDomain
   */
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

            <StyledIconButton
              aria-label="up"
              className={classes.root}
              color={"primary"}
              onClick={this.switchUpward}
              size="small"
              value={x.id}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </StyledIconButton>
            <StyledIconButton
              aria-label="down"
              className={classes.root}
              color={"primary"}
              disableRipple={false}
              disableFocusRipple={false}
              onClick={this.switchDownward}
              size="small"
              value={x.id}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </StyledIconButton>
            
            <StyledIconButton
              aria-label="delete"
              className={classes.root}
              color={"primary"}
              edge="start"
              onClick={this.onClickRemoveElement}
              size="small"
              value={x.id}
            >
              <DeleteIcon />
            </StyledIconButton>
          </ListItem>
       
      );
    });
    return <List dense={false} style={{overflow: "auto"}} > {elements} </List>;
  };

  /**
   * Method which renders everything.
   * 
   * @function
   * @memberOf AttributeDomain
   */
  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
          <StyledButton
            color={"primary"}
            disableElevation={true}
            onClick={this.onClickAddElement}
            style={{display: "flex", margin: "0 auto"}}
            variant={"contained"}
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