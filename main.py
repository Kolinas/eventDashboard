from datetime import datetime
from typing import List
from fastapi import Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel
from peewee import *
from playhouse.shortcuts import model_to_dict
from fastapi import FastAPI, HTTPException
import requests
from google.auth import jwt
import jwt as JWT
import json
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Define the database connection
database = SqliteDatabase('eventDashboard.db')

# Define the models
class User(Model):
    id = AutoField()
    first_name = CharField()
    last_name = CharField()
    email = CharField(unique=True)
    avatar = CharField()

    class Meta:
        database = database

class Event(Model):
    id = AutoField()
    author_name = TextField()
    author_id = IntegerField()
    author_avatar = TextField()
    event_title = CharField()
    event_date = DateTimeField()
    event_description = TextField()
    tags = TextField()

    class Meta:
        database = database

# Connect to the database and create tables
database.connect()
database.create_tables([User, Event])

# Initialize FastAPI
app = FastAPI()

origins = [
    "http://localhost:5173",  # replace with the origin of your frontend app
    "http://127.0.0.1:5173"   # replace with the origin of your frontend app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# JWT Configuration
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 password bearer
bearer = HTTPBearer()

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID = "364066402305-bhtao8o6c7nggnfs26k7qdfd73bp55uc.apps.googleusercontent.com"

class EventCreateRequest(BaseModel):
    event_title: str
    event_date: datetime
    event_description: str
    tags: List[str]
    contacts: str

class EventResponse(BaseModel):
    id: int
    author: str
    author_avatar: str
    event_title: str
    event_date: datetime
    event_description: str
    tags: List[str]
    contacts: str

class AuthRequest(BaseModel):
    code: str
    redirectUrl: str

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")

google_auth_settings = {
    'AppId': '364066402305-bhtao8o6c7nggnfs26k7qdfd73bp55uc.apps.googleusercontent.com',
    'AppSecret': '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'
}

class EventListResponse(BaseModel):
    total: int
    events: List[EventResponse]

@app.post("/auth")
async def authenticate_user(req: AuthRequest):
    try:
        token_data = get_token(req.code, req.redirectUrl, google_auth_settings)
        decoded_user = decode_google_token(token_data['id_token'])
        return {"token": create_access_token(decoded_user)}

    except Exception as e:
        print(f"Exception during Google API call: {e}")
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")

def create_access_token(user: User):
    token = JWT.encode(user, SECRET_KEY, ALGORITHM)
    return token

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        token = creds.credentials
        payload = JWT.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = User.get_by_id(user_id)
        return user
    except JWT.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def get_token(code, redirect_url, google_auth_settings):
    token_request_url = 'https://oauth2.googleapis.com/token'

    data = {
        'grant_type': 'authorization_code',
        'client_id': google_auth_settings['AppId'],
        'client_secret': google_auth_settings['AppSecret'],
        'code': code,
        'access_type': 'offline',
        'redirect_uri': redirect_url
    }

    headers = {
        'Accept': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_request_url, data=data, headers=headers)
    token_data = json.loads(response.text)

    return token_data

def decode_google_token(token):
    decoded_token = jwt.decode(token, verify=False)

    email = decoded_token.get('email')
    first_name = decoded_token.get('given_name')
    last_name = decoded_token.get('family_name')
    name = decoded_token.get('name')
    email_verified = bool(decoded_token.get('email_verified', False))
    avatar = decoded_token.get('picture')

    return \
    {
        "avatar": avatar,
        "last_name": last_name,
        "email": email,
        "first_name": first_name,
    }

# Event controller
@app.post('/events', response_model=EventResponse)
def create_event(event: EventCreateRequest, user: User = Depends(get_current_user)):

    new_event = Event(
        author_id=user.id,
        author_avatar=user.avatar,
        author=f"{user.first_name} {user.last_name}",
        event_title=event.event_title,
        event_date=event.event_date,
        event_description=event.event_description,
        tags=' '.join(event.tags),
        contacts=event.contacts
    )
    new_event.save()
    return model_to_dict(new_event)

@app.delete('/events/{event_id}')
def delete_event(event_id: int, user: User = Depends(get_current_user)):
    try:
        event_to_delete: Event = Event.get(Event.id == event_id)
        if event_to_delete.author_id != user.id:
            raise HTTPException(status_code=403)

        event_to_delete.delete_instance()
        return {"message": "Event deleted successfully"}
    except Event.DoesNotExist:
        raise HTTPException(status_code=404, detail="Event not found")

@app.get('/events', response_model=EventListResponse)
def get_events(
    page: int = Query(1, gt=0),
    limit: int = Query(10, gt=0, le=100),
    tags: List[str] = Query([]),
    date: datetime = Query(None),
    user: User = Depends(get_current_user)
):
    query = Event.select().paginate(page, limit)

    if tags:
        query = query.where(Event.tags.contains(tags))

    if date:
        query = query.where(Event.event_date < date)

    eventsResponse = List[EventResponse]()

    for event in query:
        newResponse = EventResponse(
            id=event.id,
            author=event.author_name,
            author_avata = event.author_avatar,
            event_title=event.event_title,
            event_date=event.event_date,
            event_description=event.event_description,
            tags=event.tags.split()
        )

        eventsResponse.append(newResponse)

    total = len(eventsResponse)

    return {"total": total, "events": json.dumps(eventsResponse)}
