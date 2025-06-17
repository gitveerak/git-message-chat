from flask import Flask, render_template, redirect, url_for, session, request, flash, jsonify, send_file, abort
from flask_socketio import SocketIO,emit,join_room
# from dotenv import load_dotenv
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from bson import ObjectId
from flask_bcrypt import Bcrypt
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)
# load_dotenv()                 # used for local env  use 
app.secret_key = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


MONGO_URI = os.getenv("MONGO_URI")       # DATABASE
client = MongoClient(MONGO_URI) 
db = client["message_db"]  
collection = db["message_users"]
collection2 = db["message_storage"]


login_manger = LoginManager(app)         # User Autherication
login_manger.login_view = 'login'
bcrypt = Bcrypt(app)


UPLOAD_FOLDER = 'uploads_private'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
                                                            #   Img folder with uploads
@app.route('/upload_image', methods=['POST'])
def upload_image():
    file = request.files.get('image')
    sender = request.form.get('sender')
    receiver = request.form.get('receiver')

    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    ext = os.path.splitext(file.filename)[1]
    filename = secure_filename(f"{uuid.uuid4().hex}{ext}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(filepath)
        # print("✅ Image saved:", filepath)

        # Save just path and metadata
        collection2.insert_one({
            'sender': sender,
            'receiver': receiver,
            'image_path': filepath,    # absolute path on disk
            'filename': filename,      # for accessing in route
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

        return jsonify({'filename': filename, 'image_path': filepath})

    except Exception as e:
        print("❌ Error saving image:", e)
        return jsonify({'error': str(e)}), 500


def db_save_message(sender, receiver, message):
    result = collection2.insert_one({
        "sender": sender,
        "receiver": receiver,
        "message": message,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    return str(result.inserted_id)

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
    flash(message)
    print(message)
    return jsonify({'success': True, 'message': message})
    
@app.route("/home")
@login_required
def home():
    current_user = session.get('current_username')
    if not current_user:
        return redirect('/login')
    
    other_user_list = list(collection.find({"username": {"$ne": current_user}},{"_id": 0, "username": 1}))
    return render_template('home.html', other_user_list=other_user_list, username=session['current_username'])


@socketio.on('delete_private_message')
def handle_delete(data):
    msg_id = data.get('msg_id')
    sender = data.get('sender')   # Make sure frontend sends these
    receiver = data.get('receiver')

    if not msg_id or not sender or not receiver:
        return
    
    message = collection2.find_one({"_id": ObjectId(msg_id)})

    if not message:
        return

    result = collection2.delete_one({"_id": ObjectId(msg_id)})
    if result.deleted_count:
        image_path = message.get('image_path')
        if image_path:
            full_path = os.path.join(UPLOAD_FOLDER, os.path.basename(image_path))
            try:
                if os.path.exists(full_path):
                    os.remove(full_path)
                    print(f"Deleted image file: {full_path}")
            except Exception as e:
                print(f"Error deleting file {full_path}: {e}")
        # Only emit to sender and receiver rooms
        emit('message_deleted', {"msg_id": msg_id}, room=sender)
        emit('message_deleted', {"msg_id": msg_id}, room=receiver)

    
@socketio.on('user_connected')
def on_connect(data):
    username = data.get('username')
    join_room(username)   
    print(f'{username} connected!')
    
@app.route('/chat_history/<receiver>')
@login_required
def chat_history(receiver):
    current_user = session.get('current_username')
    if not current_user:
        return jsonify([])

    chats = list(collection2.find({
        "$or": [
            {"sender": current_user, "receiver": receiver},
            {"sender": receiver, "receiver": current_user}
        ]
    }).sort("timestamp"))

    # Optional: Format messages for frontend
    formatted = [
        {   "_id": str(chat["_id"]),"sender": chat["sender"], "receiver": chat["receiver"],
                "image": chat.get("image"), "timestamp": chat.get("timestamp"), "message": chat.get("message"),
                    "filename": chat.get("filename") or (os.path.basename(chat["image_path"])
                        if "image_path" in chat else None) 
        }
        for chat in chats
    ]

    return jsonify(formatted)

@app.route('/private_image/<filename>')         #   Secure Image Serving
def private_image(filename):
    filepath = os.path.join('uploads_private', filename)
    # print(filepath)

    # Look up access rights in DB
    image_doc = collection2.find_one({'filename': filename})
    if not image_doc:
        abort(404)

    if current_user.username not in [image_doc['sender'], image_doc['receiver']]:
        abort(403)  # Not authorized

    return send_file(filepath)

@socketio.on('send_private_message')
def private_msg(data):
    message = data.get('message')
    receiver = data.get('receiver')
    sender = data.get('sender')
    
    # print(f"Private message from {sender} to {receiver}: {message}")

    # Save to DB
    msg_id = db_save_message(sender, receiver, message)
    data['_id'] = msg_id  # Attach ID to emit data
    # print (data['_id'])

    # Emit to both sender and receiver rooms
    room_sender = sender
    room_receiver = receiver
    
    emit('receive_private_message', data, room=room_sender)
    emit('receive_private_message', data, room=room_receiver)


@socketio.on('send_image_url')      #    #   Notify Receiver
def handle_image_url(data):
    sender = data['sender']
    receiver = data['receiver']
    filename = os.path.basename(data['image_path'])
    # print(f'{filename}')

    emit('receive_image', {
        'sender': sender,
        'image_url': f'/private_image/{filename}'
    }, room=receiver)



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Get the port from the environment variable or default to 5000
    socketio.run(app,host='0.0.0.0', port=port, allow_unsafe_werkzeug=True) #   debug=True
