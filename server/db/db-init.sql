USE [master]
GO

IF DB_ID('master') IS NOT NULL
  set noexec on               -- prevent creation when already exists

/****** Create base database instance ******/
CREATE DATABASE [master];
GO

USE [master]
GO
