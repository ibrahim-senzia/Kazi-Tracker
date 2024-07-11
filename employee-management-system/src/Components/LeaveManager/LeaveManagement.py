from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask (__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///employee_management.db'
db = SQLAlchemy(app)

class Leave(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, nullable=False)
    leave_type = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

db.create_all()

@app.route('/leaves', methods=['POST'])
def create_leave():
    data = request.get_json()
    new_leave = Leave(
        employee_id=data['employee_id'],
        leave_type=data['leave_type'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        reason=data['reason'],
        status='pending'
    )
    db.session.add(new_leave)
    db.session.commit()
    return jsonify({'message': 'Leave request created successfully'}), 201

@app.route('/leaves', methods=['GET'])
def get_leaves():
    leaves = Leave.query.all()
    return jsonify([{
        'id': leave.id,
        'employee_id': leave.employee_id,
        'leave_type': leave.leave_type,
        'start_date': leave.start_date,
        'end_date': leave.end_date,
        'reason': leave.reason,
        'status': leave.status
    } for leave in leaves]), 200

@app.route('/leaves/<int:id>', methods=['PUT'])
def update_leave(id):
    data = request.get_json()
    leave = Leave.query.get(id)
    if leave:
        leave.leave_type = data['leave_type']
        leave.start_date = data['start_date']
        leave.end_date = data['end_date']
        leave.reason = data['reason']
        leave.status = data['status']
        db.session.commit()
        return jsonify({'message': 'Leave request updated successfully'}), 200
    else:
        return jsonify({'message': 'Leave request not found'}), 404

@app.route('/leaves/<int:id>', methods=['DELETE'])
def delete_leave(id):
    leave = Leave.query.get(id)
    if leave:
        db.session.delete(leave)
        db.session.commit()
        return jsonify({'message': 'Leave request deleted successfully'}), 200
    else:
        return jsonify({'message': 'Leave request not found'}), 404

if __name__ == '_main_':
    app.run(debug=True)