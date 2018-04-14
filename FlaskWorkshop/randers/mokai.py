import urllib.request
from html.parser import HTMLParser
from bs4 import BeautifulSoup


class MokaiFinder:

    def __init__(self):
        self.normalPrice = 20;
        self.sales = []
        # self.parser = MokaiParser()

    def find_sales(self):
        contents = urllib.request.urlopen("https://minetilbud.dk/Tilbudssoegning?qw=moka%C3%AF&sort=Price").read().decode("utf-8")
        print("Start of parsing")
        soup = BeautifulSoup(contents, 'html.parser')

        # Find all the elements and put them into 2 lists
        productnames = []
        shops = []
        productprices = []
        for product in soup.find_all('div'):
            if product.get('class') == ['product-list__product']:
                productnames.append(product.contents[3].contents[1].contents[0])
                shopname = product.contents[3].contents[3].contents[0]
                shopname = shopname.replace("\n", "")
                shops.append(shopname.replace("  ", ""))
                productprice = product.contents[5].contents[1].contents[3].contents[0]
                productprice = productprice.replace("\n", "")
                productprice = productprice.replace("  ", "")
                productprices.append(productprice)
        print(productnames)
        print(shops)
        print(productprices)

"""
class MokaiParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        matchcase = [('class', 'product-list__product')]
        if tag == "div" and attrs == matchcase:
            print("Encountered a product:", tag, attrs)
"""



def main():
    finder = MokaiFinder()
    finder.find_sales()


if __name__ == "__main__":
    main()
