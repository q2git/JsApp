REM #######################################
REM create 32bit & 64bit environment
REM #######################################
REM https://stackoverflow.com/questions/33709391/using-multiple-python-engines-32bit-64bit-and-2-7-3-5
REM Make sure to set the right environmental variables (https://github.com/conda/conda/issues/1744)

REM Create a new environment for 32bit Python 2.7:
REM set CONDA_FORCE_32BIT=1
REM conda create -n py27_32 python=2.7

REM Activate it:
REM set CONDA_FORCE_32BIT=1
REM activate py27_32

REM Deactivate it:
REM deactivate py27_32

REM Create one for 64 bit Python 3.5:
REM set CONDA_FORCE_32BIT=
REM conda create -n py35_64 python=3.5

REM Activate it:
REM set CONDA_FORCE_32BIT=
REM activate py35_64

REM The best would be to write the activation commands in a batch file 
REM so that you have to type only one command and cannot forget to set the right 32/64 bit flag.

REM #######################################
REM BAT input data
REM #######################################
REM @echo off
REM set INPUT=
REM set /P INPUT=Type input: %=%
REM if "%INPUT%"=="" goto emptyinput
REM mshta vbscript:msgbox("%input%")(window.close)
REM ######BAT input data(not a preferred) 
REM @echo off
REM set INPUT=
REM set /P INPUT=Type input: %=%
REM if "%INPUT%"=="" goto emptyinput
REM goto validinput
REM :emptyinput
REM echo msgbox"Your input is empty">a.vbs&a.vbs REM: this will create a new file a.vbs
REM goto endoffile
REM :validinput
REM echo msgbox"Your input is: %INPUT%">a.vbs&a.vbs
REM :endoffile

set CONDA_FORCE_32BIT=1
activate 32bit

REM pip install -r requirments.txt 

REM #######################################
REM ##########installpackage.bat###########
REM #######################################
REM @echo off
REM REM set PSW=
REM REM set /P PSW=Please input your password: %=%

REM REM input password without echo
REM set "psCommand=powershell -Command "$pword = read-host 'Enter Password' -AsSecureString ; ^
  REM $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword); ^
	  REM [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)""
REM for /f "usebackq delims=" %%p in (`%psCommand%`) do set PSW=%%p
REM REM echo %PSW%

REM if "%PSW%"=="" (goto emptyinput) else (goto validinput)

REM :emptyinput
REM echo Empty password is not allowed.
REM goto endoffile

REM :validinput
REM set PKG=
REM set /P PKG=Enter package name: %=%
REM echo The package name your input is ["%PKG%"]

REM pip install "%PKG%" --proxy http://username:"%PSW%"@10.54.5.107:8080

REM :endoffile
REM echo ----END----
REM pause


REM  set PYTHONIOENCODING=UTF-8 REM for LookupError: unknown encoding: idna