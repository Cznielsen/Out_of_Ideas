from flask import Flask, render_template, redirect, url_for, request
from auxillary import get_image

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
        meme_path = get_image.get_meme_path("static/images/randers-memes/")
        return render_template('gallery.html', path=meme_path)
    if request.method == 'POST':
        pass



if __name__ == '__main__':
    app.run()
