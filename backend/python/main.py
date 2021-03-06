# xpxTS6oRm1i0xRolIfVt
# postgres
# database-1.c3p01hn9l9gs.us-east-2.rds.amazonaws.com

from typing import List
from typing import Dict

from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from utils import get_pokemons, save_pokemon_order, delete_category, get_pokemon_order
from models import Pokedex, Base
from schemas import Pokedex as pokedex_schemas, Save_Order, Delete_Category


from database import SessionLocal, engine

Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/item")
def item():
    return {"test": "test"}


@app.get("/get_pokemons", response_model=List[pokedex_schemas])
def get(db: Session = Depends(get_db)):
    pokemons = get_pokemons(db)
    return pokemons


@app.post("/save_order")
def save_order(pokemon_category_list: Save_Order, db: Session = Depends(get_db)):
    print(pokemon_category_list)
    resp = save_pokemon_order(db, pokemon_category_list)
    return resp


@app.post("/delete_category")
def del_category(category: Delete_Category, db: Session = Depends(get_db)):
    print(category)
    resp = delete_category(db, category)
    return resp


@app.get("/get_order")
def get_order(db: Session = Depends(get_db)):
    resp = get_pokemon_order(db)
    return resp