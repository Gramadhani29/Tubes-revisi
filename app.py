from flask import Flask, request, jsonify
from ariadne import QueryType, MutationType, make_executable_schema, graphql_sync, load_schema_from_path, ObjectType
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Event, EventApprovalLog, RoomBookingStatus
from datetime import date, datetime
from flask_cors import CORS

# Setup DB
engine = create_engine('sqlite:///kemahasiswaan.db')
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# Load type definitions (SDL)
type_defs = load_schema_from_path("schema.graphql")

# Query resolvers
query = QueryType()

@query.field("eventStatus")
def resolve_event_status(_, info, event_id):
    session = Session()
    result = session.query(Event).filter_by(event_id=event_id).first()
    session.close()
    return result

@query.field("roomBookingStatus")
def resolve_room_booking_status(_, info, booking_id):
    session = Session()
    result = session.query(RoomBookingStatus).filter_by(booking_id=booking_id).first()
    session.close()
    return result

@query.field("allEvents")
def resolve_all_events(_, info):
    session = Session()
    result = session.query(Event).all()
    session.close()
    return result

# Mutation resolvers
mutation = MutationType()

@mutation.field("submitEvent")
def resolve_submit_event(_, info, input):
    session = Session()
    event = Event(
        nama_event=input["nama_event"],
        deskripsi=input["deskripsi"],
        tanggal_mulai=datetime.strptime(input["tanggal_mulai"], "%Y-%m-%d").date(),
        tanggal_selesai=datetime.strptime(input["tanggal_selesai"], "%Y-%m-%d").date(),
        status_approval="pending"
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    session.close()
    return event

@mutation.field("approveEvent")
def resolve_approve_event(_, info, input):
    session = Session()
    event = session.query(Event).filter_by(event_id=input["event_id"]).first()
    if not event:
        session.close()
        raise Exception("Event not found")
    event.status_approval = input["status_approval"]
    approval_log = EventApprovalLog(
        event_id=input["event_id"],
        tanggal_approval=date.today(),
        status=input["status_approval"],
        catatan=input.get("catatan")
    )
    session.add(approval_log)
    session.commit()
    session.refresh(event)
    session.close()
    return event

@mutation.field("notifyLogistics")
def resolve_notify_logistics(_, info, event_id):
    session = Session()
    event = session.query(Event).filter_by(event_id=event_id, status_approval="approved").first()
    if not event:
        session.close()
        return {"success": False, "message": "Event not approved or not found"}
    # Simulasi kirim ke API logistik
    session.close()
    return {"success": True, "message": "Event sent to logistics"}

@mutation.field("updateRoomBookingStatus")
def resolve_update_room_booking_status(_, info, input):
    session = Session()
    booking = session.query(RoomBookingStatus).filter_by(booking_id=input["booking_id"]).first()
    if not booking:
        session.close()
        raise Exception("Booking not found")
    booking.status_booking = input["status_booking"]
    booking.tanggal_update = input["tanggal_update"]
    session.commit()
    session.refresh(booking)
    session.close()
    return booking

# ObjectType for custom mapping (if needed)
event_obj = ObjectType("Event")
room_booking_status_obj = ObjectType("RoomBookingStatus")

# Schema
schema = make_executable_schema(
    type_defs, [query, mutation, event_obj, room_booking_status_obj]
)

# Flask app
app = Flask(__name__)
CORS(app)

PLAYGROUND_HTML = """
<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8/>
    <title>GraphQL Playground</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
    <link rel="shortcut icon" href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
    <script src="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
  </head>
  <body>
    <div id="root"/>
    <script>window.addEventListener('load', function (event) {
      GraphQLPlayground.init(document.getElementById('root'), { endpoint: '/graphql' })
    })</script>
  </body>
</html>
"""

@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == "__main__":
    app.run(debug=True)