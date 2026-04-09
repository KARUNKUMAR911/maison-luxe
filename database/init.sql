-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- Indexes created after Prisma migration runs via seed
-- This file runs on first Postgres container boot
