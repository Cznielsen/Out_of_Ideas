from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)


@app.route('/')
def index():
    return redirect('home')


@app.route('/home/')
def home():
    return render_template('home.html')


@app.route('/gallery/', methods=['GET', 'POST'])
def gallery():
    if request.method == 'GET':
        return render_template('gallery.html')
    if request.method == 'POST':
        pass



if __name__ == '__main__':
    app.run()
