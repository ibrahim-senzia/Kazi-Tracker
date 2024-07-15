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

from models import db, User, Employee, Leave
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

# Employee
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([
        {
            'id': emp.id,
            'name': emp.name,
            'contact_info': emp.contact_info,
            'job_title': emp.job_title,
            'department': emp.department,
            'salary': emp.salary,
        } for emp in employees
    ])

@app.route('/employees/<int:id>', methods=['GET'])
def get_employee(id):
    employee = Employee.query.get_or_404(id)
    return jsonify({
        'id': employee.id,
        'name': employee.name,
        'contact_info': employee.contact_info,
        'job_title': employee.job_title,
        'department': employee.department,
        'salary': employee.salary,
    })

@app.route('/employees', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()
        new_employee = Employee(
            name=data['name'],
            contact_info=data.get('contact_info', ''),
            job_title=data.get('job_title', ''),
            department=data.get('department', ''),
            salary=float(data['salary'].replace('$', ''))
        )
        db.session.add(new_employee)
        db.session.commit()
        return jsonify({
            'id': new_employee.id,
            'name': new_employee.name,
            'contact_info': new_employee.contact_info,
            'job_title': new_employee.job_title,
            'department': new_employee.department,
            'salary': new_employee.salary,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    data = request.get_json()
    employee.name = data.get('name', employee.name)
    employee.contact_info = data.get('contact_info', employee.contact_info)
    employee.job_title = data.get('job_title', employee.job_title)
    employee.department = data.get('department', employee.department)
    employee.salary = float(data.get('salary', employee.salary))
    try:
        db.session.commit()
        return jsonify({
            'id': employee.id,
            'name': employee.name,
            'contact_info': employee.contact_info,
            'job_title': employee.job_title,
            'department': employee.department,
            'salary': employee.salary,
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error updating employee with id {id}: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    try:
        db.session.delete(employee)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/dashboard', methods=['GET'])
def dashboard():
    total_employees = Employee.query.count()
    total_salary = db.session.query(db.func.sum(Employee.salary)).scalar() or 0.0

    return jsonify({
        'totalEmployees': total_employees,
        'totalSalary': float(total_salary)
    })

#Leaves Route
@app.route('/leaves', methods=['GET'])
def get_leaves():
    leaves = Leave.query.all()
    return jsonify([
        {
            'id': leave.id,
            'employee_id': leave.employee_id,
            'leave_type': leave.leave_type,
            'start_date': leave.start_date.isoformat(),
            'end_date': leave.end_date.isoformat(),
            'reason': leave.reason,
            'status': leave.status,
        } for leave in leaves
    ])

@app.route('/leaves/<int:id>', methods=['GET'])
def get_leave(id):
    leave = Leave.query.get_or_404(id)
    return jsonify({
        'id': leave.id,
        'employee_id': leave.employee_id,
        'leave_type': leave.leave_type,
        'start_date': leave.start_date.isoformat(),
        'end_date': leave.end_date.isoformat(),
        'reason': leave.reason,
        'status': leave.status,
    })

@app.route('/leaves', methods=['POST'])
def add_leave():
    try:
        data = request.get_json()
        new_leave = Leave(
            employee_id=data['employee_id'],
            leave_type=data['leave_type'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            reason=data['reason'],
            status=data.get('status', 'pending')
        )
        db.session.add(new_leave)
        db.session.commit()
        return jsonify({
            'id': new_leave.id,
            'employee_id': new_leave.employee_id,
            'leave_type': new_leave.leave_type,
            'start_date': new_leave.start_date.isoformat(),
            'end_date': new_leave.end_date.isoformat(),
            'reason': new_leave.reason,
            'status': new_leave.status,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/leaves/<int:id>', methods=['PUT'])
def update_leave(id):
    leave = Leave.query.get_or_404(id)
    data = request.get_json()
    leave.employee_id = data.get('employee_id', leave.employee_id)
    leave.leave_type = data.get('leave_type', leave.leave_type)
    leave.start_date = data.get('start_date', leave.start_date)
    leave.end_date = data.get('end_date', leave.end_date)
    leave.reason = data.get('reason', leave.reason)
    leave.status = data.get('status', leave.status)
    try:
        db.session.commit()
        return jsonify({
            'id': leave.id,
            'employee_id': leave.employee_id,
            'leave_type': leave.leave_type,
            'start_date': leave.start_date.isoformat(),
            'end_date': leave.end_date.isoformat(),
            'reason': leave.reason,
            'status': leave.status,
        })
    except Exception as e:
        db.session.rollback()
        print(f"Error updating leave with id {id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/leaves/<int:id>', methods=['DELETE'])
def delete_leave(id):
    leave = Leave.query.get_or_404(id)
    try:
        db.session.delete(leave)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)