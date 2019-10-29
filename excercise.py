from flask import Flask
from flask_restplus import Api, Resource
import json

"""TODO_1 Load JSON movies.json into variable 
(https://stackoverflow.com/questions/27833437/load-json-file-in-python)."""

"""Define Flask app"""
flask_app = Flask(__name__)
app = Api(app=flask_app,
          version="1.0",
          title="VIA app",
          description="Demo app for via")

"""Define namespace"""
movies_name_space = app.namespace("movies", description='Get info about movies')


@movies_name_space.route("/")  # Define the route
class MoviesList(Resource):
    @app.doc(responses={200: 'OK'}, description="Get list of all movies")  # Documentation of route
    def get(self):  # GET method of REST
        movies_list = []
        """TODO_2 obtain list of all movies names from loaded json and return it."""
        return movies_list


@movies_name_space.route("/<string:name>/director")  # Define the route
class Director(Resource):
    @app.doc(responses={200: 'OK', 400: 'Invalid Argument'}, description="Get name of director for movie")
    def get(self, name):
        """"TODO_3 get the name of the director for the movie.
        If movie doesn't exist, return error 400.
        If director is N/A return error 400.
        If success return {"Director": director_name}"""
        movies_name_space.abort(400, status="Movie doesn't exist", statusCode="400")


"""TODO_4 create PUT which adds movie with name to loaded json.
If movie with the name exists already, return error 400.
If success return {"Status": "OK"}"""

"""Run Flask app"""
flask_app.run()
