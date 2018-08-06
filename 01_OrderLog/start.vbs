dim ps,ps_str
Set objShell = createobject("wscript.shell")

REM 解决CMD黑色闪运行
REM 参考http://demon.tw/programming/vbs-run-and-exec.html?replytocom=1928
host = WScript.FullName
If LCase(Right(host, 11)) = "wscript.exe" Then
    objShell.run "cscript """ & WScript.ScriptFullName & chr(34), 0
    WScript.Quit
End If

Function find_yn(ps_str, pat)  '查找进程是否存在，不存在返回0
    Dim re,ms,m
    find_yn = 0
    set re = New RegExp
    re.Global = True
    re.MultiLine = True 
    re.Pattern = pat '"restsrv.exe" 
    set ms = re.Execute(ps_str)
    For Each m In ms
        'msgbox m
        find_yn = find_yn + 1
    Next
End Function
 
Dim sTime
sTime = 15
Set ps = objShell.Exec("tasklist")
ps_str = ps.Stdout.ReadAll

objShell.Popup "Starting OrderLog ...", 2, "Please wait...", 64+0

if find_yn(ps_str,"httpsrv.exe") then
	sTime = sTime - 5
	'objShell.Popup "HTTP server is running.", 2, "Close"
	'objShell.Run("taskkill /F /IM httpsrv.exe /T") 
else
	objShell.Popup "Starting HTTP server...", 2, "Please wait...", 64+0
	objShell.Run ".\srv\httpsrv.exe 8888 ..\web",0 
end if

wscript.sleep 1000 
'objShell.Popup "App is starting, please wait for "&sTime&" seconds", sTime, "Please wait...", 64+0
'objShell.Run("\\10.54.152.13\Test_Pro\RepairData\Temp\Tools\Firefox\firefox.exe http://127.0.0.1:8888")
objShell.Run("http://127.0.0.1:8888")

'msgbox ps_str
if find_yn(ps_str,"restsrv.exe") then
	sTime = sTime - 5
	'objShell.Popup "REST server is running.", 2, "Close"
	'objShell.Run("taskkill /F /IM restsrv.exe /T") 
else
	'objShell.Popup "Starting REST server...", 2, "Please wait...", 64+0
	objShell.Run ".\srv\restsrv.exe 8889",0 
end if


set ps = nothing
set objShell = nothing
 