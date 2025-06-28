import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mindsdb_sdk
import logging
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MindsDB connection
try:
    con = mindsdb_sdk.connect('http://127.0.0.1:47334')
    project = con.get_project('mindsdb')
except Exception as e:
    logger.error(f"Failed to connect to MindsDB: {e}")
    raise RuntimeError(f"Failed to connect to MindsDB: {e}")

# Escape helper
def escape_sql_string(value: str) -> str:
    return value.replace("'", "''")

# -------------------------- Book Search API --------------------------

class BookSearchRequest(BaseModel):
    query: str
    category: str | None = None

class BookSearchResponse(BaseModel):
    book_name: str
    category: str
    summary: str
    relevance: float

@app.post("/book_search", response_model=list[BookSearchResponse])
async def book_search(request: BookSearchRequest):
    try:
        escaped_query = escape_sql_string(request.query)
        query = f"SELECT * FROM book_kb_1000 WHERE content = '{escaped_query}'"
        if request.category:
            query += f" AND category = '{escape_sql_string(request.category)}'"
        query += " LIMIT 3;"

        result = project.query(query)
        rows = result.fetch()

        if rows.empty:
            raise HTTPException(status_code=404, detail="No matching books found")

        results = []
        for _, row in rows.iterrows():
            metadata = {}
            try:
                metadata = json.loads(row.get("metadata", "{}"))
            except json.JSONDecodeError:
                logger.warning(f"Bad metadata: {row.get('metadata')}")
            results.append(BookSearchResponse(
                book_name=metadata.get("book_name", "Unknown"),
                category=metadata.get("category", "Unknown"),
                summary=row.get("chunk_content", ""),
                relevance=row.get("relevance", 0.0)
            ))
        return results
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Book search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------- Book Bot API --------------------------


# bot can provide a thoughtful short paragraph offering a deep interpretation of the book’s meaning or relevance.
class BookBotRequest(BaseModel):
    book_name: str
    summary: str
    question: str

@app.post("/book_bot")
async def book_bot_query(request: BookBotRequest):
    try:
        q = f"""
            SELECT answer
            FROM book_bot
            WHERE
              book_name = '{escape_sql_string(request.book_name)}'
              AND description = '{escape_sql_string(request.summary)}'
              AND question = '{escape_sql_string(request.question)}';
        """
        logger.info(f"Running book_bot query: {q}")
        result = project.query(q)
        rows = result.fetch()

        if rows.empty:
            raise HTTPException(status_code=404, detail="No answer found")

        return {"answer": rows.iloc[0]["answer"]}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Book bot failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------- Enriched Book Info API --------------------------

class EnrichedBookInfoRequest(BaseModel):
    book_name: str
    summary: str
    category: str

@app.post("/enriched_book_info")
async def enriched_book_info_query(request: EnrichedBookInfoRequest):
    try:
        q = f"""
            SELECT response
            FROM enriched_book_info
            WHERE
              book_name = '{escape_sql_string(request.book_name)}'
              AND description = '{escape_sql_string(request.summary)}'
              AND category = '{escape_sql_string(request.category)}';
        """
        logger.info(f"Running enriched_book_info query: {q}")
        result = project.query(q)
        rows = result.fetch()

        if rows.empty:
            raise HTTPException(status_code=404, detail="No enriched info found")

        return {"response": rows.iloc[0]["response"]}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enriched book info failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
