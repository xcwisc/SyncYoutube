from functools import wraps

from flask import request, jsonify

from project.api.models import User


def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        auth_header = request.headers.get('Authorization')

        # check if the header is provided
        if not auth_header:
            return jsonify(response_object), 403

        # get the token and decode it
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)

        if isinstance(resp, str):
            # this means that an exception is caught
            response_object['message'] = resp
            return jsonify(response_object), 401

        # get the user and varify its identity and activity
        user = User.query.filter_by(id=resp).first()
        if not user or not user.active:
            return jsonify(response_object), 401

        return f(resp, *args, **kwargs)
    return decorated_function
