from flask import Flask, render_template, redirect, url_for, session, request,flash
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

@app.route("/")
@app.route('/login' , methods = ['GET', 'POST'])            # Login
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user_data = collection.find_one({"email":email})
            #   Get data from login form

        if user_data and bcrypt.check_password_hash(user_data["password"], password):
            user =User(user_data)
            login_user(user)
            flash("Login successfully!!",'success')
            print("Login successfully!!") 
            return render_template('index.html')
            # Check email,password with store user to loginmanager
        else:
            flash("Login Failed!",'danger')
            print("Login Failed!")

    return render_template('login.html')


@app.route('/register', methods = ['GET', 'POST'])      # Register
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        if collection.find_one({'email': email}):
            flash("Email is Already exists!",'danger')
            return redirect(url_for('register'))
        
        data ={'username':username,
                    'email':email,
                        'password':hashed_password,
                            "Created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    }
        collection.insert_one(data)
        flash("Account successfully created!!",'success')
        return redirect(url_for('login'))

    return render_template('register.html')
    

if __name__ == '__main__':
    app.run(debug=True)
