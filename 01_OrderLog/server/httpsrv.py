# -*- coding: utf-8 -*-
"""
Created on Wed Jul 11 14:09:09 2018

@author: QIC3ZHU
"""
"""
HTTP Sever
"""

import os
import sys
import time
from http.server import SimpleHTTPRequestHandler, HTTPServer

from singleinstance import singleinstance
myapp = singleinstance("http server")

if myapp.aleradyrunning():
    print("Another instance of this program is already running")
    sys.exit(0)

#def url_ok(url, port):
#    # Use httplib on Python 2
#    try:
#        from http.client import HTTPConnection
#    except ImportError:
#        from httplib import HTTPConnection
#
#    try:
#        conn = HTTPConnection(url, port)
#        conn.request("GET", "/")
#        r = conn.getresponse()
#        return r.status == 200
#    except:
#        #logger.exception("Server not started")
#        return False
    
        
def run(port=8000, srvdir='.'):
    
    basedir = os.path.dirname(os.path.abspath(sys.argv[0]))
    
    import socket
    myaddr = socket.gethostbyname(socket.gethostname()) #ip address
    txt = 'Time: {}\nAddr: {}\nBaseDir: {}\nSrvDir: {}\n{}\n\n'.format(
            time.ctime(), myaddr, basedir, srvdir, '#'*33)
    
    with open(os.path.join(basedir, 'httpsrv.log'),'a') as f:
        f.write(txt)
        
    os.chdir(basedir)  #change server directory
    os.chdir(srvdir)  #change server directory

    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    
    httpd.serve_forever() 

                   
    
if __name__ == '__main__': 
    port = 8000
    srvdir = '.'
    cnt_args = len(sys.argv)
    
    if cnt_args>1 and (sys.argv[1]).isdigit():
        port = int(sys.argv[1])
        
    if cnt_args>2: 
        srvdir = sys.argv[2]
        
    run(port, srvdir)