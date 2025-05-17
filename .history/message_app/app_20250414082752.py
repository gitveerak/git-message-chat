from flask import Flask, render_template, session, request
from flask_socketio import SocketIO,emit,join_room
from dotenv import load_dotenv
from datetime import datetime
import os

app = Flask(__name__)
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)

@app.route('/')
@app.route('/<username>')
def chat(username):
    session['username'] = username
    return render_template('index.html', username=username)

@socketio.on('connect')
def handle_connect():
    username = session.get('username')
    if username:
        join_room(username)
        print(f"{username} connected and joined their room")

@socketio.on('private_message')
def handle_private_message(data):
    sender = session.get('username')
    recipient = data['to']
    message = data['message']

    emit('receive_message', {
        'from': sender,
        'message': message
    }, room=recipient)

if __name__ == '__main__':
    socketio.run(app, debug=True)