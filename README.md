# Welcome

Hi! This is simple API web application, which is used as a library management program. The goal of this project is exercise in developing functional applications, which are used to solve real-world problems. Feel free to check out other projects on my [Github profile.](https://github.com/Chantuu?tab=repositories)


# Showcase

This was written purely in JavaScript, so there is a list of used NPM Packages

-   _Express_
-   _Express Validator_
-   _Mongoose_
-  _Swagger UI Express_
-  _Swagger JSDoc_
-  _Method Override_
-  _UUID_
-  _DotEnv_

# Development Setup
## Prerequisites
Make sure, Node.js is installed in your machine before you start project setup. For more information [visit this website.](https://nodejs.org/en)

## Project Setup

If you want to modify existing project, first you have fork existing repository, which essentially makes a copy of this project in your Github account. After that you can clone forked repository either with  _Bash CLI_  or any  _GUI client_.

**Clone using Bash CLI**

~~~bash
git clone git@github.com:Your_Name/Guess_A_Word.git
~~~

Please change  _Your_Name_  text to your actual Github username.

## Installing Necessary Dependencies
This Node.js application requires some dependencies, which are listed in **package.json**.  To install those dependencies, run the command below in Bash CLI.

**Install Necessary  Dependencies**

~~~bash
npm install
~~~

> Additionally, you can install dependencies intended for development purposes using this command.

~~~bash
npm install --only=dev
~~~

## Environment Variables

This project primarily depends on three environment variables and it's **absolutely necessary** to have them set up in **.env** file inside **root directory** of the project.

```js
DATABASE_URI=Your_MongoDB_Connection_String_here
PORT=Your_Desired_Server_Port_Here
```

## Launching Application
To launch application server, run this command below (Make sure you are in root directory of the project).

 ```bash
node app.js
```

> If you installed dev dependencies, you can use Nodemon package to launch the server with automatic restart functionality on every change in the code.

 ```bash
npx nodemon app.js
```

# Licensing

This project does not have any licensing, which means that you can modify and redistribute existing codebase for your own use.