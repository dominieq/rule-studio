# RuLeStudio
Open source application that makes use of [ruleLearn library](https://github.com/ruleLearn/rulelearn) 
to put into action it's core functionalities and display them in user-friendly manner.

## Quick start
Go to [releases](https://github.com/dominieq/rule-studio/releases) and choose your version of RuLeStudio. 
The latest release should contain a manual and example data set.
Once you've downloaded the application, run it by using the following command:
````
java -jar rulestudio-{latest_version}.jar
````
Then, open your browser and go to ``http://localhost:8080``. 
Check manual for helpful information and tips on how to make the best use of our application.

## Build application from scratch
To build application on your own, first download or copy 
the source code and then go to the project folder and execute:
````
mvn clean package
````
**Make sure path to your project does not contain any spaces or special characters.**

## Documentation
### Frontend
[Link to frontend documentation](https://dominieq.github.io/rule-studio/)

## License
This project is licensed under the Apache License, Version 2.0 - 
see the [LICENSE](https://github.com/dominieq/rule-work/blob/master/LICENSE) file for details.

## Acknowledgements
- [ruleLearn library](https://github.com/ruleLearn/rulelearn) is the essential component of our project, 
  providing necessary API for calculations.
- The server was programmed in Java, using [SpringBoot framework](https://github.com/spring-projects/spring-boot).
- The serialization of projects is possible thanks to [XStream library](https://github.com/x-stream/xstream).  
- The client was programmed in JavaScript, using [React framework](https://github.com/facebook/react). 
- On top of that, we used many useful libraries such as: 
  - [Material-UI](https://github.com/mui-org/material-ui) for overall awe-inspiring style and ease in creating intuitive GUI.  
  - [react-virtualized](https://github.com/bvaughn/react-virtualized) to efficiently display massive amounts of data. 
  - [react-router](https://github.com/ReactTraining/react-router), [BigNumber](https://github.com/MikeMcl/bignumber.js).
- We used [frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) to package our application to a single JAR file.
