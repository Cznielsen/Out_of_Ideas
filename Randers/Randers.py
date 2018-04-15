from flask import Flask, render_template, redirect, url_for, request
from auxillary import get_image

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/home/')
def home():
    return render_template('home.html')


@app.route('/gallery/')
def gallery():
        meme_path = get_image.get_meme_path("static/images/randers-memes/")
        return render_template('gallery.html', path=meme_path)

@app.route('/ja/')
def ja():
    return render_template('ja.html')

@app.route('/nej/')
def nej():
    return render_template('nej.html')



if __name__ == '__main__':
    app.run()
