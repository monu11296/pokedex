from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

from database import Base

class Pokedex(Base):
    __tablename__ = "pokedex"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    weight = Column(Float, nullable=True)
    alt_text = Column(String, nullable=False)
    weakness0 = Column(String, nullable=True)
    weakness1 = Column(String, nullable=True)
    weakness2 = Column(String, nullable=True)
    weakness3 = Column(String, nullable=True)
    weakness4 = Column(String, nullable=True)
    weakness5 = Column(String, nullable=True)
    weakness6 = Column(String, nullable=True)
    height = Column(Integer, nullable=False)
    collectibles_slug = Column(String, nullable=False)
    featured = Column(String, nullable=False)
    thumbnail_image = Column(String, nullable=False)
    type0 = Column(String, nullable=True)
    type1 = Column(String, nullable=True)
    slug = Column(String, nullable=False)
    abilities0 = Column(String, nullable=True)
    abilities1 = Column(String, nullable=True)