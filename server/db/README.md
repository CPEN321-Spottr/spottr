# Database Migrations & Local Development Enviroment

Just a quick note before getting into the details: this process will be a lot less painful on Mac in my previous experience, but should also be possible on Windows and Linux. Further, there may be some steps that will need to be altered if setting up on a non-Mac system that you'll encounter, specifically fighting with Docker. One other discliamer is that I have a bunch of software development tools and packages installed on my computer, so it is possible that you may need to install some additional tools.

------

## Steps to set up the local development enviroment
1. Install Docker (and Docker-compose). Make sure to go into Docker settings and allocate at least 2gb of memory.
2. Navigate in terminal to `/server/db`
3. Run `sudo docker-compose -f db.docker-compose.yml up` and wait for it to print `Changed database context to 'master'.` (this will take ~30-45sec)
4. Open a new terminal window and run `sudo docker-compose -f migrate.docker-compose.yml up` and wait for it to print `db_flyway-migration_1 exited with code 0`
5. Profit

## Steps to cleanly restart local development enviroment
1. Execute `docker container ls` to see all active Docker containers
2. Execute `docker rm -v -f [CONTAINER ID]`, where `[CONTAINER ID]` is the mssql container id found by running the previous command
3. Execute `docker volume rm db_dbdata`

## Connecting to local development enviroment
To connect to a set-up local development enviroment, you'll require database management software. If you are using a JetBrain product, then you'll have a database management tool built into your IDE. Otherwise, extentions exist for other IDEs or you can use a free standalone software like DBeaver. Once you have your tools ready, you'll have to add a new connection with the following details:
- Host: `localhost`
- Port: `1433`
- User: `sa`
- Password: `Password123!`
- Database: `master`

------

## Overview of migrations
The mechanism we are using for migrations a tool called Flyway (https://flywaydb.org/). In short, this tool allows us to create versioned database migration files to make database schema updating very easy, clean, and straight-forward. There are a number of files in the `db` directory, but the only ones that matter for the migrations are found in the `migrations` sub-directory -- this folder contains all of the migration files for our database.

As previously mentioned, Flyway uses a version system. This is important to remember as all of the files follow a standard naming format of `Vx.xx__name`, where the `x` are numbers and `name` is some short description. 

Once a file is created and applied to a database (by running `migrate.docker-compose.yml`), that file can no longer be changed without fully resetting the database. This is perfectly fine to do in a local development enviroment, but very not ideal in a production enviroment. This rule occurs as Flyway keeps a checksum to ensure previous files are not changed. If you want to change something that a previous file did, you will have to create a new file that changes that table. When database migrations are applied by Flyway, they are applied in sequential order.
