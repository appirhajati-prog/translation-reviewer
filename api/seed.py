"""Seed the DB from the same content as web/src/data/mockData.ts."""
from .database import Base, SessionLocal, engine
from .models import Book, Review, Translation

SEED_BOOKS = [
    {
        "id": "1",
        "title": "صد سال تنهایی",
        "original_title": "Cien años de soledad",
        "author": "گابریل گارسیا مارکز",
        "description": "شاهکار ادبیات آمریکای لاتین، داستان خانواده بوئندیا در ماکوندو.",
        "original_sample_text": "Muchos años después, frente al pelotón de fusilamiento...",
    },
    {
        "id": "2",
        "title": "جنایت و مکافات",
        "original_title": "Crime and Punishment",
        "author": "فئودور داستایفسکی",
        "description": "داستان دانشجوی فقیری به نام راسکولنیکف و عواقب روانی قتل.",
        "original_sample_text": "В начале июля, в чрезвычайно жаркое время...",
    },
]

SEED_TRANSLATIONS = [
    {
        "id": "t1", "book_id": "1", "translator_id": "tr1",
        "translator_name": "بهمن فرزانه", "publisher": "انتشارات امیرکبیر",
        "publish_year": 1398,
        "sample_text": "سال‌ها بعد، در برابر جوخه اعدام، سرهنگ اورلیانو...",
    },
    {
        "id": "t2", "book_id": "1", "translator_id": "tr2",
        "translator_name": "کیومرث پارسای", "publisher": "انتشارات نگاه",
        "publish_year": 1400,
        "sample_text": "خیلی سال‌ها بعد، وقتی جلوی دسته تیراندازی ایستاده بود...",
    },
    {
        "id": "t5", "book_id": "1", "translator_id": "tr5",
        "translator_name": "کاوه میرعباسی", "publisher": "کتاب‌سرای نیک",
        "publish_year": 1402,
        "sample_text": "سال‌ها بعد، وقتی سرهنگ آئورلیانو بوئندیا در برابر جوخه آتش قرار گرفت...",
    },
    {
        "id": "t3", "book_id": "2", "translator_id": "tr3",
        "translator_name": "احمد گلشیری", "publisher": "انتشارات نیلوفر",
        "publish_year": 1395,
        "sample_text": "اوایل ماه ژوئیه، در گرمای شدید، هنگام غروب...",
    },
    {
        "id": "t4", "book_id": "2", "translator_id": "tr4",
        "translator_name": "مهری آهی", "publisher": "انتشارات جامی",
        "publish_year": 1399,
        "sample_text": "در آغاز جولای، در هوایی بس گرم، نزدیک شامگاهان...",
    },
]

