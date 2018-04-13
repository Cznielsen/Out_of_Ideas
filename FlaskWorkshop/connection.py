from firebase import firebase


class Firebase_conn(object):
    """
    Firebase_conn represents a connection object for the firebase database. 
    This is done with help from firebase module.
    It contains all methods that calls to the firebase server.
    """

    def __init__(self):
        self.connection = firebase.FirebaseApplication("https://auhackflaskworkshop.firebaseio.com/", None)

    def create_a_user(self, name):
        """
        Example of using the put method for firebase.
        :param name: Name of the user
        :return: response as string
        """
        return self.connection.put('/User/', name, {'password': '12345'})

    def get_user(self, name):
        """
        Get the data from the name if the name exists in the firebase
        :param name: String
        :return: dict
        """
        return self.connection.get('/User/', name)


class Firebase_connException(Exception):
    def __str__(self):
        return "FirebaseException: {}".format(super.__str__(self))
