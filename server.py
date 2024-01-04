from flask import Flask
import data_logic

app = Flask(__name__)

@app.route("/all")
def all_data():
    return data_logic.get_all_data()

@app.route("/cjj")
def cjj_data():
    return data_logic.get_cjj_data()