-- =============================================================================
-- StatVidya PostgreSQL 17 + pgvector Initialization Script
-- Reference Schema for Analytics Engine & Next.js RAG Services
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Semantic Knowledge Base & RAG Manual Chunks
CREATE TABLE IF NOT EXISTS document_chunks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id VARCHAR(255) NOT NULL,
  page_number INT NOT NULL,
  section_title TEXT,
  chunk_text  TEXT NOT NULL,
  embedding   VECTOR(384),      -- all-MiniLM-L6-v2 dimension (384)
  provenance  TEXT DEFAULT 'UPLOADED_MANUAL',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS document_chunks_doc_id_idx
  ON document_chunks (document_id);

-- Table for Continuous Item Response Theory (IRT) Competency Records
CREATE TABLE IF NOT EXISTS competency_records (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  official_id     VARCHAR(255) NOT NULL,
  competency_id   VARCHAR(255) NOT NULL,
  theta           FLOAT NOT NULL,
  standard_error  FLOAT NOT NULL,
  evidence_type   VARCHAR(50) DEFAULT 'SELF_REPORTED',  -- 'IRT_VERIFIED' | 'SELF_REPORTED'
  assessed_at     TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS competency_records_official_comp_idx
  ON competency_records (official_id, competency_id);

-- Table for Closed-Loop Outcome Attribution Events
CREATE TABLE IF NOT EXISTS outcome_events (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  official_id     VARCHAR(255) NOT NULL,
  event_type      VARCHAR(50) NOT NULL,  -- 'gap_detected' | 'course_enrolled' | 'course_completed' | 'reassessment'
  competency_id   VARCHAR(255),
  course_id       VARCHAR(255),
  theta_before    FLOAT,
  theta_after     FLOAT,
  delta_theta     FLOAT,
  metadata        JSONB,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS outcome_events_official_idx
  ON outcome_events (official_id);

CREATE INDEX IF NOT EXISTS outcome_events_course_idx
  ON outcome_events (course_id);
