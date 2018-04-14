import random
import os


def get_meme_path(path):
    meme_path = path
    random_meme = random.choice([
        x for x in os.listdir(meme_path)
        if os.path.isfile(os.path.join(meme_path, x))
    ])
    result_path = "images/randers-memes/"+random_meme
    return result_path
