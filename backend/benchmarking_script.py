# THIS SCRIPT IS FOR BENCHMARKING MINDSDB BOOK SEARCH PERFORMANCE, NOT RELEVENT FOR RUNNING THE APP

import pandas as pd
import time
import json
import numpy as np # For np.mean
from collections import defaultdict
import mindsdb_sdk  # New import for direct MindsDB connection
import logging # For logging MindsDB connection status

# --- Configuration ---
MINDSDB_URL = "http://127.0.0.1:47334" # MindsDB local URL from app.py
PROJECT_NAME = "mindsdb" # Default project name in MindsDB
INPUT_CSV_PATH = "testing_books.csv"  # Path to the input CSV provided
OUTPUT_CSV_PATH = "book_aura_benchmark_results.csv"
NUM_RUNS = 10  # Number of times to run each query for averaging
MINDSDBS_KB_MODEL_NAME = "book_kb_1000" # Name of your Knowledge Base model in MindsDB

# --- Logging (for MindsDB connection status) ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- MindsDB Connection ---
try:
    con = mindsdb_sdk.connect(MINDSDB_URL)
    project = con.get_project(PROJECT_NAME)
    logger.info(f"Successfully connected to MindsDB at {MINDSDB_URL}, project '{PROJECT_NAME}'")
except Exception as e:
    logger.error(f"Failed to connect to MindsDB at {MINDSDB_URL}: {e}")
    # Exit if MindsDB connection fails, as the script cannot proceed
    raise RuntimeError(f"Failed to connect to MindsDB: {e}")

# --- Helper to escape SQL strings (from your app.py) ---
def escape_sql_string(value: str) -> str:
    """Escapes single quotes for SQL queries."""
    return value.replace("'", "''")

# --- Helper Function to Query MindsDB Directly ---
def run_mindsdb_book_search_query(query_text: str, category: str = None):
    """
    Constructs and sends a direct query to MindsDB and returns
    response time and parsed results, similar to your /book_search endpoint.
    """
    escaped_query = escape_sql_string(query_text)
    
    # Construct the MindsDB query string
    mindsdb_query = f"SELECT * FROM {MINDSDBS_KB_MODEL_NAME} WHERE content = '{escaped_query}'"
    if category and category != "-1":
        mindsdb_query += f" AND category = '{escape_sql_string(category)}'"
    mindsdb_query += " LIMIT 3;" # Limiting to 3 as per your app.py

    try:
        start_time = time.time()
        result = project.query(mindsdb_query)
        rows = result.fetch()
        elapsed_time = round(time.time() - start_time, 4)

        # Parse results similar to your app.py's /book_search response structure
        parsed_results = []
        if not rows.empty:
            for _, row in rows.iterrows():
                metadata = {}
                try:
                    # Metadata can be a string or already a dict from MindsDB SDK
                    if isinstance(row.get("metadata"), str):
                        metadata = json.loads(row.get("metadata", "{}"))
                    elif isinstance(row.get("metadata"), dict):
                        metadata = row.get("metadata", {})
                except json.JSONDecodeError:
                    logger.warning(f"Bad metadata format for row: {row.get('metadata')}")

                parsed_results.append({
                    "book_name": metadata.get("book_name", "Unknown"),
                    "category": metadata.get("category", "Unknown"),
                    "summary": row.get("chunk_content", ""), # Using chunk_content as summary
                    "relevance": row.get("relevance", 0.0),
                    # IMPORTANT: Include original_doc_id for the check_is_in_top_5 logic
                    "original_doc_id": metadata.get("original_doc_id"),
                    # Include metadata itself for the checker to parse it
                    "metadata": row.get("metadata") 
                })
        
        return elapsed_time, parsed_results
    except Exception as e:
        logger.error(f"Error querying MindsDB for query '{query_text}' (category: {category}): {e}")
        return None, None

