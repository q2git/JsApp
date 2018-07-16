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
from http.server import SimpleHTTPRequestHandler, HTTPServer

            
def run(port=8000):
    
    basedir = os.path.dirname(os.path.abspath(sys.argv[0]))
    os.chdir(basedir)
    if __name__ == '__main__':
        #change server directory to 'basedir/web'
        os.chdir('../web')
    else:
        os.chdir('./web')

    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    
    httpd.serve_forever() 

    
if __name__ == '__main__':
    
    run()