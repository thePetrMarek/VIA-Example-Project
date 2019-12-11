from flask import Flask
from flask_restplus import Api, Resource
from flask_cors import CORS, cross_origin

movies = {}

"""Define Flask app"""
flask_app = Flask(__name__)
app = Api(app=flask_app,
          version="1.0",
          title="Movie Location Map",
          description="Find the place in which movies are made and rate them!")
CORS(flask_app)

"""Define namespace"""
movies_name_space = app.namespace("ratings", description='Save ratings')


@movies_name_space.route("/<string:name>/")  # Define the route
class GetRating(Resource):
    @app.doc(responses={200: 'OK', 400: 'Invalid Argument'}, description="Get rating of movie")
    @cross_origin()
    def get(self, name):
        if name in movies:
            return {"rating": movies[name]}
        else:
            movies_name_space.abort(400, status="Movie doesn't exist", statusCode="400")


@movies_name_space.route("/<string:name>/<string:rating>")
class AddRating(Resource):
    @app.doc(responses={200: 'OK'}, description="Add new rating")
    @cross_origin()
    def put(self, name, rating):
        movies[name] = rating
        return {"Status": "OK"}


"""Run Flask app"""
flask_app.run()
