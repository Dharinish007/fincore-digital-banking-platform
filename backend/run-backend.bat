@echo off
title FinCore Banking Platform - Java Spring Boot Backend
echo ========================================================
echo    FinCore Secure Digital Banking Platform (Backend)
echo    Java 17/21 + Spring Boot 3 + Spring Data JPA + MySQL
echo ========================================================
echo.

echo Checking Java installation...
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java JDK is not installed or not in your system PATH!
    echo Please install Java JDK 17 or JDK 21 from:
    echo https://adoptium.net/temurin/releases/
    echo After installing, reopen VS Code terminal and run this script again.
    pause
    exit /b 1
)

echo Java detected!
echo.

echo Checking Maven...
mvn -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Running Spring Boot via Global Maven: 'mvn clean spring-boot:run'...
    mvn clean spring-boot:run
) else (
    echo Global 'mvn' not found in PATH.
    echo Using Maven Wrapper: 'mvnw.cmd spring-boot:run'...
    if exist mvnw.cmd (
        call mvnw.cmd clean spring-boot:run
    ) else (
        echo [ERROR] Maven is not installed in PATH and mvnw.cmd is missing.
        echo Please install Apache Maven from: https://maven.apache.org/download.cgi
        pause
    )
)
