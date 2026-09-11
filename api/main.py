"""FastAPI backend for translation-reviewer. Serves books + persists reviews."""
import os
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Book, Review, Translation
from .schemas import BookOut, DimensionRating, ReviewIn, ReviewOut, TranslationOut

app = FastAPI(title="translation-reviewer API", version="0.1.0")

origins = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,https://appirhajati-prog.github.io",
    ).split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def _split_csv(s: str | None) -> list[str]:
    if not s:
        return []
    return [p.strip() for p in s.split(",") if p.strip()]


def review_to_out(r: Review) -> ReviewOut:
    return ReviewOut(
        id=r.id,
        translation_id=r.translation_id,
        user_name=r.user_name,
        rating=r.rating,
        fluency=r.fluency,
        fidelity=r.fidelity,
        readability=r.readability,
        editing=r.editing,
        comment=r.comment,
        strengths="، ".join(_split_csv(r.strengths)) if "," in (r.strengths or "") else (r.strengths or ""),
        weaknesses="، ".join(_split_csv(r.weaknesses)) if "," in (r.weaknesses or "") else (r.weaknesses or ""),
        created_at=r.created_at,
    )


def translation_to_out(t: Translation) -> TranslationOut:
    return TranslationOut(
        id=t.id,
        book_id=t.book_id,
        translator_id=t.translator_id,
        translator_name=t.translator_name,
        publisher=t.publisher,
        publish_year=t.publish_year,
        average_rating=t.average_rating,
        dimension_averages=DimensionRating(
            fluency=t.dim_fluency,
            fidelity=t.dim_fidelity,
            readability=t.dim_readability,
            editing=t.dim_editing,
        ),
        review_count=t.review_count,
        sample_text=t.sample_text or "",
        reviews=[review_to_out(r) for r in t.reviews],
    )


def book_to_out(b: Book) -> BookOut:
    return BookOut(
        id=b.id,
        title=b.title,
        original_title=b.original_title,
        author=b.author,
        description=b.description,
        original_sample_text=b.original_sample_text or "",
        translations=[translation_to_out(t) for t in b.translations],
    )


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/books", response_model=list[BookOut])
def list_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return [book_to_out(b) for b in books]


@app.get("/api/books/{book_id}", response_model=BookOut)
def get_book(book_id: str, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="book not found")
    return book_to_out(book)


@app.get("/api/translations/{translation_id}/reviews", response_model=list[ReviewOut])
def list_reviews(translation_id: str, db: Session = Depends(get_db)):
    t = db.query(Translation).filter(Translation.id == translation_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="translation not found")
    reviews = (
        db.query(Review)
        .filter(Review.translation_id == translation_id)
        .order_by(Review.id.desc())
        .all()
    )
    return [review_to_out(r) for r in reviews]


@app.post("/api/translations/{translation_id}/reviews", response_model=ReviewOut, status_code=201)
def create_review(translation_id: str, payload: ReviewIn, db: Session = Depends(get_db)):
    t = db.query(Translation).filter(Translation.id == translation_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="translation not found")

    review = Review(
        translation_id=translation_id,
        user_name=payload.user_name.strip() or "کاربر ناشناس",
        rating=payload.rating,
        fluency=payload.fluency,
        fidelity=payload.fidelity,
        readability=payload.readability,
        editing=payload.editing,
        comment=payload.comment.strip(),
        strengths=payload.strengths.strip(),
        weaknesses=payload.weaknesses.strip(),
        created_at=datetime.now().strftime("%Y/%m/%d %H:%M"),
    )
    db.add(review)
    db.flush()

    # recompute aggregates from all reviews of this translation
    agg = (
        db.query(
            func.count(Review.id),
            func.avg(Review.rating),
            func.avg(Review.fluency),
            func.avg(Review.fidelity),
            func.avg(Review.readability),
            func.avg(Review.editing),
        )
        .filter(Review.translation_id == translation_id)
        .one()
    )
    t.review_count = int(agg[0] or 0)
    t.average_rating = round(float(agg[1] or 0), 1)
    t.dim_fluency = round(float(agg[2] or 0), 1)
    t.dim_fidelity = round(float(agg[3] or 0), 1)
    t.dim_readability = round(float(agg[4] or 0), 1)
    t.dim_editing = round(float(agg[5] or 0), 1)

    db.commit()
    db.refresh(review)
    return review_to_out(review)
