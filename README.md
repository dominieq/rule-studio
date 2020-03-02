# RuLe Work (Test)
Open source application that makes use of [ruleLearn library](https://github.com/ruleLearn/rulelearn) 
to put into action it's core functionalities and display them in user-friendly manner.
## Getting Started
### Server
To start server you need to execute:
````
mvn clean install
cd target
java -jar rulework-1.0-SNAPSHOT.jar
````
### Client
**Make sure you have npm or yarn installed!**

Production mode is faster than development mode; 
however, development mode has more information displayed in console.

To start client in development mode you need to execute:

````
cd src/main/frontend
npm/yarn run start
````
To start client in production mode you need to execute:
````
cd src/main/frontend
npm/yarn run build

yarn global add serve
serve -s build
````
## License
This project is licensed under the Apache License, Version 2.0 - 
see the [LICENSE](https://github.com/dominieq/rule-work/blob/master/LICENSE) file for details.
## Acknowledgements
TODO