# xpxTS6oRm1i0xRolIfVt
# postgres
# database-1.c3p01hn9l9gs.us-east-2.rds.amazonaws.com

from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from utils import get_pokemons
from models import Pokedex, Base
from schemas import Pokedex as pokedex_schemas


from database import SessionLocal, engine

Base.metadata.create_all(bind=engine)


app = FastAPI()

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
