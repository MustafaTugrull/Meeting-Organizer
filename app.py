from flask import Flask, render_template
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meetings.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Veritabanı modeli oluşturma
class Meeting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    start_time = db.Column(db.String(5), nullable=False)
    end_time = db.Column(db.String(5), nullable=False)
    participants = db.Column(db.String(255), nullable=False)

# Uygulama ilk çalıştırıldığında veritabanı tablosu oluşturma
with app.app_context():
    db.create_all()

# Flask-RESTful kullanarak API kaynakları tanımlama
class MeetingResource(Resource):
    def get(self, meeting_id):
        meeting = Meeting.query.get(meeting_id)
        if meeting:
            return {
                'id': meeting.id,
                'subject': meeting.subject,
                'date': meeting.date,
                'start_time': meeting.start_time,
                'end_time': meeting.end_time,
                'participants': meeting.participants.split(',')
            }
        else:
            return {'message': 'Toplantı bulunamadı.'}, 404

    def put(self, meeting_id):
        parser = reqparse.RequestParser()
        parser.add_argument('subject', type=str, required=True)
        parser.add_argument('date', type=str, required=True)
        parser.add_argument('start_time', type=str, required=True)
        parser.add_argument('end_time', type=str, required=True)
        parser.add_argument('participants', type=str, required=True)
        args = parser.parse_args()

        meeting = Meeting.query.get(meeting_id)
        if meeting:
            meeting.subject = args['subject']
            meeting.date = args['date']
            meeting.start_time = args['start_time']
            meeting.end_time = args['end_time']
            meeting.participants = args['participants']
            db.session.commit()
            return {'message': 'Toplantı başarılı şekilde güncellendi.'}
        else:
            return {'message': 'Toplantı bulunamadı.'}, 404

    def delete(self, meeting_id):
        meeting = Meeting.query.get(meeting_id)
        if meeting:
            db.session.delete(meeting)
            db.session.commit()
            return {'message': 'Toplantı başarılı şekilde silindi.'}
        else:
            return {'message': 'Toplantı bulunamadı.'}, 404

class MeetingListResource(Resource):
    def get(self):
        meetings = Meeting.query.all()
        meeting_list = []
        for meeting in meetings:
            meeting_list.append({
                'id': meeting.id,
                'subject': meeting.subject,
                'date': meeting.date,
                'start_time': meeting.start_time,
                'end_time': meeting.end_time,
                'participants': meeting.participants.split(',')
            })
        return meeting_list

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('subject', type=str, required=True)
        parser.add_argument('date', type=str, required=True)
        parser.add_argument('start_time', type=str, required=True)
        parser.add_argument('end_time', type=str, required=True)
        parser.add_argument('participants', type=str, required=True)
        args = parser.parse_args()

        new_meeting = Meeting(
            subject=args['subject'],
            date=args['date'],
            start_time=args['start_time'],
            end_time=args['end_time'],
            participants=args['participants']
        )
        db.session.add(new_meeting)
        db.session.commit()

        return {'message': 'Toplantı başarılı şekilde eklendi.'}, 201

# Flask-RESTful kaynaklarını uygulamaya ekleme
api.add_resource(MeetingResource, '/meeting/<int:meeting_id>')
api.add_resource(MeetingListResource, '/meetings')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
