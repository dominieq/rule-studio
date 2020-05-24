import React from 'react';
import PropTypes from "prop-types";
import {
    Classification,
    ClassUnions,
    CreatingProject,
    CrossValidation,
    Data,
    DeletingProject,
    DominanceCones,
    Navigating,
    ProjectFiles,
    ProjectSettings,
    RenamingProject,
    Rules
} from "./Chapters";
import { StyledDrawer, StyledListItem, StyledScrollable } from "./Utils";
import List from "@material-ui/core/List";
import styles from "./styles/Help.module.css";

const CHAPTERS = [
    "Navigating",
    "Creating project",
    "Renaming project",
    "Deleting project",
    "Project settings",
    "Project files",
    "Data",
    "Dominance cones",
    "Class unions",
    "Rules",
    "Classification",
    "Cross-validation"
];

class Help extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            marginRight: 0,
            selected: 1
        };

        this.chapterPositions = [];
        this.drawerRef = React.createRef();
        this.timer = null;
    }

    componentDidMount() {
        if (this.drawerRef.current != null) {
            this.setState({
                marginRight: this.drawerRef.current.offsetWidth
            }, () => {
                clearTimeout(this.timer);
                setTimeout(() => {
                    if (Array.isArray(this.chapterPositions)) {
                        for (let i = 1; i <= CHAPTERS.length; i++) {
                            const chapter = document.getElementById(`chapter-${i}`);

                            this.chapterPositions.push(chapter.offsetTop - chapter.offsetHeight - 20);
                        }
                    }
                }, 1000);
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    onScroll = () => {
        const scrollable = document.getElementById("scrollable");

        clearTimeout(this.timer);
        setTimeout(() => {
            let i = 0;

            while (i < CHAPTERS.length && this.chapterPositions[i] - 20 <= scrollable.scrollTop) i++;
            if (i <= 0) i = 1;

            this.setState({
                selected: i
            });
        }, 100);
    };

    scrollTo = (id) => {
        const chapter = document.getElementById(`chapter-${id}`);
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
                        <Navigating chapterId={"chapter-1"} />
                        <CreatingProject chapterId={"chapter-2"} />
                        <RenamingProject chapterId={"chapter-3"} />
                        <DeletingProject chapterId={"chapter-4"} />
                        <ProjectSettings chapterId={"chapter-5"} />
                        <ProjectFiles chapterId={"chapter-6"} />
                        <Data chapterId={"chapter-7"} />
                        <DominanceCones chapterId={"chapter-8"} />
                        <ClassUnions chapterId={"chapter-9"} />
                        <Rules chapterId={"chapter-10"} />
                        <Classification chapterId={"chapter-11"} />
                        <CrossValidation chapterId={"chapter-12"} />
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
                        {CHAPTERS.map((value, index) => (
                            <StyledListItem
                                onClick={() => this.scrollTo(index + 1)}
                                key={index}
                                selected={selected === index + 1}
                            >
                                {value}
                            </StyledListItem>
                        ))}
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
    selected: 1
};

export default Help;
