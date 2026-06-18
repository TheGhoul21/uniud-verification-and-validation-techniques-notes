# Supabase Queries and Schema Reference

This document stores the database structure and necessary queries to retrieve lecture notes and transcriptions from the Supabase `lecture notes application`.

## Schema Mapping

- **`Courses` Table**: 
  - Contains course metadata.
  - Important columns: `id`, `description` (holds the course name/title).
  - Current V&V sources for this book:
    - Course `88`: 12 lectures, Part I source.
    - Course `89`: 28 lectures, Part II source.

- **`Lectures` Table**:
  - Contains individual lessons.
  - Important columns: `id`, `title` (e.g., "L01", "Lesson 2"), `course` (foreign key to `Courses.id`).

- **`Lecture_Attachments` Table**:
  - Mapping table linking a lecture to its attachments.
  - Important columns: `lecture` (foreign key to `Lectures.id`), `attachment` (foreign key to `Attachments.id`).

- **`Attachments` Table**:
  - Contains the actual files/transcriptions.
  - Important columns: `id`, `name` (e.g., "Combined Transcription (2 files)"), `kind`, `mime_type` (e.g., `text/markdown`), `content` (the actual text data).

## Common Queries

### 1. Find Course ID by Name
```sql
SELECT id, description 
FROM "Courses" 
WHERE description ILIKE '%verification%';
```

### 2. Find Lecture IDs for a Specific Course
*(Example for Course ID 88)*
```sql
SELECT id, title 
FROM "Lectures" 
WHERE course = 88;
```

### 3. Find Attachments for a Specific Lecture
*(Example for Lecture ID 651)*
```sql
SELECT a.id, a.name, a.kind, a.mime_type 
FROM "Attachments" a 
JOIN "Lecture_Attachments" la ON a.id = la.attachment 
WHERE la.lecture = 651;
```

### 4. Retrieve Attachment Content
*(Example for Attachment ID 1114)*
```sql
SELECT content 
FROM "Attachments" 
WHERE id = 1114;
```
