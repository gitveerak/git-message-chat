from flask import Flask, render_template, session, request
from flask_socketio import SocketIO,emit,join_room
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from bson import ObjectId
from flask_bcrypt import Bcrypt
from datetime import datetime
import os

app = Flask(__name__)
load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

MONGO_URI = os.getenv("MONGO_URI")       # DATABASE
client = MongoClient(MONGO_URI) 
db = client["message_db"]  
collection = db["message_users"]

login_manger = LoginManager(app)         # User Autherication
login_manger.login_view = 'login'
bcrypt = Bcrypt(app)

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.email = user_data['email']
        self.username = user_data['username']

@login_manger.user_loader
def load_user(user_id):
    user_data = collection.find_one({'_id':ObjectId(user_id)})
    return User(user_data) if user_data else None

