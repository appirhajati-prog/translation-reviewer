"""Fetch public comments about a translation from the open web.

Strategy (ToS-friendly by default):
1. If the caller passes explicit source URLs, fetch only those pages.
2. Otherwise use DuckDuckGo HTML endpoint to discover candidate pages about
   the book + translator, then fetch the top candidates.
3. Extract comment-like text blocks with BeautifulSoup heuristics.
Respects robots.txt per host and skips login-walled pages.
"""
import re
import time
import urllib.parse
import urllib.robotparser as robotparser
from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "translation-reviewer-bot/0.1 (+https://appirhajati-prog.github.io/translation-reviewer/)",
    "Accept-Language": "fa,en;q=0.8",
}

BLOCKLIST = ("login", "signin", "signup", "cart", "checkout")
COMMENT_SELECTORS = [
    "[class*=comment]", "[class*=review]", "[class*=opinion]",
    "[class*=نظر]", "[class*=نقد]", "[id*=comment]", "[id*=review]",
]


@dataclass
class FetchedComment:
    author: str
    text: str
    url: str


_robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}


def allowed_by_robots(url: str) -> bool:
    try:
        parts = urllib.parse.urlsplit(url)
        origin = f"{parts.scheme}://{parts.netloc}"
        if origin not in _robots_cache:
            rp = robotparser.RobotFileParser()
            rp.set_url(origin + "/robots.txt")
            try:
                rp.read()
            except Exception:
                return True
            _robots_cache[origin] = rp
        return _robots_cache[origin].can_fetch(HEADERS["User-Agent"], url)
    except Exception:
        return True


def ddg_search(query: str, client: httpx.Client, limit: int = 6) -> list[str]:
    try:
        r = client.get("https://html.duckduckgo.com/html/", params={"q": query}, timeout=15)
        if r.status_code != 200:
            return []
        soup = BeautifulSoup(r.text, "lxml")
        urls: list[str] = []
        for a in soup.select("a.result__a"):
            href = a.get("href", "")
            if not href or any(b in href for b in BLOCKLIST):
                continue
            # ddg wraps links in /l/?uddg=<encoded>
            if "uddg=" in href:
                href = urllib.parse.parse_qs(urllib.parse.urlsplit(href).query).get("uddg", [href])[0]
                href = urllib.parse.unquote(href)
            if href.startswith("http"):
                urls.append(href)
            if len(urls) >= limit:
                break
        return urls
    except Exception:
        return []


def extract_comments(html: str, url: str, max_chars: int = 800) -> list[FetchedComment]:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()
    blocks: list[str] = []
    for sel in COMMENT_SELECTORS:
        for el in soup.select(sel):
            text = el.get_text(" ", strip=True)
            if 30 <= len(text) <= 3000:
                blocks.append(text)
            if len(blocks) >= 30:
                break
    if not blocks:
        for p in soup.select("article p, .content p, main p, p"):
            text = p.get_text(" ", strip=True)
            if 60 <= len(text) <= 1200:
                blocks.append(text)
            if len(blocks) >= 30:
                break
    out: list[FetchedComment] = []
    seen: set[str] = set()
    for b in blocks:
        key = b[:120]
        if key in seen:
            continue
        seen.add(key)
        out.append(FetchedComment(author="کاربر وب", text=b[:max_chars], url=url))
    return out


def fetch_comments_for_translation(
    book_title: str,
    translator_name: str,
    publisher: str = "",
    source_urls: list[str] | None = None,
    max_pages: int = 5,
) -> tuple[list[FetchedComment], list[str]]:
    """Returns (comments, fetched_urls). Never raises — returns what it could get."""
    comments: list[FetchedComment] = []
    fetched: list[str] = []
    with httpx.Client(headers=HEADERS, follow_redirects=True) as client:
        if source_urls:
            candidates = [u for u in source_urls if u.startswith("http")][:max_pages]
        else:
            q = f"{book_title} {translator_name} {publisher} نظر نقد ترجمه".strip()
            candidates = ddg_search(q, client, limit=max_pages)
        for url in candidates:
            if any(b in url for b in BLOCKLIST) or not allowed_by_robots(url):
                continue
            try:
                r = client.get(url, timeout=15)
                if r.status_code != 200 or "text/html" not in r.headers.get("content-type", "text/html"):
                    continue
                fetched.append(url)
                comments.extend(extract_comments(r.text, url))
                time.sleep(0.5)
            except Exception:
                continue
    # de-dupe by text prefix
    seen: set[str] = set()
    unique: list[FetchedComment] = []
    for c in comments:
        key = c.text[:100]
        if key not in seen:
            seen.add(key)
            unique.append(c)
    return unique[:40], fetched
