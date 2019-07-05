
import flask
from flask import request  #获取参数
from flask_cors import CORS
 
 
 
server = flask.Flask(__name__) #创建一个flask对象
CORS(server)
@server.route('/login', methods=['get','post'])
def login():
    username = request.values.get('username') #获取参数
    password = request.values.get('password')
    if username and password:
        #sql = 'select User from user where User="%s"'%username
        #data = conn_mysql(sql)     
            return '{msg:"无数据"}'
 
 
server.run(port=5000,debug=True)
