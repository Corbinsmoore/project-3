import sqlite3, json

# Logic for reading data from SQL

def get_all_data():
  
    #connection object
    connection_obj = sqlite3.connect('./data/names.db') 

    # cursor object 
    cursor_obj = connection_obj.cursor() 

    statement = "SELECT * FROM data_names_1980_current"
    cursor_obj.execute(statement) 
    connection_obj.commit() 
    output = cursor_obj.fetchall()
    data = [{"state": item[0], "gender": item[1], "year": item[2], "name": item[3], "number": item[4]} for item in output]
    # Close the connection 
    connection_obj.close()

    return data
# returns data for three names: Joseph, Jacob, and Corbin
def get_cjj_data():
    #connection object
    connection_obj = sqlite3.connect('./data/names.db') 

    # cursor object 
    cursor_obj = connection_obj.cursor() 
    # SQL statement
    statement = "SELECT * FROM names_cjj"
    cursor_obj.execute(statement) 
    connection_obj.commit() 
    output = cursor_obj.fetchall()
    data = [{"state": item[0], "gender": item[1], "year": item[2], "name": item[3], "number": item[4]} for item in output]
    # Close the connection 
    connection_obj.close()

    return data

