# MindsDB Setup Guide

This guide will walk you through the necessary steps to set up MindsDB for the Book Aura application. Please ensure you have already followed the main `README.md` to start the Docker containers, which includes MindsDB.

## 1\. Access MindsDB

After running `docker compose up -d` (as instructed in the main `README.md`), open your web browser and navigate to the MindsDB GUI:

[`http://127.0.0.1:47334/`](https://www.google.com/search?q=%5Bhttp://127.0.0.1:47334/%5D\(http://127.0.0.1:47334/\))

## 2\. Prepare Your Dataset

The Book Aura application relies on a dataset of books. You will find the `book_dataset.csv` file within this repository. This CSV file contains approximately 1220 books with the following fields: `unique_id`, `book_name`, `category`, and `summary`.

**Steps to prepare the dataset:**

1.  **Download `book_dataset.csv`**: Locate and download the `book_dataset.csv` file from the root of this repository.
2.  **Upload to Google Sheets**: Upload this `book_dataset.csv` file to your Google Drive and convert it into a Google Sheet.
3.  **Make Public**: Set the sharing permissions for this Google Sheet to "Anyone with the link can **view**".
4.  **Get Sheet ID**: Copy the `spreadsheet_id` from the Google Sheet's URL. The `spreadsheet_id` is the long string of characters between `/d/` and `/edit` in the URL (e.g., `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`).
5.  **Name the Sheet**: Ensure the name of the sheet (tab within the Google Sheet) is exactly `book_dataset`.

## 3\. Configure MindsDB

Now, you will copy and paste the following SQL code blocks into the MindsDB SQL Editor (accessible through the MindsDB GUI). **Remember to replace placeholder values like `YOUR_OPENAI_API_KEY` and `YOUR_GOOGLE_SHEET_ID` with your actual keys and IDs.**

-----

### Step 1: Create a Database from the Google Sheet

This command connects MindsDB to your Google Sheet, allowing it to access the book data.

```sql
CREATE DATABASE book_sheet_1000
WITH ENGINE = "sheets",
PARAMETERS = {
  "spreadsheet_id": "YOUR_GOOGLE_SHEET_ID", --the sheet id you got from google sheets
  "sheet_name": "book_dataset"
};
```

### Step 2: Preview the First 50 Entries

After connecting, run this to verify that MindsDB can access your data.

```sql
SELECT * FROM book_sheet_1000.book_dataset LIMIT 50;
```

### Step 3: Create the Knowledge Base

This creates the core Knowledge Base that will power the semantic search. It uses OpenAI for embeddings and defines which columns store content and metadata.

```sql
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
```

### Step 4: Insert Data into the Knowledge Base

This command populates your `book_kb_1000` Knowledge Base with data from your Google Sheet.

```sql
INSERT INTO book_kb_1000
SELECT unique_id, category, book_name, summary
FROM book_sheet_1000.book_dataset;
```

### Step 5: Run a Test Semantic Search

Verify your Knowledge Base is working by performing a sample semantic search.

```sql
SELECT *
FROM book_kb_1000
WHERE content = ' explains the basics of meditation using ideas from multiple spiritual sources, including how to avoid the mental traps that make it difficult so you can practice frequently and make mindfulness, and the many benefits that come with it, part of your daily life'
LIMIT 5;
```

### Step 6: Set up a Data Ingestion Job

This MindsDB JOB will periodically check your Google Sheet for new entries (specifically, those with `unique_id` greater than 1220, assuming your initial dataset ends at 1220) and insert them into the Knowledge Base.

```sql
CREATE JOB book_kb_job AS (
  INSERT INTO book_kb_1000
  SELECT unique_id, category, book_name, summary
  FROM book_sheet_1000.book_dataset
  WHERE unique_id > 1220;
)
EVERY 1 min;
```

### Step 7: Create the Book Bot Agent

This MindsDB Agent acts as your AI literary expert, providing insightful answers to user questions about books.

```sql
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
```

### Step 8: Test the Book Bot Agent

Run a test query to see the Book Bot in action.

```sql
SELECT answer
FROM book_bot
WHERE
  book_name = '1984'
  AND description = 'A dystopian novel set in a totalitarian society ruled by Big Brother, where surveillance and propaganda dominate everyday life.'
  AND question = 'What makes this book still relevant in today’s world?';
```

### Step 9: Create the Enriched Book Info Model

This MindsDB Model uses AI to generate comprehensive, enriched details for any given book.

```sql
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
```

### Step 10: Test the Enriched Book Info Model

Test the model to generate enriched details for a sample book.

```sql
SELECT response
FROM enriched_book_info
WHERE
  book_name = '1984'
  AND description = 'A dystopian novel set in a totalitarian society ruled by Big Brother, where surveillance and propaganda dominate everyday life.'
  AND category = 'Fiction';
```

-----

## Dropping Resources (Optional)

If you need to remove the created MindsDB resources, you can use the following commands:

```sql
DROP JOB IF EXISTS book_kb_job;
DROP AGENT IF EXISTS book_bot;
DROP MODEL IF EXISTS enriched_book_info;
DROP KNOWLEDGE_BASE IF EXISTS book_kb_1000;
DROP DATABASE IF EXISTS book_sheet_1000;
```

-----

## Next Steps

The app should run as shown in the demo video if everthing is done following the given instructions.