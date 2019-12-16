from typing import List

from pydantic import BaseModel


class Pokedex(BaseModel):
    id: int
    number : int
    name : str
    weight : float = None
    alt_text : str
    weakness0 : str = None
    weakness1 : str = None
    weakness2 : str = None
    weakness3 : str = None
    weakness4 : str = None
    weakness5 : str = None
    weakness6 : str = None
    height : str
    collectibles_slug : str
    featured : str
    thumbnail_image : str
    type0 : str = None
    type1 : str = None
    slug : str
    abilities0 : str = None
    abilities1 : str = None
    
    class Config:
        orm_mode = True
