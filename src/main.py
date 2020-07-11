import pyodbc
import json
import flask
from flask import request,jsonify  #获取参数
from flask_cors import CORS


# header("Access-Control-Allow-Origin: *");
server = flask.Flask(__name__) #创建一个flask对象
CORS(server)

# 用于检验数据库中是否存在该登录用户
@server.route('/login', methods=['get','post'])
# http://127.0.0.1:5000/login?username=xxx&password=123456
def login():
    username = request.values.get('username') #获取参数
    # password = dll.DecodingPswd(password)
    # conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=SunSystem;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        # sql = "select * from LOGIN where LOGIN_NO='"+username+"' and LOGIN_PWD='"+password+"';"
        sql = "SELECT P.USR,P.NAME,P.PWD,P.ISSALM,P.ISCUST,P.B_DAT,P.E_DAT,P.COMP_BOSS FROM SUNSYSTEM..PSWD P WHERE COMPNO ='ABC' AND P.USR = '"+username+"';"
        cursor.execute(sql)
        #   if username and password: 
        num = 0 
        for row in cursor:
            data = {
                'LOGIN_NO': row[0],
                'LOGIN_NAME':row[1],
                'LOGIN_PWD':row[2],
                'LOGIN_TYPE_WORKER':row[3],
                'LOGIN_TYPE_CUSTOMER':row[4],
                'VALID_TIME_START':row[5],
                'VALID_TIME_END':row[6],
                'ISADMIN':row[7]
            }
            num = num + 1
        if num != 0:
            json_data = jsonify(data)
            res = flask.make_response(json_data)
            res.headers['Access-Control-Allow-Origin'] = '*'
            return res
        else:
            return "账号密码错误"
 
# 用于返回数据库中对应登录身份的客户信息
# http://127.0.0.1:5000/info?username=xxx&password=123456
@server.route('/info', methods=['get','post'])
def info():
    LOGIN_NO = request.values.get('username') #获取参数
    # password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        # sql = "select * from CUST where CUS_NO='"+LOGIN_NO+"';"
        sql = "SELECT C.CUS_NO,C.NAME,C.SAL,P.PWD,C.TEL1,C.CUS_ARE,A.NAME,C.CUS_LEVEL,C_.TXJS,C_.TSJS,C.STR_DD,C.END_DD,C_.TJ_CS,C.SYS_DATE,C_C.CUST_UP FROM CUST C LEFT JOIN SUNSYSTEM..PSWD P ON P.USR=C.CUS_NO LEFT JOIN CUST_Z C_ ON C.CUS_NO = C_.CUS_NO LEFT JOIN AREA A ON A.AREA_NO = C.CUS_ARE LEFT JOIN CUST_CHK C_C ON C_C.CUST_DW = C.CUS_NO AND DRC = 'T' WHERE C.CUS_NO = '"+LOGIN_NO+"';"
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
                'VALID_TIME_START':row[10],
                'VALID_TIME_END':row[11],
                'TJ_NUM':row[12],
                'SYS_DATE':row[13],
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
 
 # 用于返回数据库中所有客户的信息

@server.route('/allcust', methods=['get','post'])
# http://127.0.0.1:5000/allcust?username=xxx&password=123456
def allcust():
    # username = request.values.get('username') #获取参数
    # password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "SELECT C.CUS_NO,C.NAME,C.SAL,P.PWD,C.TEL1,C.CUS_ARE,A.NAME,C_.RANK,C_.TXJS,C_.TSJS,C.STR_DD,C.END_DD,C_.TJ_CS,C.SYS_DATE,C_C.CUST_UP FROM CUST C LEFT JOIN SUNSYSTEM..PSWD P ON P.USR=C.CUS_NO AND COMPNO = 'ABC' LEFT JOIN CUST_Z C_ ON C.CUS_NO = C_.CUS_NO LEFT JOIN AREA A ON A.AREA_NO = C.CUS_ARE LEFT JOIN CUST_CHK C_C ON C_C.CUST_DW = C.CUS_NO AND DRC = 'T';"
        # sql = "select * from CUST"
        cursor.execute(sql)
        #   if username and password: 
        num = 0 
        data = []
        for row in cursor:
            if(row[6] == None):  
                row[6] = '未指定位置'
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
                'VALID_TIME_START':row[10],
                'VALID_TIME_END':row[11],
                'TJ_NUM':row[12],
                'SYS_DATE':row[13],
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
 
