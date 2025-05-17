from flask import Flask, render_template, redirect, url_for, session, request,flash,jsonify
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

        if user_data and bcrypt.check_password_hash(user_data["password"], password):
            user =User(user_data)
            login_user(user)
            session['current_username'] = user_data["username"]
            flash("Login successfully!!",'success')
            print("Login successfully!!") 
            return redirect(url_for('home'))
        
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
    
@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    message='Account logged out'
    session.clear()
    print(session.get('current_username'))
    print(message)
    return jsonify({'success': True, 'message': message})
    
@app.route("/home")
@login_required
def home():
    current_user = session.get('current_username')
    if not current_user:
        return redirect('/login')
    
    other_user_list = list(collection.find({"username": {"$ne": current_user}},{"_id": 0, "username": 1}))
    return render_template('home.html', other_user_list=other_user_list,username=session['current_username'])
    
@socketio.on('user_connected')
def on_connect(data):
    username = data.get('username')
    print(f'{username} connected!')
    join_room(username)

if __name__ == '__main__':
    socketio.run(app, debug=True)
