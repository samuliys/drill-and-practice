# Project 2: Drill and Practice

### **Web software development**


## App

"Drill and Practice" is a web application that is used for repeated practice of learned content. The application provides a list of topics and allows creating multiple-choice questions into those topics that are then answered by self and others. The application also shows basic statistics: the total number of available questions and the total number of question answers. In addition, the application also provides an API for retrieving and answering random questions.

## Online deployment

The app has been deployed online and can be used at [www.drill.fly.dev](https://google.com)

## Running locally

The app can be run locally using docker with command (on root folder)  
```docker-compose up```

Running the app locally automatically creates an admin account with email _admin@admin.com_ and password _123456_. These are given in the documentation for testing and grading purposes.

The server can be stopped with command ```CTRL+C```

## Testing

The app has over 10 tests that test both the application and its usage as well as the api. The tests are split into two files that are located at /e2e-playwright/tests/ 

All test can be run at once with command  
```docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf```

## Project structure


The application follows a three-tier architecture.
Application uses a layered architecture with views, controllers, services, and database. Dependencies are defined in a file called deps.js, which exports them into use of the project.

The file structure is as follows:
```
├── drill-and-practice  
│   ├── config  
│   │   └── readme.txt  
│   ├── database  
│   │   └── database.js  
│   ├── middlewares  
│   │   ├── authMiddleware.js  
│   │   ├── errorMiddleware.js  
│   │   ├── renderMiddleware.js  
│   │   └── serveStaticMiddleware.js  
│   ├── routes  
│   │   ├── apis  
│   │   │   ├── questionApi.js  
│   │   │   └── readme.txt  
│   │   ├── controllers  
│   │   │   ├── loginController.js  
│   │   │   ├── mainController.js  
│   │   │   ├── questionController.js  
│   │   │   ├── quizController.js  
│   │   │   ├── registrationController.js  
│   │   │   ├── statisticsController.js  
│   │   │   └── topicController.js  
│   │   └── routes.js  
│   ├── services  
│   │   ├── questionService.js  
│   │   ├── readme.txt  
│   │   ├── statisticsService.js  
│   │   ├── topicService.js  
│   │   └── userService.js  
│   ├── static  
│   │   └── readme.txt  
│   ├── tests  
│   │   ├── api_test.js  
│   │   └── readme.txt  
│   ├── views  
│   │   ├── layouts  
│   │   │   ├── layout.eta  
│   │   │   └── temp.eta  
│   │   ├── partials  
│   │   │   └── readme.txt  
│   │   ├── error.eta  
│   │   ├── login.eta  
│   │   ├── main.eta  
│   │   ├── noQuestions.eta  
│   │   ├── question.eta  
│   │   ├── quizQuestion.eta  
│   │   ├── quizTopics.eta  
│   │   ├── registration.eta  
│   │   ├── result.eta  
│   │   ├── topic.eta  
│   │   └── topics.eta  
│   ├── Dockerfile  
│   ├── app.js  
│   ├── deps.js  
│   └── run-locally.js  
├── e2e-playwright  
│   ├── tests  
│   │   ├── api_test.spec.js  
│   │   └── drill-and-practice_test.spec.js  
│   ├── Dockerfile  
│   ├── package.json  
│   └── playwright.config.js  
├── flyway  
│   └── sql  
│       └── V1___initial_schema.sql  
├── README.md  
├── docker-compose.yml  
└── project.env  
```