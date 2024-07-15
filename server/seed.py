from faker import Faker
from models import db, User, Leave, Employee
from app import app, bcrypt
import datetime

faker = Faker()

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        for _ in range(5):
            user = User(
                name=faker.name(),
                email=faker.email(),
                password= bcrypt.generate_password_hash("newpass").decode("utf-8")
            )
            db.session.add(user)
            db.session.commit()

        db.session.commit()

# Add employees
e1 = Employee(name="Uri Lee", contact_info="uri@example.com", job_title="Software Engineer", department="Engineering", salary=75000.00)
e2 = Employee(name="Tristan Tal", contact_info="tristan@example.com", job_title="Product Manager", department="Product", salary=90000.00)
e3 = Employee(name="Sasha Hao", contact_info="sasha@example.com", job_title="Data Scientist", department="Data", salary=85000.00)
e4 = Employee(name="Taylor Jai", contact_info="taylor@example.com", job_title="Marketing Specialist", department="Marketing", salary=70000.00)

# Add leaves
l1 = Leave(employee_id=e1.id, leave_type="Vacation", start_date=datetime.date(2024, 7, 15), end_date=datetime.date(2024, 7, 20), reason="Family vacation", status="approved")
l2 = Leave(employee_id=e2.id, leave_type="Sick Leave", start_date=datetime.date(2024, 6, 10), end_date=datetime.date(2024, 6, 14), reason="Flu", status="approved")
l3 = Leave(employee_id=e3.id, leave_type="Maternity Leave", start_date=datetime.date(2024, 8, 1), end_date=datetime.date(2024, 10, 31), reason="Maternity leave", status="pending")
l4 = Leave(employee_id=e4.id, leave_type="Personal Leave", start_date=datetime.date(2024, 9, 1), end_date=datetime.date(2024, 9, 5), reason="Personal reasons", status="pending")

db.session.add_all([e1, e2, e3, e4, l1, l2, l3, l4])
db.session.commit()


print("Started seeding data...")
seed_data()
print("Finished seeding data...")