# 用于返回数据库中被选中的客户信息
@server.route('/chosen', methods=['get','post'])
# http://127.0.0.1:5000/chosen?username=xxx&password=123456
def chosen():
    CUS_NAME = request.values.get('username') #获取参数
    # password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        # sql = "select * from CUST where CUS_NAME='"+CUS_NAME+"';"
        sql = "SELECT C.CUS_NO,C.NAME,C.SAL,P.PWD,C.TEL1,C.CUS_ARE,A.NAME,C_.RANK,C_.TXJS,C_.TSJS,C.STR_DD,C.END_DD,C_.TJ_CS,C.SYS_DATE,C_C.CUST_UP FROM CUST C LEFT JOIN SUNSYSTEM..PSWD P ON P.USR=C.CUS_NO AND COMPNO = 'ABC' LEFT JOIN CUST_Z C_ ON C.CUS_NO = C_.CUS_NO LEFT JOIN AREA A ON A.AREA_NO = C.CUS_ARE LEFT JOIN CUST_CHK C_C ON C_C.CUST_DW = C.CUS_NO AND DRC = 'T' WHERE C.NAME ='"+CUS_NAME +"';"      
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
                'VALID_TIME_START':row[10],
                'VALID_TIME_END':row[11],
                'TJ_NUM':row[12],
                'SYS_DATE':row[13],
                'CUS_UP':row[14],
            }
            # data.append(data1)
            num = num + 1
        if num != 0:
            json_data = jsonify(data)
            res = flask.make_response(json_data)
            res.headers['Access-Control-Allow-Origin'] = '*'
            return res
        else:
            return "ERROR"

# 用于update数据库，完成用户的修改密码的操作
@server.route('/changePWD', methods=['get','post'])
# http://127.0.0.1:5000/changePWD?username=xxx&password=123456
def changePWD():
    username = request.values.get('username') #获取参数
    password = request.values.get('password')
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "UPDATE LOGIN SET LOGIN_PWD='"+password+"' WHERE LOGIN_NO='"+username+"';"
        cursor.execute(sql)

        return "HERE"

