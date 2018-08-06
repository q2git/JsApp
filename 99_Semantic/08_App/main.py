# -*- coding: utf-8 -*-
"""
Created on Thu Jul 12 07:53:34 2018

@author: QIC3ZHU
"""
#import PyQt5
#from PyQt5.QtCore import *
#from PyQt5.QtWidgets import *
#from PyQt5.QtWebKitWidgets import *
#
#
#class Form(QWidget):
#     def __init__(self, parent=None):
#         super(Form, self).__init__(parent)
# 
#         tmp = QWebView()
# 
#         buttonLayout1 = QVBoxLayout()
#         buttonLayout1.addWidget(tmp)
# 
#         mainLayout = QGridLayout()
#         mainLayout.addLayout(buttonLayout1, 1, 1)
# 
#         self.setLayout(mainLayout)
#         self.setWindowTitle("Hello Qt")
#         tmp.load(QUrl('http://www.baidu.com'))
#         tmp.show()
# 
# 
#if __name__ == '__main__':
#     import sys
#     app = QApplication(sys.argv)
#     screen = Form()
#     screen.show()
#     sys.exit(app.exec_())

import PyQt5
from PyQt5.QtCore import QUrl 
from PyQt5.QtWidgets import QApplication, QWidget 
try:
    from PyQt5.QtWebKitWidgets import QWebView , QWebPage
    from PyQt5.QtWebKit import QWebSettings
except ModuleNotFoundError:
    from PyQt5.QtWebEngineWidgets import QWebEngineView as QWebView , QWebEnginePage as QWebPage 
    from PyQt5.QtWebEngine import QQuickWebEngineProfile as QWebSettings
    
from PyQt5.QtNetwork import *
import sys
from optparse import OptionParser
from threading import Thread
from time import sleep
from server import httpsrv, restsrv 
 
class MyBrowser(QWebPage):
    ''' Settings for the browser.'''
 
    def userAgentForUrl(self, url):
        ''' Returns a User Agent that will be seen by the website. '''
        return "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
 
class Browser(QWebView):
    def __init__(self):
        # QWebView
        self.view = QWebView.__init__(self)
        #self.view.setPage(MyBrowser())
        self.setWindowTitle('Loading...')
        self.titleChanged.connect(self.adjustTitle)
        #super(Browser).connect(self.ui.webView,QtCore.SIGNAL("titleChanged (const QString&)"), self.adjustTitle)
 
    def load(self,url):  
        self.setUrl(QUrl(url)) 
 
    def adjustTitle(self):
        self.setWindowTitle(self.title())
 
    def disableJS(self):
        settings = QWebSettings.globalSettings()
        settings.setAttribute(QWebSettings.JavascriptEnabled, False)
 
 
def runGui():
    app = QApplication(sys.argv) 
    view = Browser()
    view.showNormal()
    view.load("http://127.0.0.1:8000")
    app.exec_()


def url_ok(url, port):
    # Use httplib on Python 2
    try:
        from http.client import HTTPConnection
    except ImportError:
        from httplib import HTTPConnection

    try:
        conn = HTTPConnection(url, port)
        conn.request("GET", "/")
        r = conn.getresponse()
        return r.status == 200
    except:
        #logger.exception("Server not started")
        return False

def main():
    ip = '127.0.0.1'
    port1 = 8000 #http server
    port2 = 5000 #rest server
    
    print("Starting server")
    t1 = Thread(target=httpsrv.run, args=(port1,))
    t1.daemon = True
    t1.start()
    
    t2 = Thread(target=restsrv.run, args=(port2,))
    t2.daemon = True
    t2.start()
    
    print("Checking RESTful server")
    while not url_ok(ip, port2):
        sleep(1)
    print("RESTful server OK")  
    print("Checking HTTP server")    
    while not url_ok(ip, port1):
        sleep(1)        
    print("HTTP server ok")

if __name__ == '__main__':
    main()
    runGui()
