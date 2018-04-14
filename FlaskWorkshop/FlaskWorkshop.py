from flask import Flask, request, render_template, redirect, url_for, abort, session, make_response
import os

from connection import Firebase_conn

app = Flask(__name__)

app.secret_key = os.urandom(24)

conn = Firebase_conn()


@app.route('/')
def home_page():
    return render_template('home.html')


if __name__ == '__main__':
    app.run()
