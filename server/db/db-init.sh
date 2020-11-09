#!/usr/bin/env bash

# wait for the SQL Server to come up
sleep 30

echo "running set up script"
#run the setup script to create the DB and the schema in the DB
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Password123! -d master -i db-init.sql
