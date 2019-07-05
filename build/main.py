import pyodbc
import json
import flask
from flask import request,jsonify  #获取参数
from flask_cors import CORS
 
 
# header("Access-Control-Allow-Origin: *");
server = flask.Flask(__name__) #创建一个flask对象
CORS(server)
@server.route('/login', methods=['get','post'])
# http://127.0.0.1:5000/login?username=xxx&password=123456
def login():
    username = request.values.get('username') #获取参数
    password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "select * from LOGIN where LOGIN_NO='"+username+"' and LOGIN_PWD='"+password+"';"
        cursor.execute(sql)
        #   if username and password: 
        num = 0 
        for row in cursor:
            data = {'LOGIN_NO':row[0],
                'LOGIN_NAME':row[1],
                'LOGIN_PWD':row[2],
                'LOGIN_TYPE':row[3],
                'CORRE_SALE':row[4],
                'CORRE_CUST':row[5],
                'VALID_TIME':row[6],
                'ISADMIN':row[7],
                'INPUT_DATE':row[8]
            }
            num = num + 1
        if num != 0:
            json_data = jsonify(data)
            res = flask.make_response(json_data)
            res.headers['Access-Control-Allow-Origin'] = '*'
            return res
        else:
            return "账号密码错误"
 



# http://127.0.0.1:5000/info?username=xxx&password=123456
@server.route('/info', methods=['get','post'])
def info():
    LOGIN_NO = request.values.get('username') #获取参数
    password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "select * from CUST where CUS_NO='"+LOGIN_NO+"';"
        cursor.execute(sql)
        #   if username and password: 
        num = 0 
        for row in cursor:
            data = {
                'CUS_NO':row[0],
                'CUS_NAME':row[1],
                'SAL':row[2],
                'PASSWORD':row[3],
                'CUS_TEL':row[4],
                'CUS_AREA':row[5],
                'AREA_NAME':row[6],
                'CUS_RANK':row[7],
                'TXJS':row[8],
                'TSJS':row[9],
                'VALID_TIME':row[10],
                'TJ_NUM':row[11],
                'SYS_DATE':row[12],
                'INPUT_DATE':row[13],
                'CUS_UP':row[14],
            }
            num = num + 1
        if num != 0:
            json_data = jsonify(data)
            res = flask.make_response(json_data)
            res.headers['Access-Control-Allow-Origin'] = '*'
            return res
        else:
            return "error"
 
 
@server.route('/allcust', methods=['get','post'])
# http://127.0.0.1:5000/allcust?username=xxx&password=123456
def allcust():
    username = request.values.get('username') #获取参数
    password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "select * from CUST"
        cursor.execute(sql)
        #   if username and password: 
        num = 0 
        data = []
        for row in cursor:
            data1 = {
                'CUS_NO':row[0],
                'CUS_NAME':row[1],
                'SAL':row[2],
                'PASSWORD':row[3],
                'CUS_TEL':row[4],
                'CUS_AREA':row[5],
                'AREA_NAME':row[6],
                'CUS_RANK':row[7],
                'TXJS':row[8],
                'TSJS':row[9],
                'VALID_TIME':row[10],
                'TJ_NUM':row[11],
                'SYS_DATE':row[12],
                'INPUT_DATE':row[13],
                'CUS_UP':row[14],
            }
            data.append(data1)
            num = num + 1
        if num != 0:
            json_data = jsonify(data)
            res = flask.make_response(json_data)
            res.headers['Access-Control-Allow-Origin'] = '*'
            return res
        else:
            return "ERROR"
 

server.run(port=5000,debug=True)







 
 
 

