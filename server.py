from flask import Flask,jsonify, render_template
import data_logic

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/all")
def all_data():
    response = jsonify(data_logic.get_all_data())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/cjj")
def cjj_data():
    response = jsonify(data_logic.get_cjj_data())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True)