from flask import Flask
import data_logic

app = Flask(__name__)

@app.route("/")
def all_data():
    return data_logic.get_all_data()