# Seat Reservation System

This project implements a simple seat reservation system that allows users to book available seats in a movie theater. The system is built using JavaScript with the Nuxt.js 3 framework and utilizes MySQL for database management.

### Table of Contents
- [Prerequisites](#prerequisites)
- [Installation and Running](#installation-and-running)
- [Features](#features)
- [Technologies](#technologies)

## Prerequisites

Before running the project, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org)
- [MySQL](https://www.mysql.com/)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

## Installation and Running

0. First, clone the repository and go to the root folder of the project:

```bash
git clone git@github.com:siyar25/bardiAutoHomework.git
```

```bash
cd bardiAutoHomework
```


1. Install the necessary dependencies with the following command:

```bash
npm install
```

2. Open your preferred MySQL database management tool and log in with the appropriate credentials (username and password).

- Create a new database with a suitable name, for example, `bardi_auto_cinema`.
> If you choose another name, **don't forget to change the `DB_NAME` variable in the `.env` file as well**.

- Or run the `createDatabase.sql` script in the **MySQL Workbench** inside a **MySQL Connection** to create the appropriate database.
- Or type it in manually:
  ```sql
  CREATE DATABASE bardi_auto_cinema
  ```

3. Set up the database connection details in the `.env` file:

```env
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = password
DB_NAME = bardi_auto_cinema
```

4. Start the development environment with the following command:

```bash
npm run dev
```

5. Visit **[http://localhost:3000](http://localhost:3000)** in your browser and start using the seat reservation system.

## Features

- The application allows users to book available seats in the movie theater.
- Only one successful reservation is allowed on an available seat at a time.
- A user can reserve 1 or 2 available seats simultaneously.
- If the reservation fails, the seat will automatically be released after 2 minutes.
- Users can view the status of seats as "available", "booked", or "sold".
- After a successful reservation, users are prompted to provide their email address for confirmation.

## Technologies

- JavaScript
- Node.js
- Nuxt.js 3
- MySQL
