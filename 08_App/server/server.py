# -*- coding: utf-8 -*-
"""
Created on Fri Jul  6 15:32:54 2018

@author: QIC3ZHU
"""

import flask
import flask_sqlalchemy
import flask_restless
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True

#app.config['SQLALCHEMY_DATABASE_URI'] =  'mssql+pyodbc://andon:test@DBNAME'
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
    __tablename__ = 'tablename' #table name
    #__bind_key__ = 'DBNAME'
    
    field0 = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    field1 = db.Column('date', db.DateTime, nullable=True)
    field2 = db.Column('todo', db.VARCHAR(100))
    field3 = db.Column('name', db.VARCHAR(50))
    field4 = db.Column('due', db.DateTime)
    field5 = db.Column('yn', db.VARCHAR(10))
    field6 = db.Column('remark', db.VARCHAR(500))
    
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


manager.create_api(TableName, methods=['GET','POST','PUT','DELETE'],
                   url_prefix='',
                   collection_name='cn',
                   #exclude_columns=['field1','field2','field3'],
                   #include_columns=['field4','field5'],
                   results_per_page=10,
                   )
                      
# start the flask loop
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)