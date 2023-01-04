from functools import wraps

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            try:
                claims = get_jwt()
                print(claims["is_admin"])
                if claims["is_admin"]:
                    return fn(*args, **kwargs)
                else:
                    return jsonify({"msg": "Admins only!"}), 403
            except KeyError:
                return jsonify({"msg": "User does not have a role"})
        return decorator

    return wrapper


def is_ds():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            try:
                claims = get_jwt()
                print(claims["is_ds"])
                if claims["is_ds"]:
                    return fn(*args, **kwargs)
                else:
                    return jsonify({"msg": "You need to be a DS!"}), 403
            except KeyError:
                return jsonify({"msg": "User does not have a role"})
        return decorator

    return wrapper
