import re
from typing import List, Dict, Any, Optional

def extract_tables_from_text(raw_text: str) -> List[Dict[str, Any]]:
    """
    Detects and reconstructs tabular data blocks in NSS survey schedule text
    (e.g., Schedule 0.0 Listing, PLFS Household Blocks, MPCE Item Codes).
    
    Parses pipes '|', tabs, or multi-space column separators into structured tables:
    {"headers": [...], "rows": [[...], ...], "block_title": "..."}
    """
    tables: List[Dict[str, Any]] = []
    lines = raw_text.splitlines()

    current_table: Optional[Dict[str, Any]] = None
    table_lines: List[str] = []

    for line in lines:
        trimmed = line.strip()
        # Heuristic for table row: has pipe characters or multiple consecutive tab/multi-spaces
        is_pipe_row = "|" in trimmed and len(trimmed.split("|")) >= 3
        is_delimited_row = len(re.split(r"\s{2,}|\t", trimmed)) >= 3

        if is_pipe_row or is_delimited_row:
            table_lines.append(trimmed)
        else:
            if len(table_lines) >= 2:
                table = parse_table_lines(table_lines)
                if table:
                    tables.append(table)
            table_lines = []

    if len(table_lines) >= 2:
        table = parse_table_lines(table_lines)
        if table:
            tables.append(table)

    return tables

def parse_table_lines(lines: List[str]) -> Optional[Dict[str, Any]]:
    """
    Converts a sequence of detected table lines into headers and row cells.
    """
    clean_rows: List[List[str]] = []

    for line in lines:
        # Ignore markdown or horizontal border lines like +----+----+ or |---|---|
        if re.match(r"^[\s\|\+\-\=]+$", line):
            continue

        if "|" in line:
            cells = [c.strip() for c in line.split("|")]
            # Remove leading/trailing empty cells from split
            if cells and cells[0] == "":
                cells.pop(0)
            if cells and cells[-1] == "":
                cells.pop()
        else:
            cells = [c.strip() for c in re.split(r"\s{2,}|\t", line)]

        if cells:
            clean_rows.append(cells)

    if len(clean_rows) < 2:
        return None

    headers = clean_rows[0]
    data_rows = clean_rows[1:]

    return {
        "headers": headers,
        "rows": data_rows,
        "column_count": len(headers),
        "row_count": len(data_rows)
    }

def format_table_for_prompt(table: Dict[str, Any], max_rows: int = 10) -> str:
    """
    Formats a structured table as an easily interpretable markdown table for RAG context.
    """
    headers = table.get("headers", [])
    rows = table.get("rows", [])[:max_rows]

    header_line = "| " + " | ".join(headers) + " |"
    separator_line = "| " + " | ".join(["---"] * len(headers)) + " |"
    row_lines = ["| " + " | ".join(row[:len(headers)]) + " |" for row in rows]

    return "\n".join([header_line, separator_line] + row_lines)
