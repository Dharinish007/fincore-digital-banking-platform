@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script for Windows
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

set ERROR_CODE=0

@REM Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
if not "%JAVACMD%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME is not defined correctly.
echo We cannot execute java
echo Please install JDK 17 or JDK 21 and set JAVA_HOME.
echo.
goto error

:OkJHome
if "%JAVACMD%" == "" set "JAVACMD=%JAVA_HOME%\bin\java.exe"

if exist "%JAVACMD%" goto runMaven

echo.
echo Error: JAVA_HOME is set to an invalid directory.
echo JAVA_HOME = "%JAVA_HOME%"
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
echo.
goto error

:runMaven
@REM Check if maven is already in path
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    mvn %*
    goto end
)

echo Notice: Maven command 'mvn' not in PATH.
echo Attempting to run via Spring Boot directly or installed Maven...
mvn %*
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
