rem set CONDA_FORCE_32BIT=1
rem call activate 32bit

@echo off
set dist_folder=01_dist
set src_folder=02_src

taskkill /F /IM restsrv.exe /T
taskkill /F /IM httpsrv.exe /T

rd %dist_folder% /s/q
rd %src_folder% /s/q

pause
echo ######################
echo ##Making httpsrv.exe##
echo ######################
REM pause
cd server
pyinstaller.exe -F httpsrv.py


echo ######################
echo ##Making restsrv.exe##
echo ######################
REM pause
pyinstaller.exe -F restsrv.py

cd ..


echo ##########################################
echo ##Making distribution files to [%dist_folder%]##
echo ##########################################
REM pause
xcopy .\web .\%dist_folder%\web\ /s/y
xcopy .\server\dist\*.exe .\%dist_folder%\srv\ /s/y
copy killsrvs.bat .\%dist_folder%\srv\ /y
copy start.vbs .\%dist_folder%\ /y



echo ###################################
echo ##Backup source files to [02_srv]##
echo ###################################
REM pause
xcopy .\web .\%src_folder%\web\ /s/y
xcopy .\server\*.py .\%src_folder%\server\ /s/y 
copy * .\%src_folder%\ /y

