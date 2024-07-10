from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///employees.db'
db = SQLAlchemy(app)
CORS(app)  # Enable CORS for all routes

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(100))
    job_title = db.Column(db.String(100))
    department = db.Column(db.String(100))
    salary = db.Column(db.Float)

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
    employee.salary = float(data.get('salary', employee.salary).replace('$', ''))
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

# Add this route to your Flask application

@app.route('/dashboard', methods=['GET'])
def dashboard():
    total_employees = Employee.query.count()
    total_salary = db.session.query(db.func.sum(Employee.salary)).scalar() or 0.0

    return jsonify({
        'totalEmployees': total_employees,
        'totalSalary': float(total_salary)
    })


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables at the start of the application
    app.run(debug=True)
