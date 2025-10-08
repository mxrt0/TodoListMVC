# To-Do List MVC
SPA To-Do List application with CRUD and filtering functionality. Developed with vanilla JS/CSS + ASP.NET MVC + Minimal API + SQL Server

## Given Requirements
* This is an application where you should manage a todo list.
* Users should be able to Add, Delete, Update and Read from a database, using a SPA (single-page application). The user should never be redirected to a new page.
* You need to write a minimal API to connect the front-end and database.
* You need to use the JS Fetch API from your front-end to call your minimal API in the backend.
* You need to use Entity Framework, raw SQL isn't allowed.
* You don't need a navigation bar. No menu is necessary since you'll only have one page.
* Once you execute any operation, the todo-list needs to be automatically updated accordingly.
* When deleting, present an 'Are you sure?' confirmation message
* You need to add validation. For example, empty input shouldn't be allowed. Feel free to add more validations as you see fit.
* You need to handle errors gracefully, with a relevant error message presented to the user.

## Features
* Simply UI for adding tasks with title and due date validation.
* Searching by title functionality
* Calendar component for filtering tasks based on due date.
* Scrollable to-do tasks list.
* Seamless editing/deleting of tasks with instant page updates.
* Cached DB fetching for maximized loading speeds and reduced resource usage.

## Challenges
* Implementing all features and ensuring they all work as expected together (in pure vanilla JS and CSS).
* Designing the UI.

## Areas To Improve
* Writing efficient JS and CSS
* Front-End Design

## Lessons Learned
* Bootstrap and other design frameworks make life much easier
* Understanding JS and the fetch API is very important.

## Configuration instructions
* In the API project folder, there is an example appsettings.json file. Enter your SQL Server provider (in my case I used LocalDB) and alter the DB name if desired. If you are OK with using localdb
and don't mind the name, you can just remove the example extension and use the file as your config.
* In Visual Studio or your IDE of choice, set up a start profile such that the API and MVC projects are started simultaneously on pressing 'Start' or start them in separate console instances as you prefer.

## Resources
* Fetch API docs