SEED_REVIEWS = [
    {
        "translation_id": "t1", "user_name": "علی محمدی", "rating": 5,
        "fluency": 5, "fidelity": 5, "readability": 4, "editing": 5,
        "comment": "ترجمه بسیار روان و وفادار به متن اصلی.",
        "strengths": "روانی متن,وفاداری به سبک نویسنده",
        "weaknesses": "برخی واژگان قدیمی",
        "created_at": "1404/06/15",
    },
    {
        "translation_id": "t1", "user_name": "سارا کریمی", "rating": 4,
        "fluency": 4, "fidelity": 5, "readability": 4, "editing": 4,
        "comment": "ترجمه خوبیه ولی بعضی جاها جملات طولانی شدن.",
        "strengths": "دقت در ترجمه اسامی خاص",
        "weaknesses": "جملات طولانی",
        "created_at": "1404/05/20",
    },
    {
        "translation_id": "t3", "user_name": "مریم حسینی", "rating": 5,
        "fluency": 5, "fidelity": 5, "readability": 5, "editing": 5,
        "comment": "بهترین ترجمه فارسی این اثر.",
        "strengths": "انتقال فضای داستان,دقت در دیالوگ‌ها",
        "weaknesses": "",
        "created_at": "1404/03/05",
        "source": "manual",
        "source_url": "",
    },
    # --- auto-analysis of user-provided links (صد سال تنهایی) ---
    {
        "translation_id": "t1", "user_name": "تحلیل خودکار وب (وبلاگ طاقچه)", "rating": 5,
        "fluency": 5, "fidelity": 4, "readability": 5, "editing": 5,
        "comment": "طبق بررسی وبلاگ طاقچه، قدیمی‌ترین ترجمه فارسی صد سال تنهایی متعلق به بهمن فرزانه است. با اینکه از زبان اصلی ترجمه نشده، هنوز یکی از بهترین و مهم‌ترین ترجمه‌های موجود است؛ امیرکبیر بهترین ناشر این کتاب معرفی شده و نسخه صوتی آن هم جزو پرمخاطب‌ترین‌هاست.",
        "strengths": "نثر جاافتاده و کلاسیک,چاپ معتبر امیرکبیر,نسخه صوتی پرمخاطب,شجره‌نامه ابتدای کتاب",
        "weaknesses": "ترجمه از زبان واسط نه اسپانیایی",
        "created_at": "1405/06/23",
        "source": "auto-analysis",
        "source_url": "https://taaghche.com/blog/1402/05/08/%D9%85%D9%82%D8%A7%DB%8C%D8%B3%D9%87-%D8%AA%D8%B1%D8%AC%D9%85%D9%87-%D9%87%D8%A7%DB%8C-%D8%B5%D8%AF-%D8%B3%D8%A7%D9%84-%D8%AA%D9%86%D9%87%D8%A7%DB%8C%DB%8C/",
    },
    {
        "translation_id": "t1", "user_name": "تحلیل خودکار وب (نظر کاربران ایران‌کتاب)", "rating": 4,
        "fluency": 4, "fidelity": 4, "readability": 3, "editing": 5,
        "comment": "کاربران ایران‌کتاب (امتیاز کلی کتاب ۳.۵۹ از ۳۵ رأی) بیشتر از سنگینی قلم و گیج‌کنندگی اسم‌های مشابه گفته‌اند تا خود ترجمه؛ چاپ امیرکبیر با شجره‌نامه ابتدای کتاب این مشکل را کمتر می‌کند. توصیه کاربران: با سرعت کم و رجوع به شجره‌نامه بخوانید.",
        "strengths": "شجره‌نامه ابتدای چاپ امیرکبیر,مناسب خوانش عمیق",
        "weaknesses": "قلم سنگین,اسم‌های مشابه گیج‌کننده",
        "created_at": "1405/06/23",
        "source": "auto-analysis",
        "source_url": "https://www.iranketab.ir/book/155-one-hundred-years-of-solitude",
    },
    {
        "translation_id": "t5", "user_name": "تحلیل خودکار وب (وبلاگ طاقچه + ایران‌کتاب)", "rating": 5,
        "fluency": 5, "fidelity": 5, "readability": 5, "editing": 4,
        "comment": "طبق وبلاگ طاقچه، ترجمه کاوه میرعباسی جدید، دقیق و روان و مستقیم از اسپانیایی است و بهترین ترجمه موجود دانسته شده؛ جزو نسخه‌های الکترونیکی با بیشترین رأی و امتیاز بالاست. در ایران‌کتاب (کتاب‌سرای نیک، چاپ ۲۱، ۱۴۰۲، ۴۵۵ صفحه) کاربران صریحا خواستار موجود شدن همین ترجمه شده‌اند.",
        "strengths": "ترجمه مستقیم از اسپانیایی,دقت و روانی,پرمخاطب‌ترین نسخه الکترونیکی",
        "weaknesses": "",
        "created_at": "1405/06/23",
        "source": "auto-analysis",
        "source_url": "https://taaghche.com/blog/1402/05/08/%D9%85%D9%82%D8%A7%DB%8C%D8%B3%D9%87-%D8%AA%D8%B1%D8%AC%D9%85%D9%87-%D9%87%D8%A7%DB%8C-%D8%B5%D8%AF-%D8%B3%D8%A7%D9%84-%D8%AA%D9%86%D9%87%D8%A7%DB%8C%DB%8C/",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Book).count() > 0:
            print("DB already seeded, skipping.")
            return
        for b in SEED_BOOKS:
            db.add(Book(**b))
        for t in SEED_TRANSLATIONS:
            db.add(Translation(
                **t, average_rating=0.0, review_count=0,
                dim_fluency=0.0, dim_fidelity=0.0,
                dim_readability=0.0, dim_editing=0.0,
            ))
        for r in SEED_REVIEWS:
            db.add(Review(**r))
        db.commit()
        for t in SEED_TRANSLATIONS:
            tid = t["id"]
            revs = db.query(Review).filter(Review.translation_id == tid).all()
            tr = db.query(Translation).filter(Translation.id == tid).first()
            if revs and tr:
                tr.review_count = len(revs)
                tr.average_rating = round(sum(x.rating for x in revs) / len(revs), 1)
                tr.dim_fluency = round(sum(x.fluency for x in revs) / len(revs), 1)
                tr.dim_fidelity = round(sum(x.fidelity for x in revs) / len(revs), 1)
                tr.dim_readability = round(sum(x.readability for x in revs) / len(revs), 1)
                tr.dim_editing = round(sum(x.editing for x in revs) / len(revs), 1)
        db.commit()
        print("Seeded 2 books.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

