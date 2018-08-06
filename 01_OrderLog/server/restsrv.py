# -*- coding: utf-8 -*-
"""
Created on Fri Jul  6 15:32:54 2018

@author: QIC3ZHU
"""
"""
RESTful Sever
"""
import os
import sys
from singleinstance import singleinstance
myapp = singleinstance("restful server")

if myapp.aleradyrunning():
    print("Another instance of this program is already running")
    sys.exit(0)
    
import pyodbc   #for pyinstaller
import sqlite3  #for pyinstaller   
import flask
import flask_sqlalchemy
import flask_restless
import logging 
  
import socket
#myname = socket.getfqdn(socket.gethostname()) #computer name
myaddr = socket.gethostbyname(socket.gethostname()) #ip address
logfile = 'restsrv_{}.log'.format(myaddr)

basedir = os.path.dirname(os.path.abspath(sys.argv[0]))

log = logging.getLogger('werkzeug')
handler = logging.FileHandler(os.path.join(basedir, logfile), encoding='UTF-8')
log.addHandler(handler)
#log.setLevel(logging.ERROR)

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)

app.config['DEBUG'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#app.config['SQLALCHEMY_DATABASE_URI'] =  'mssql+pyodbc://andon:test@MFO'
#app.config['SQLALCHEMY_DATABASE_URI'] =  'mssql+pyodbc://andon13:test@10.54.152.13:1433/MFO?driver=SQL+Server'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.db')
db = flask_sqlalchemy.SQLAlchemy(app)

# Create your Flask-SQLALchemy models as usual but with the following two
# (reasonable) restrictions:
#   1. They must have a primary key column of type sqlalchemy.Integer or
#      type sqlalchemy.Unicode.
#   2. They must have an __init__ method which accepts keyword arguments for
#      all columns (the constructor in flask_sqlalchemy.SQLAlchemy.Model
#      supplies such a method, so you don't need to declare a new one).
#####################################


class TableName(db.Model):
    __tablename__ = '03_PO' #table name
    #__bind_key__ = 'DBNAME'
    
    #actually, Orders in DB is an integer. set it to varchar here to 
    #avoid 'SET IDENTITY_INSERT [03_PO_TEMP] ON' error on restsrv
    Order = db.Column('Orders', db.VARCHAR(10), primary_key=True)
    CP_FinishDate = db.Column('FinishDate_CP', db.DateTime)
    CP_OverDueReason = db.Column('OverDueReason_CP', db.NVARCHAR(200))
    CP_Aloss = db.Column('Aloss_CP', db.Integer)
    CP_Repair = db.Column('Repair_CP', db.Integer)
    CP_Scrap = db.Column('Scrap_CP', db.Integer)
    SMT_FinishDate = db.Column('FinishDate_SMT', db.DateTime)
    SMT_OverDueReason = db.Column('OverDueReason_SMT', db.NVARCHAR(200))
    SMT_Aloss = db.Column('Aloss_SMT', db.Integer)
    SMT_Repair = db.Column('Repair_SMT', db.Integer)
    SMT_Scrap = db.Column('Scrap_SMT', db.Integer)
    THT_FinishDate = db.Column('FinishDate_THT', db.DateTime)
    THT_OverDueReason = db.Column('OverDueReason_THT', db.NVARCHAR(200))
    THT_Aloss = db.Column('Aloss_THT', db.Integer)
    THT_Repair = db.Column('Repair_THT', db.Integer)
    THT_Scrap = db.Column('Scrap_THT', db.Integer)    
    ICT_FinishDate = db.Column('FinishDate_ICT', db.DateTime)
    ICT_OverDueReason = db.Column('OverDueReason_ICT', db.NVARCHAR(200))
    ICT_Aloss = db.Column('Aloss_ICT', db.Integer)
    ICT_Repair = db.Column('Repair_ICT', db.Integer)
    ICT_Scrap = db.Column('Scrap_ICT', db.Integer)
    FT_FinishDate = db.Column('FinishDate_FT', db.DateTime)
    FT_OverDueReason = db.Column('OverDueReason_FT', db.NVARCHAR(200))
    FT_Aloss = db.Column('Aloss_FT', db.Integer)
    FT_Repair = db.Column('Repair_FT', db.Integer)
    FT_Scrap = db.Column('Scrap_FT', db.Integer)    
    FA_FinishDate = db.Column('FinishDate_FA', db.DateTime)
    FA_OverDueReason = db.Column('OverDueReason_FA', db.NVARCHAR(200))
    FA_Aloss = db.Column('Aloss_FA', db.Integer)
    FA_Repair = db.Column('Repair_FA', db.Integer)
    FA_Scrap = db.Column('Scrap_FA', db.Integer)
    
    def __repr__(self):
        return '<TableName %r>' % self.name

    
    
# Create the database tables.
db.create_all()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Credentials','true')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
    
# Create the Flask-Restless API manager.
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
# manager.create_api(Person, methods=['GET', 'POST', 'DELETE'])

manager.create_api(TableName, methods=['GET',],
                   url_prefix='',
                   collection_name='', #http://127.0.0.1:5000
                   include_columns=['Order',],
                   results_per_page=1,
                   )

manager.create_api(TableName, methods=['GET','POST','PUT','DELETE'],
                   url_prefix='',
                   collection_name='cn', #http://127.0.0.1:5000/cn
                   #exclude_columns=['field1','field2','field3'],
                   #include_columns=['field4','field5'],
                   results_per_page=10,
                   )  

    
# start the flask loop
if __name__ == '__main__':
    if len(sys.argv)>1 and (sys.argv[1]).isdigit():
        port = int(sys.argv[1])
    else:
        port = 5000
        
    app.run(host='0.0.0.0', port=port, debug=False)
