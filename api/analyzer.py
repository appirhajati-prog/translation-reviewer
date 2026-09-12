"""Deterministic, dependency-free Persian review heuristics (rule-based analyzer)."""
import re

POSITIVE_PATTERNS = [
    (r"روان", "fluency", 2),
    (r"خوش‌خوان|خوشخوان|خوانا", "readability", 2),
    (r"وفادار|دقیق|اصل", "fidelity", 2),
    (r"ویراست|نگارش|غلط.*کم|بی‌غلط|بی غلط", "editing", 2),
    (r"عالی|فوق‌العاده|شاهکار|بهترین|دوست داشت|لذت|پیشنهاد", None, 1),
    (r"خوب|زیبا|قوی|تاثیرگذار|تأثیرگذار", None, 1),
]

NEGATIVE_PATTERNS = [
    (r"ضعیف|بد|ناراضی|ناامید|افتضاح", None, -2),
    (r"غلط|اشتباه|ویراست.*بد|نگارش.*بد|تایپی", "editing", -2),
    (r"خشک|ثقیل|سنگین|نافهم|نامفهوم|گنگ", "readability", -1),
    (r"طولانی|خسته", "readability", -1),
    (r"حذف|سانسور|تحریف|دستکاری|کم و کسر|ناقص", "fidelity", -2),
    (r"قدیمی|کهنه|منسوخ", "fluency", -1),
    (r"کند|کسل", "readability", -1),
]

STAR_PATTERN = re.compile(r"([۰-۹0-5])\s*(?:از\s*۵|از\s*5|ستاره|⭐)")


def _count(text: str, pattern: str) -> int:
    return len(re.findall(pattern, text))


def score_comment(text: str) -> dict:
    """Return rating 1..5 + 4 dimension scores + extracted keywords."""
    t = (text or "").strip()
    dims = {"fluency": 3, "fidelity": 3, "readability": 3, "editing": 3}
    score = 3.0

    for pat, dim, w in POSITIVE_PATTERNS:
        n = _count(t, pat)
        if n:
            score += w * min(n, 2) * 0.5
            if dim:
                dims[dim] = min(5, dims[dim] + min(n, 2))
    for pat, dim, w in NEGATIVE_PATTERNS:
        n = _count(t, pat)
        if n:
            score += w * min(n, 2) * 0.5
            if dim:
                dims[dim] = max(1, dims[dim] - min(n, 2))

    m = STAR_PATTERN.search(t)
    if m:
        digit = m.group(1)
        fa = "۰۱۲۳۴۵۶۷۸۹"
        star = int(fa.index(digit)) if digit in fa else int(digit)
        if 1 <= star <= 5:
            score = round((score + star) / 2, 1)

    rating = max(1, min(5, round(score)))

    strengths: list[str] = []
    weaknesses: list[str] = []
    if _count(t, r"روان"):
        strengths.append("روانی متن")
    if _count(t, r"وفادار|دقیق"):
        strengths.append("وفاداری به اصل")
    if _count(t, r"خوانا|خوش‌خوان|خوشخوان"):
        strengths.append("خوانایی بالا")
    if _count(t, r"ویراست.*خوب|نگارش.*خوب|بی‌غلط|بی غلط"):
        strengths.append("ویرایش تمیز")
    if _count(t, r"غلط|اشتباه|تایپی"):
        weaknesses.append("غلط و اشتباه نگارشی")
    if _count(t, r"حذف|سانسور|تحریف|ناقص"):
        weaknesses.append("حذف/تحریف")
    if _count(t, r"طولانی|خسته|ثقیل|سنگین"):
        weaknesses.append("جملات طولانی و ثقیل")
    if _count(t, r"قدیمی|کهنه"):
        weaknesses.append("واژگان قدیمی")

    return {"rating": rating, "dimensions": dims, "strengths": strengths, "weaknesses": weaknesses}


def summarize(comments: list[str], scores: list[dict]) -> str:
    if not scores:
        return "نظری برای تحلیل پیدا نشد."
    avg = sum(s["rating"] for s in scores) / len(scores)
    pos = sum(1 for s in scores if s["rating"] >= 4)
    neg = sum(1 for s in scores if s["rating"] <= 2)
    return (
        f"از {len(scores)} نظر گردآوری‌شده، میانگین امتیاز {avg:.1f} از ۵ است. "
        f"{pos} نظر مثبت و {neg} نظر منفی ثبت شده است."
    )
