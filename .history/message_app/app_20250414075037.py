from flask import Flask, render_template
from flask_socketio import SocketIO,send
from dotenv import load_dotenv
from datetime import datetime
import os

app = Flask(__name__)
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)

@app.route('/')
@app.route('home')
def index():
    return render_template('index.html')