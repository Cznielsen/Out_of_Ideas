import random, os

def get_image():
    meme_path = "../static/images/randers-memes/"
    random_meme = random.choice([
        x for x in os.listdir(meme_path)
        if os.path.isfile(os.path.join(meme_path, x))
    ])
    return random_meme
