CREATE DATABASE book_sheet_1000
WITH ENGINE = "sheets",
PARAMETERS = {
  "spreadsheet_id": "YOUR_GOOGLE_SHEET_ID", --the sheet id you got from google sheets
  "sheet_name": "book_dataset"
};


SELECT * FROM book_sheet_1000.book_dataset LIMIT 50;


CREATE KNOWLEDGE_BASE book_kb_1000
USING
  embedding_model = {
    "provider": "openai",
    "model_name": "text-embedding-3-large",
    "api_key": "YOUR_OPENAI_API_KEY"
  },
  metadata_columns = ['category','book_name'],
  content_columns = ['summary'],
  id_column = 'unique_id';


INSERT INTO book_kb_1000
SELECT unique_id, category, book_name, summary
FROM book_sheet_1000.book_dataset;


SELECT *
FROM book_kb_1000
WHERE content = ' explains the basics of meditation using ideas from multiple spiritual sources, including how to avoid the mental traps that make it difficult so you can practice frequently and make mindfulness, and the many benefits that come with it, part of your daily life'
LIMIT 5;


CREATE JOB book_kb_job AS (
  INSERT INTO book_kb_1000
  SELECT unique_id, category, book_name, summary
  FROM book_sheet_1000.book_dataset
  WHERE unique_id > 1220;
)
EVERY 1 min;




CREATE AGENT book_bot
USING
  model = 'gpt-4o',
  openai_api_key = 'YOUR_OPENAI_API_KEY',
  prompt_template = '
You are a seasoned literary expert with deep knowledge of books across genres, eras, and cultures.

A user is asking about the book titled "{{book_name}}".

Book Description:
{{description}}

User’s Question:
"{{question}}"

Respond insightfully, drawing from the book’s themes, tone, genre, and cultural relevance. If applicable, connect the book’s message to modern issues or the reader’s perspective.

Keep your response clear, concise, and intelligent — as if you were offering guidance in a book club or academic setting. Avoid vague or generic replies. Always respond as a knowledgeable and thoughtful literary guide. Keep it short.
';





SELECT answer
FROM book_bot
WHERE
  book_name = '1984'
  AND description = 'A dystopian novel set in a totalitarian society ruled by Big Brother, where surveillance and propaganda dominate everyday life.'
  AND question = 'What makes this book still relevant in today’s world?';




CREATE MODEL enriched_book_info
PREDICT response
INPUT book_name, description, category
USING
  engine = 'openai',
  model_name = 'gpt-4o',
  openai_api_key = 'YOUR_OPENAI_API_KEY',
  prompt_template = '
You are a literary expert with deep knowledge of books and their cultural relevance.

Given a book title, a short description, and its category, generate the following:

1. **Author** – Most likely author of the book.  
2. **Release Year** – Approximate year of original publication.  
3. **Rating** – Estimated popularity rating (e.g., 4.5/5).  
4. **Tags** – Exactly 5 thematic or genre-related tags, comma-separated.  
5. **Similar Books** – Exactly 3 titles that are similar in theme, tone, or genre, comma-separated.  
6. **Target Audience** – A one-line description of the kind of readers who would enjoy this book.

**Strictly follow this output format — one field per line, no labels or extra commentary:**

author: ...  
release_year: ...  
rating: ...  
tags: ...
similar_books: ...  
target_audience: ...

Book Title: {{book_name}}  
Description: {{description}}  
Category: {{category}}
';




SELECT response
FROM enriched_book_info
WHERE
  book_name = '1984'
  AND description = 'A dystopian novel set in a totalitarian society ruled by Big Brother, where surveillance and propaganda dominate everyday life.'
  AND category = 'Fiction';





DROP JOB IF EXISTS book_kb_job;
DROP AGENT IF EXISTS book_bot;
DROP MODEL IF EXISTS enriched_book_info;
DROP KNOWLEDGE_BASE IF EXISTS book_kb_1000;
DROP DATABASE IF EXISTS book_sheet_1000;