# 从ERP数据库抓取订货单记录
@server.route('/OrderHistory',methods=['get','post'])
# http://127.0.0.1:5000/OrderHistory?username=xxx&password=123456
def OrderHistory():
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    username = request.values.get('username')
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "SELECT M.OS_ID, M.OS_NO, M.OS_DD, M.CUS_NO, M.CUR_ID, M.EXC_RTO, M.SYS_DATE, T.ITM, T.PRD_NO, T.PRD_NAME, T.QTY, T.UP, T.TAX, T.AMT, ISNULL(T.AMT_DIS_CNT,0) AS AMT_DIS_CNT, C.NAME, M.AMTN_NET, ISNULL(Z.ff_no,0) AS FF_NO FROM MF_POS AS M JOIN TF_POS AS T ON M.OS_ID = T.OS_ID AND M.OS_NO = T.OS_NO AND M.OS_ID IN ('SO','SR') JOIN CUST AS C ON C.CUS_NO = M.CUS_NO AND ISNULL(T.AMT_DIS_CNT,0) >= 0 LEFT JOIN ZQ1 AS Z ON Z.CUS_NO = M.CUS_NO WHERE C.NAME ='"+ username +"';"
        cursor.execute(sql)
        num = 0 
        data = []
        for row in cursor:
            data1 = {
                'OS_ID':row[0],
                'OS_NO':row[1],
                'OS_DD':row[2],
                'CUS_NO':row[3],
                'CUR_ID':row[4],
                'Gift_NO': row[17],
                'EXC_TRO':float(row[5]),
                'SYS_DATE':row[6],
                'ITM':row[7],
                'PRD_NO':row[8],
                'PRD_NAME':row[9],
                'QTY':float(row[10]),
                'UP':float(row[11]),
                'TAX':float(row[12]),
                'AMT':float(row[13]),
                'AMT_DIS_CNT':float(row[14]),
                'NAME': row[15],
                'Nontax_Amount' : float(row[16]),
                'Order_Amount': float(row[10]) * float(row[11]) * float(row[5]),
                'Order_total' : float(row[16]) + float(row[12]),
                'Gift_Amount': float(row[14]) * float(row[5])
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

# 从ERP数据库抓取外包记录
@server.route('/WaibaoHistory',methods=['get','post'])
# http://127.0.0.1:5000/OrderHistory?username=xxx&password=123456
def WaibaoHistory():
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    username = request.values.get('username')
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "SELECT M.OS_ID, M.OS_NO, M.OS_DD, M.CUS_NO, M.CUR_ID, M.EXC_RTO, M.SYS_DATE, T.ITM, T.PRD_NO, T.PRD_NAME, T.QTY, T.UP, T.TAX, T.AMT, ISNULL(T.AMT_DIS_CNT,0), C.NAME FROM MF_POS AS M JOIN TF_POS AS T ON M.OS_ID = T.OS_ID AND M.OS_NO = T.OS_NO AND M.OS_ID IN ('PO','PR') JOIN CUST AS C ON C.CUS_NO = M.CUS_NO WHERE C.NAME ='"+ username +"';"
        cursor.execute(sql)
        num = 0 
        data = []
        for row in cursor:
            data1 = {
                'OS_ID':row[0],
                'OS_NO':row[1],
                'OS_DD':row[2],
                'CUS_NO':row[3],
                'CUR_ID':row[4],
                'EXC_TRO':float(row[5]),
                'SYS_DATE':row[6],
                'ITM':row[7],
                'PRD_NO':row[8],
                'PRD_NAME':row[9],
                'QTY':float(row[10]),
                'UP':float(row[11]),
                'TAX':float(row[12]),
                'AMT':float(row[13]),
                'AMT_DIS_CNT':float(row[14]),
                'NAME': row[15],
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

#从ERP数据库抓取预收款记录
@server.route('/YushouHistory', methods = ['get','post'])
def YushouHistory():
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    username = request.values.get('username')
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "SELECT T.RP_ID,T.RP_NO,T.RP_DD,T.CUS_NO,T.CUR_ID,T.EXC_RTO,T.SYS_DATE,T.AMTN_BC,T.AMTN_BB,T.AMTN_CHK,T.AMTN_OTHER FROM TF_MON T JOIN CUST C ON C.CUS_NO = T.CUS_NO  AND T.RP_ID = 1 AND T.SK_TYPE = 1 AND T.IRP_ID = 'T' AND ISNULL(T.IEA_ID,'') <> 'T' AND ISNULL(T.IOR_ID,'') <> 'T' AND ISNULL(T.ISMULTCUS,'') <> 'T' AND C.NAME ='"+ username +"';"
        cursor.execute(sql)
        num = 0 
        data = []
        for row in cursor:
            if(row[9] == None):  
                row[9] = 0
            if(row[10] == None):  
                row[10] = 0
            if(row[7] == None):  
                row[7] = 0
            if(row[8] == None):  
                row[8] = 0
            if(row[5] == None):  
                row[5] = 0
            data1 = {
                'RP_ID':row[0],
                'RP_NO':row[1],
                'RP_DD':row[2],
                'CUS_NO':row[3],
                'CUR_ID':row[4],
                'EXC_RTO':float(row[5]),
                'SYS_DATE':row[6],
                'AMTN_BC':float(row[7]),
                'AMTN_BB':float(row[8]),
                'AMTN_CHK':float(row[9]),
                'AMTN_OTHER':float(row[10]),
                'Prepay_Total':float(row[7])+float(row[8])+float(row[9])+float(row[10])
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

# 从ERP数据库抓取赠券记录记录
@server.route('/ZengquanHistory',methods=['get','post'])
# http://127.0.0.1:5000/ZengquanHistory?username=xxx&password=123456
def ZengquanHistory():
    conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=DB_ABC;UID=sa;PWD=abc.123'
    username = request.values.get('username')
    connection = pyodbc.connect(conn_str)
    cursor = connection.cursor()
    with connection:
        sql = "select ff_no,cus_no,cus_name ,amtn_dke,sys_date from zq1 where isnull(tt,'')<>'T' and isnull(chk_man,'')<>'' and cus_name ='"+ username +"';"
        cursor.execute(sql)
        num = 0 
        data = []
        for row in cursor:
            data1 = {
                'FF_NO':row[0],
                'CUS_NO':row[1],
                'CUS_NAME':row[2],
                'AMTN_DKE':float(row[3]),
                'SYS_DATE':row[4],
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


server.run(host='0.0.0.0',port=5000,debug=True)







 
 
 

