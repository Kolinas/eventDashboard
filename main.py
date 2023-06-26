from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel
from peewee import *
from playhouse.shortcuts import model_to_dict
import json
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

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
    # author_id = ForeignKeyField(User, backref='events')
    author_id = IntegerField()
    event_title = CharField()
    event_date = DateTimeField()
    event_description = TextField()
    tags = TextField()
    contacts = TextField()

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

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 password bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID = "364066402305-bhtao8o6c7nggnfs26k7qdfd73bp55uc.apps.googleusercontent.com"

# User Pydantic models
class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    avatar: str

class UserLoginResponse(BaseModel):
    access_token: str
    refresh_token: str

class UserLoginRequest(BaseModel):
    token: str

# Event Pydantic models
class EventCreateRequest(BaseModel):
    author_id: int
    avatar: str
    author: str
    event_title: str
    event_date: datetime
    event_description: str
    tags: List[str]
    contacts: str

class EventUpdateRequest(BaseModel):
    event_title: str
    event_date: datetime
    event_description: str
    tags: str
    contacts: str

class EventResponse(BaseModel):
    id: int
    author_id: int
    event_title: str
    event_date: datetime
    event_description: str
    tags: str
    contacts: str

class AuthRequest(BaseModel):
    code: str

class EventListResponse(BaseModel):
    total: int
    events: List[EventResponse]

@app.post("/auth")
async def authenticate_user(authRequest: AuthRequest):
    print(authRequest.code)
    try:
        # Specify the CLIENT_ID of your OAuth2 client configuration
        flow = InstalledAppFlow.from_client_info(
            {"web": {
                "client_id": GOOGLE_CLIENT_ID,
                "project_id": "by-time",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": "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",
                "redirect_uris": ["http://127.0.0.1:5173/dashboard"],
                "javascript_origins": ["http://localhost", "http://127.0.0.1"]
            }},
            scopes=['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'])

        flow.fetch_token(code=authRequest.code)

        # Use the token to get the user info
        session = flow.authorized_session()
        profile_info = session.get('https://www.googleapis.com/userinfo/v2/me').json()

    except Exception as e:
        print(f"Exception during Google API call: {e}")
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")

    # Create or update the user in your database
    try:
        user, created = User.get_or_create(
            email=profile_info["email"],
            defaults={
                "first_name": profile_info["given_name"],
                "last_name": profile_info["family_name"],
                "avatar": profile_info["picture"]
            },
        )

        if not created:
            # Update user info if the user already exists
            user.first_name = profile_info["given_name"]
            user.last_name= profile_info["family_name"]
            user.avatar = profile_info["picture"]
            user.save()

        # Return the user info to the client
        print(model_to_dict(user))
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"user": model_to_dict(user)})

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Event controller
@app.post('/events', response_model=EventResponse)
def create_event(event: EventCreateRequest):
    new_event = Event(
        author_id=event.author_id,
        avatar=event.avatar,
        author=event.author,
        event_title=event.event_title,
        event_date=event.event_date,
        event_description=event.event_description,
        tags=event.tags,
        contacts=event.contacts
    )
    new_event.save()
    return model_to_dict(new_event)

@app.get('/events/{event_id}', response_model=EventResponse)
def get_event(event_id: int):
    try:
        event = Event.get(Event.id == event_id)
        return model_to_dict(event)
    except Event.DoesNotExist:
        raise HTTPException(status_code=404, detail="Event not found")

@app.put('/events/{event_id}', response_model=EventResponse)
def update_event(event_id: int, event: EventUpdateRequest):
    try:
        event_to_update = Event.get(Event.id == event_id)
        event_to_update.event_title = event.event_title
        event_to_update.event_date = event.event_date
        event_to_update.event_description = event.event_description
        event_to_update.tags = event.tags
        # event_to_update.contacts = event.contacts
        event_to_update.save()
        return model_to_dict(event_to_update)
    except Event.DoesNotExist:
        raise HTTPException(status_code=404, detail="Event not found")

@app.delete('/events/{event_id}')
def delete_event(event_id: int):
    try:
        event_to_delete = Event.get(Event.id == event_id)
        event_to_delete.delete_instance()
        return {"message": "Event deleted successfully"}
    except Event.DoesNotExist:
        raise HTTPException(status_code=404, detail="Event not found")


@app.get('/events', response_model=EventListResponse)
def get_events(
    page: int = Query(1, gt=0),
    limit: int = Query(10, gt=0, le=100),
    tags: List[str] = Query([]),
    date: datetime = Query(None)
):

    query = Event.select().paginate(page, limit)

    if tags:
        query = query.where(Event.tags.contains(tags))

    if date:
        query = query.where(Event.event_date < date)

    events = [model_to_dict(event) for event in query]
    total = query.count()

    return {"total": total, "events": events}
