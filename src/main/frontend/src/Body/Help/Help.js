import React from 'react';
import PropTypes from "prop-types";
import { CreatingProject } from "./Chapters";
import { StyledDrawer, StyledListItem, StyledScrollable } from "./Utils";
import List from "@material-ui/core/List";
import styles from "./styles/Help.module.css";

class Help extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            marginRight: 0,
            selected: "chapter-1"
        };

        this.chapterPositions = [];
        this.drawerRef = React.createRef();
        this.timer = null;
    }

    componentDidMount() {
        if (this.drawerRef.current != null) {
            this.setState({
                marginRight: this.drawerRef.current.offsetWidth
            });
        }

        if (Array.isArray(this.chapterPositions) && this.chapterPositions.length === 0) {

        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    onScroll = () => {
        const scrollable = document.getElementById("scrollable");

        clearTimeout(this.timer);
        setTimeout(() => {
            for (let i = 1; i <= this.chapterPositions.length; i++) {
                if (this.chapterPositions[i-1] - 20 <= scrollable.scrollTop ) {
                    this.setState({
                        selected: `chapter-${i}`
                    });
                }
            }
        }, 100);
    };

    scrollTo = (id) => {
        const chapter = document.getElementById(id);
        const scrollable = document.getElementById("scrollable");

        scrollable.scrollTop = chapter.offsetTop - chapter.offsetHeight - 20;

        this.setState({
            selected: id
        });
    };

    render() {
        const { marginRight, selected } = this.state;
        const { upperMargin } = this.props;

        return (
            <div className={styles.Root} id={"help"}>
                <StyledScrollable
                    className={styles.Text}
                    onScroll={this.onScroll}
                    style={{marginRight: marginRight}}
                >
                    <div aria-label={"text-container"} className={styles.Scrollable}>
                        {/* Chapter 1: Creating project */}
                    </div>
                </StyledScrollable>
                <StyledDrawer
                    anchor={"right"}
                    PaperProps={{
                        className: styles.Drawer,
                        id: "help-drawer",
                        ref: this.drawerRef,
                        style: { marginTop: upperMargin }
                    }}
                    variant={"permanent"}
                >
                    <List disablePadding={true}>
                        <StyledListItem
                            selected={selected === "chapter-1"}
                            onClick={() => this.scrollTo("chapter-1")}
                        >
                            Chapter 1
                        </StyledListItem>
                    </List>
                </StyledDrawer>
            </div>
        );
    }
}

Help.propTypes = {
    selected: PropTypes.string,
    upperMargin:  PropTypes.number
};

Help.default = {
    selected: "chapter-1"
};

export default Help;
