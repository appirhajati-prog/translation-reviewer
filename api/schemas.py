"""Pydantic schemas matching web/src/types/index.ts shapes."""
from pydantic import BaseModel, Field


class DimensionRating(BaseModel):
    fluency: float = 0
    fidelity: float = 0
    readability: float = 0
    editing: float = 0


class ReviewIn(BaseModel):
    user_name: str = Field(default="کاربر ناشناس", max_length=100)
    rating: int = Field(ge=1, le=5)
    fluency: int = Field(default=3, ge=1, le=5)
    fidelity: int = Field(default=3, ge=1, le=5)
    readability: int = Field(default=3, ge=1, le=5)
    editing: int = Field(default=3, ge=1, le=5)
    comment: str = Field(default="", max_length=2000)
    strengths: str = Field(default="", max_length=500)
    weaknesses: str = Field(default="", max_length=500)


class ReviewOut(ReviewIn):
    id: int
    translation_id: str
    created_at: str


class TranslationOut(BaseModel):
    id: str
    book_id: str
    translator_id: str
    translator_name: str
    publisher: str
    publish_year: int
    average_rating: float
    dimension_averages: DimensionRating
    review_count: int
    sample_text: str
    reviews: list[ReviewOut]


class BookOut(BaseModel):
    id: str
    title: str
    original_title: str
    author: str
    description: str
    original_sample_text: str
    translations: list[TranslationOut]
