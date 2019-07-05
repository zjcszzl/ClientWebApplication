import pyodbc
import json
conn_str = 'DRIVER=ODBC Driver 13 for SQL Server;SERVER=192.168.2.54;PORT=1433;DATABASE=代理商服务平台;UID=sa;PWD=abc.123'
connection = pyodbc.connect(conn_str)
sql = 'SELECT * FROM CUST'
# sql = 'SELECT * FROM LOGIN'
cursor = connection.cursor()
file = open('Customer.json','w',encoding='utf-8')
#   file = open('Login.json','w',encoding='utf-8')
with connection:
    cursor.execute(sql)
    data = []
    for row in cursor:
        '''
        data1 = {'LOGIN_NO':row[0],
                'LOGIN_NAME':row[1],
                'LOGIN_PWD':row[2],
                'LOGIN_TYPE':row[3],
                'CORRE_SALE':row[4],
                'CORRE_CUST':row[5],
                'VALID_TIME':row[6],
                'ISADMIN':row[7],
                'INPUT_DATE':row[8]
        }
        '''
        
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
    json.dump(data,file,ensure_ascii=False)
        # print('row = %r' % (row,))
file.close()