# -*- coding: utf-8 -*-
"""
 http://outofmemory.cn/code-snippet/1494/ 
 python使用Mutex保证程序只有一个实例运行
 在开始时，程序创建了一个命名的mutex，这个mutex可以被其他进程检测到。
 这样如果程序已经启动，再次运行时的进程就可以检测到程序已运行，
 从而不会继续运行。
"""

from win32event import CreateMutex
from win32api import CloseHandle, GetLastError
from winerror import ERROR_ALREADY_EXISTS

class singleinstance:
    """ Limits application to single instance """

    def __init__(self, mutexName="singleinstance"):
        self.mutexname = mutexName
        #self.mutexname = "testmutex_{D0E858DF-985E-4907-B7FB-8D732C3FC3B9}"
        self.mutex = CreateMutex(None, False, self.mutexname)
        self.lasterror = GetLastError()

    def aleradyrunning(self):
        return (self.lasterror == ERROR_ALREADY_EXISTS)

    def __del__(self):
        if self.mutex:
            CloseHandle(self.mutex)

#---------------------------------------------#
# 用法实例 #
#==============================================================================
 
#==============================================================================
#  from singleinstance import singleinstance
#  from sys import exit
#  
#  # 在程序运行之前运行下面代码
#  
#  myapp = singleinstance()
#  
#  # 检查是否已经有实例在运行了
#  if myapp.aleradyrunning():
#      print("Another instance of this program is already running")
#      exit(0)
#  
#  # 如果没有运行则正常运行程序
#  print( "No another instance is running, can continue here")
#==============================================================================
#==============================================================================
