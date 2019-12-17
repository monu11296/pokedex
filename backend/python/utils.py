from sqlalchemy.orm import Session

from models import Pokedex, Pokemon_Ordering
from schemas import Save_Order, Delete_Category


def get_pokemons(db: Session):
    return db.query(Pokedex).all()


def save_pokemon_order(db: Session, pokemon_category_list: Save_Order):
    category = pokemon_category_list.category
    pokemon_order = str(",".join(map(str, pokemon_category_list.pokemon_list))) 

    db_order = Pokemon_Ordering(category=category, pokemon_order=pokemon_order, row_status='active')
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return {"data": db_order, "status": "success"}


def delete_category(db: Session, data: Delete_Category):
    category = data.category

    exisiting_cat = db.query(Pokemon_Ordering).filter(
        Pokemon_Ordering.category==category, 
        Pokemon_Ordering.row_status=='active'
    ).all()

    if not exisiting_cat:
        return {"status": "error", "data": "No existing category present"}

    for row in db.query(Pokemon_Ordering).filter(Pokemon_Ordering.category==category, Pokemon_Ordering.row_status=='active').all():
        row.row_status = 'inactive'

    db.commit()

    return {"status": "success", "data": "category deleted successfully"}



def get_pokemon_order(db: Session):
    resp = db.query(Pokemon_Ordering).filter(
        Pokemon_Ordering.row_status=='active'
    ).order_by(Pokemon_Ordering.id.desc()).all()

    return resp

