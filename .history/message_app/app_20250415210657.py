from flask import Flask, render_template, session, request
from flask_socketio import SocketIO,emit,join_room
from dotenv import load_dotenv
from datetime import datetime
import os

app = Flask(__name__)
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')