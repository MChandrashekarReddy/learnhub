from flask_restx import Namespace

class WishlistDto:
    wishlist_api=Namespace('wishlist',description="API's for users")