# --- Main Benchmarking Logic ---
def run_benchmark():
    # --- Specify encoding for CSV to avoid UnicodeDecodeError ---
    try:
        test_data = pd.read_csv(INPUT_CSV_PATH, encoding='latin1')
    except UnicodeDecodeError:
        print(f"Failed to read '{INPUT_CSV_PATH}' with 'latin1' encoding. Trying 'cp1252'...")
        test_data = pd.read_csv(INPUT_CSV_PATH, encoding='cp1252')
    except Exception as e:
        print(f"Error reading CSV file {INPUT_CSV_PATH}: {e}")
        print("Please ensure the CSV is correctly formatted and accessible.")
        return

    all_results = []
    response_times_by_query_type = defaultdict(lambda: defaultdict(list))

    print("--- Starting Book Aura Benchmark (Direct MindsDB Connection) ---")
    print(f"Reading test data from: {INPUT_CSV_PATH}")
    print(f"MindsDB URL: {MINDSDB_URL}")
    print(f"MindsDB Project: {PROJECT_NAME}")
    print(f"MindsDB Knowledge Base Model: {MINDSDBS_KB_MODEL_NAME}")
    print(f"Number of runs per query scenario: {NUM_RUNS}")

    first_query_response_printed = False

    for index, row in test_data.iterrows():
        # Referencing column names from testing_books.csv
        prompt_id = str(row["unique_id"])      # Unique identifier for the test query
        query_type = row["type_nature"]        # Type/nature of the query (e.g., 'exact_match', 'non_existent')
        query_text = row["query"]              # The actual search query text
        
        # Extract expected unique_ids, handling potential multiple IDs (comma-separated)
        raw_expected_uids = str(row["unique_id"]) if pd.notna(row["unique_id"]) else "-1"
        expected_unique_ids = [uid.strip() for uid in raw_expected_uids.split(',')] if raw_expected_uids != "-1" else []

        # Extract category from CSV, if available
        input_category = str(row["category"]) if pd.notna(row["category"]) else None
        
        print(f"\n--- Processing Query ID: {prompt_id} (Type: {query_type}) ---")
        print(f"Query Text: \"{query_text}\"")
        print(f"Expected Unique ID(s): {', '.join(expected_unique_ids) if expected_unique_ids else 'None'}")
        
        # --- Helper for is_in_top_5 check ---
        def check_is_in_top_5(api_results, expected_uids):
            """
            Checks if any of the expected unique IDs are present in the top 5 results
            returned by the API. It attempts to extract IDs from direct fields
            or from a 'metadata' JSON string.
            """
            if not api_results or not expected_uids:
                return False
            
            found_ids_in_top_5 = set()
            for res in api_results[:5]: # Only consider the top 5 results
                # Try to extract the unique_id directly from the parsed result
                # Note: 'original_doc_id' is the primary one we expect from MindsDB metadata
                current_result_id = res.get('original_doc_id') or res.get('unique_id') or res.get('id') or res.get('chunk_id')
                if current_result_id is not None:
                    found_ids_in_top_5.add(str(current_result_id).strip())
                
                # The 'metadata' field might still contain the ID if it wasn't directly mapped
                # This part re-parses the raw metadata if needed.
                metadata_field_raw = res.get('metadata')
                if metadata_field_raw:
                    if isinstance(metadata_field_raw, str): # If metadata is a JSON string, parse it
                        try:
                            meta_dict = json.loads(metadata_field_raw)
                            meta_id = meta_dict.get('original_doc_id') or meta_dict.get('unique_id') or meta_dict.get('id')
                            if meta_id is not None:
                                found_ids_in_top_5.add(str(meta_id).strip())
                        except json.JSONDecodeError:
                            pass
                    elif isinstance(metadata_field_raw, dict): # If metadata is already a dict
                        meta_id = metadata_field_raw.get('original_doc_id') or metadata_field_raw.get('unique_id') or metadata_field_raw.get('id')
                        if meta_id is not None:
                            found_ids_in_top_5.add(str(meta_id).strip())
            
            # Return True if any expected ID is found in the collected IDs from the top 5 results
            return any(exp_uid in found_ids_in_top_5 for exp_uid in expected_uids)


        # --- Scenario 1: Without Category Filter ---
        print(f"  --> Running WITHOUT category filter ({NUM_RUNS} times)...")
        for i in range(NUM_RUNS):
            response_time, api_results = run_mindsdb_book_search_query(query_text)
            
            if response_time is not None:
                response_times_by_query_type[query_type]["no_filter"].append(response_time)
                
                is_in_top_5 = check_is_in_top_5(api_results, expected_unique_ids)

                all_results.append({
                    "prompt_id": prompt_id,
                    "query_type": query_type,
                    "query_text": query_text,
                    "category_tested": "None", # Indicates no category filter was applied
                    "response_time_sec": response_time,
                    "is_in_top_5": is_in_top_5
                })
                
                # Print the full response for the very first API call
                if not first_query_response_printed and index == 0 and i == 0:
                    print("\n--- First Query MindsDB Response Example (Without Filter) ---")
                    print(json.dumps(api_results, indent=2))
                    print("------------------------------------------------------")
                    first_query_response_printed = True
            else:
                # Log an error if API call failed
                all_results.append({
                    "prompt_id": prompt_id,
                    "query_type": query_type,
                    "query_text": query_text,
                    "category_tested": "None",
                    "response_time_sec": None,
                    "is_in_top_5": False # Cannot determine if API call failed
                })
        print(f"  <-- Completed WITHOUT category filter for Query ID {prompt_id}.")

        # --- Scenario 2: With Category Filter ---
        categories_to_test = []
        if input_category and input_category != "-1":
            # If a specific category is provided in the CSV, test with that
            categories_to_test.append(input_category)
        elif query_type == "non_existent":
            # For 'non_existent' queries, test with specified categories if no input_category
            categories_to_test.extend(["relationships", "biography"])
        else:
            # Default category for other query types if no specific category is given
            categories_to_test.append("relationships") 

        for category_to_use in categories_to_test:
            print(f"  --> Running WITH category filter '{category_to_use}' ({NUM_RUNS} times)...")
            for i in range(NUM_RUNS):
                response_time, api_results = run_mindsdb_book_search_query(query_text, category=category_to_use)
                
                if response_time is not None:
                    response_times_by_query_type[query_type]["with_filter"].append(response_time)

                    is_in_top_5 = check_is_in_top_5(api_results, expected_unique_ids)

                    all_results.append({
                        "prompt_id": prompt_id,
                        "query_type": query_type,
                        "query_text": query_text,
                        "category_tested": category_to_use,
                        "response_time_sec": response_time,
                        "is_in_top_5": is_in_top_5
                    })
                else:
                    # Log an error if API call failed
                    all_results.append({
                        "prompt_id": prompt_id,
                        "query_type": query_type,
                        "query_text": query_text,
                        "category_tested": category_to_use,
                        "response_time_sec": None,
                        "is_in_top_5": False # Cannot determine if API call failed
                    })
            print(f"  <-- Completed WITH category filter '{category_to_use}' for Query ID {prompt_id}.")

    # --- Calculate Averages for Summary ---
    summary_results = []
    print("\n--- Calculating Average Response Times ---")
    for q_type, scenarios in response_times_by_query_type.items():
        avg_no_filter = np.mean(scenarios["no_filter"]) if scenarios["no_filter"] else np.nan
        avg_with_filter = np.mean(scenarios["with_filter"]) if scenarios["with_filter"] else np.nan
        
        summary_results.append({
            "query_type": q_type,
            "avg_response_time_no_filter_sec": avg_no_filter,
            "avg_response_time_with_filter_sec": avg_with_filter
        })

    summary_df = pd.DataFrame(summary_results)
    print("\n--- Benchmark Summary: Average Response Times ---")
    print(summary_df.to_string(index=False)) # Use to_string for better console formatting

    # --- Write Results to CSV ---
    output_df = pd.DataFrame(all_results)
    output_df.to_csv(OUTPUT_CSV_PATH, index=False)
    print(f"\n✅ Detailed results saved to: {OUTPUT_CSV_PATH}")
    print("\n--- Benchmark Finished ---")

if __name__ == "__main__":
    run_benchmark()