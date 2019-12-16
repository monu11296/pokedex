from sqlalchemy.orm import Session

from models import Pokedex


def get_pokemons(db: Session):
    return db.query(Pokedex).all()