# Beloris RP Repository

Requires Node v.16.0.0

## Apps and usage

### Backend server

Backend server is made on nestjs with mysql database, and socket connection.
It is used to operate and handle requests from frontend appps.

### frontend

Core front interfaces for main app

### Electron app

Main focus of this project. It's a desktop app used for authenticating, file management and other usefull features for Beloris project.

## Installation

### Dependencies

To install dependencies run the following command:

```
yarn install
```

When adding dependencies to the project you need to run following command:

```
yarn add <dependency>
```

And similarly removing:

```
yarn remove <dependency>
```

### Database

After installing dependencies you should run docker to install mysql database for this project:

```
docker-compose -up
```

When DB is ready for use import all migrations:

```
yarn run typeorm migration:run
```

And finally load some basic data:

```
yarn run db:import
```

## Running specific projects

to run a project you need to type following command:

```
yarn nx serve <project>
```

In case of main app to release it:

```
yarn nx-electron:make
```
