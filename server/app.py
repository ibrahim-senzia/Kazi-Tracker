# SQLAlchemy operations
# Flask
import random
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required,  get_jwt
from datetime import timedelta
from flask_cors import CORS

app  = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///event.db" # postgres
app.config["JWT_SECRET_KEY"] = "fsbdgfnhgvjnvhmvh"+str(random.randint(1,1000000000000)) 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["SECRET_KEY"] = "JKSRVHJVFBSRDFV"+str(random.randint(1,1000000000000))


bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from models import db, User
migrate = Migrate(app, db)
db.init_app(app)


# Login
@app.route("/LogIn", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token":access_token})

    else:
        return jsonify({"message":"Invalid email or password"}), 401

# Fetch current user
@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id =  get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user:
        return jsonify({"id":current_user.id, "name":current_user.name, "email":current_user.email}), 200
    else:
        jsonify({"error":"User not found"}), 404

# Logout
BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success":"Successfully logged out"}), 200

# Add user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'], password=bcrypt.generate_password_hash( data['password'] ).decode("utf-8") ) 
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'User created successfully'}), 201

# Get single user
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email})

# Update user
@app.route('/users/<int:user_id>', methods=['PUT'])
# @jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.name = data['name']
    user.email = data['email']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})


if __name__ == "__main__":
    app.run(debug=True)