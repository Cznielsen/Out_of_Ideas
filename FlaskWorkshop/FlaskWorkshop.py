from flask import Flask, request, render_template, redirect, url_for, abort, session, make_response
import os

from connection import Firebase_conn

app = Flask(__name__)

app.secret_key = os.urandom(24)

conn = Firebase_conn()


@app.route('/')
def hello_world():
    if session.get('username'):
        app.logger.error(session.get('username'))
        return 'Hello World!'
    return redirect(url_for('login'))


@app.route('/simple_login/', methods=['GET', 'POST'])
def simple_login():
    if request.method == 'GET':
        return render_template('login.html')

    if request.method == 'POST':
        # Find user Andy
        app.logger.error("The users password is {}".format(conn.get_user('Andy')))
        return redirect(url_for('home_page'))
    else:
        abort(403)


@app.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    if request.method == 'POST':
        try:
            username = request.form['username']
            password = request.form['password']
            app.logger.error(username)
            app.logger.error(password)

            # Attempt to find user on firebase
            attempted_username = conn.get_user(username)

            if attempted_username and attempted_username['password'] == password:
                app.logger.error("User is {} and the password matched: {}".format(attempted_username,
                                                                                  attempted_username[
                                                                                      'password'] == password))
                session['username'] = username
                return redirect(url_for('home_page'))

            app.logger.error("The users password is {}".format(conn.get_user('Andy')))
        except KeyError:
            pass
        return redirect(url_for('login'))
    else:
        abort(403)


@app.route('/home/')
def home_page():
    if session.get('username'):
        app.logger.error(session.get('username'))
        return render_template('home.html')
    return redirect(url_for('login'))


@app.route('/settings/')
def settings_page():
    if session.get('username'):
        app.logger.error(session.get('username'))
        return render_template('settings.html')
    return redirect(url_for('login'))


@app.route('/logout/')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


"""
routes for the d1mini
"""


@app.route('/api/d1mini', methods=['POST'])
def d1mini():
    app.logger.error(request.get_data())
    return "You posted to the FlaskWorkshop api/d1mini"


@app.route('/api/d1mini_with_auth', methods=['POST'])
def d1mini_with_auth():
    app.logger.error(request.get_data())
    try:
        if request.headers['auth'] == 'Andy':
            return "You posted with auth to the FlaskWorkshop api/d1mini_with_auth"
    except KeyError:
        pass
    return make_response("You are not Andy", 403)


@app.route('/api/getinfo', methods=['GET'])
def get_info():
    return "The d1mini information"


if __name__ == '__main__':
    app.run()
