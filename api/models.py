"""SQLAlchemy models mirroring web/src/types/index.ts."""
from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_title = Column(String, default="")
    author = Column(String, default="")
    description = Column(Text, default="")
    original_sample_text = Column(Text, default="")

    translations = relationship("Translation", back_populates="book", cascade="all, delete-orphan")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(String, primary_key=True, index=True)
    book_id = Column(String, ForeignKey("books.id"), nullable=False, index=True)
    translator_id = Column(String, default="")
    translator_name = Column(String, default="")
    publisher = Column(String, default="")
    publish_year = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    sample_text = Column(Text, default="")

    # denormalised dimension averages (recomputed on each new review)
    dim_fluency = Column(Float, default=0.0)
    dim_fidelity = Column(Float, default=0.0)
    dim_readability = Column(Float, default=0.0)
    dim_editing = Column(Float, default=0.0)

    book = relationship("Book", back_populates="translations")
    reviews = relationship("Review", back_populates="translation", cascade="all, delete-orphan")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    translation_id = Column(String, ForeignKey("translations.id"), nullable=False, index=True)
    user_name = Column(String, default="کاربر ناشناس")
    rating = Column(Integer, nullable=False)
    fluency = Column(Integer, default=3)
    fidelity = Column(Integer, default=3)
    readability = Column(Integer, default=3)
    editing = Column(Integer, default=3)
    comment = Column(Text, default="")
    strengths = Column(Text, default="")  # comma separated, keeps frontend simple
    weaknesses = Column(Text, default="")  # comma separated
    created_at = Column(String, default="")

    translation = relationship("Translation", back_populates="reviews")
