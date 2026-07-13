import re
import os

input_file = "/Users/lucasimonetti/Work/uniud-verification-and-validation-techniques-notes/.transcriptions/course_88/L05.md"
scratch_dir = "/Users/lucasimonetti/.gemini/antigravity-cli/brain/6a248da8-6466-4eac-9ecd-b90fcdd25483/scratch"
os.makedirs(scratch_dir, exist_ok=True)

with open(input_file, "r") as f:
    content = f.read()

# 1. Remove obvious loops (words repeating > 5 times)
def remove_word_loops(text):
    # Matches a sequence of the same word repeated many times
    pattern = re.compile(r'\b(\w+)(?:\s+\1\b){5,}', re.IGNORECASE)
    return pattern.sub(r'\1', text)

content = remove_word_loops(content)

# 2. Merge [...] overlaps
parts = re.split(r"\n\s*\[\.\.\.\]\s*\n", content)
merged_text = parts[0]
for i in range(1, len(parts)):
    prev_text = merged_text.strip()
    next_text = parts[i].strip()
    
    # Simple overlap detection (last N words of prev == first N words of next)
    prev_words = prev_text.split()
    next_words = next_text.split()
    
    overlap_found = False
    for overlap_len in range(min(50, len(prev_words), len(next_words)), 3, -1):
        if prev_words[-overlap_len:] == next_words[:overlap_len]:
            # Overlap found!
            next_text = " ".join(next_words[overlap_len:])
            overlap_found = True
            break
    
    # Even if exact overlap isn't found, often it's fuzzy. 
    # Let's do a fuzzy overlap by checking just the last 5 words anywhere in the first 50 words of next_text
    if not overlap_found:
        tail = " ".join(prev_words[-5:])
        head = " ".join(next_words[:50])
        idx = head.find(tail)
        if idx != -1:
            # Overlap found fuzzy!
            pass # We'll just leave it for the subagent to clean up, they are instructed to merge it.
            
    merged_text += "\n\n" + next_text

# 3. Handle large paragraph duplicates (the 'congruence' duplication the user mentioned)
# We will split into paragraphs and remove exact consecutive duplicate paragraphs
paragraphs = [p.strip() for p in merged_text.split("\n\n") if p.strip()]
dedup_paragraphs = []
for p in paragraphs:
    if not dedup_paragraphs or p != dedup_paragraphs[-1]:
        dedup_paragraphs.append(p)

merged_text = "\n\n".join(dedup_paragraphs)

# 4. Split into ~10 chunks of roughly equal word count
words = merged_text.split()
total_words = len(words)
chunk_size = total_words // 10

chunks = []
current_chunk = []
current_word_count = 0

for p in dedup_paragraphs:
    p_words = len(p.split())
    if current_word_count + p_words > chunk_size * 1.2 and len(chunks) < 9:
        chunks.append("\n\n".join(current_chunk))
        current_chunk = [p]
        current_word_count = p_words
    else:
        current_chunk.append(p)
        current_word_count += p_words

if current_chunk:
    chunks.append("\n\n".join(current_chunk))

# Write chunks to scratch files
for i, chunk in enumerate(chunks):
    chunk_path = os.path.join(scratch_dir, f"chunk_{i}.md")
    with open(chunk_path, "w") as f:
        f.write(chunk)
    print(f"Chunk {i}: {len(chunk.split())} words written to {chunk_path}")

print("Total chunks:", len(chunks))
