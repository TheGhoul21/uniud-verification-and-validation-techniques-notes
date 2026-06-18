# Source Map

This file records the current Supabase source inventory for the lecture-notes
book. It is intentionally a source map, not the final pedagogical order.

Current total: 40 lectures with attachments.

- Course 88: 12 lectures.
- Course 89: 28 lectures.

## Supabase Tables

- `Courses`: course-level buckets.
- `Lectures`: individual lessons.
- `Lecture_Attachments`: relation from lectures to attachments.
- `Attachments`: uploaded transcription/content files.

Primary retrieval pattern:

```sql
SELECT c.id AS course_id, l.id AS lecture_id, l.title,
       a.id AS attachment_id, a.name, a.mime_type, length(a.content) AS chars
FROM "Courses" c
JOIN "Lectures" l ON l.course = c.id
JOIN "Lecture_Attachments" la ON la.lecture = l.id
JOIN "Attachments" a ON a.id = la.attachment
WHERE c.id IN (88, 89)
ORDER BY c.id, l.id, a.id;
```

## Current Inventory

### Course 88 - Part I Source

Status: complete for the current plan, 12 lectures with one text/markdown
attachment each. The current Part I draft covers all 12 lectures and has been
deepened with the main technical points that were initially under-extracted:
small-model emptiness, reachability fixpoints, the double-tilde congruence
index bound, idempotent Ramsey decomposition, weak/full Muller games, LAR
memory, and action-based vs timeline-based planning.

| Lecture | DB lecture id | Attachment status | Notes |
| --- | ---: | --- | --- |
| L01 | 651 | present | finite-state automata, systems as states/transitions |
| L02 | 652 | present | DFA/NFA recap and transition functions |
| L03 | 653 | present | regular expressions/equivalence material |
| L04 | 654 | present | closure/decision material and transition toward omega-words |
| L05 | 655 | present | omega-word and Buchi material |
| L06 | 656 | present | automata constructions and later finite-state material |
| L07 | 657 | present | omega-regular/Buchi continuation |
| L08 | 658 | present | complementation/inclusion/emptiness material |
| L09 | 659 | present | practical/guest verification material |
| L10 | 660 | present | games for verification |
| L11 | 661 | present | games continuation |
| L12 | 662 | present | review/exam preparation |

### Course 89 - Part II Source

Status: complete for the current plan, 28 lectures with one text/markdown
attachment each.

| Lecture | DB lecture id | Attachment status | Notes |
| --- | ---: | --- | --- |
| L01 | 663 | present | second module intro, reactive systems, model checking |
| L02 | 664 | present | model checking recap, properties, counterexamples |
| L03 | 665 | present | SMV modules, variables, transition relation, environment inputs |
| L04 | 666 | present | S1S introduction and connection to automata |
| L05 | 667 | present | Büchi theorem: S1S and omega-regular languages |
| L06 | 668 | present | S1S decidability and extensions |
| L07 | 669 | present | S2S/trees intro, deterministic Muller/McNaughton direction |
| L08 | 670 | present | automata-theoretic model checking recap and McNaughton-style material |
| L09 | 671 | present | deterministic Muller automata and related omega-automata classes |
| L10 | 672 | present | star-free languages and first-order definability |
| L11 | 673 | present | finite trees and tree automata |
| L12 | 674 | present | infinite trees and transition toward temporal logics |
| L13 | 675 | present | LTL syntax/semantics and linear time |
| L14 | 676 | present | LTL next/until and derived temporal operators |
| L15 | 677 | present | LTL satisfiability setup |
| L16 | 678 | present | LTL tableau and fulfilling paths |
| L17 | 679 | present | LTL-to-Büchi translation, automata-theoretic model checking, LTL with past |
| L18 | 680 | present | LTL model checking problem and automata-theoretic algorithm |
| L19 | 681 | present | LTL model checking with fairness, justice, compassion, SCC search |
| L20 | 682 | present | CTL syntax/semantics and CTL* comparison |
| L21 | 683 | present | symbolic model checking and state-space explosion |
| L22 | 684 | present | bounded model checking via SAT and introduction to BDDs |
| L23 | 685 | present | OBDDs as compact Boolean-state-set representation |
| L24 | 686 | present | BDD-based CTL model checking, predicate transformers, fixpoints |
| L25 | 687 | present | learning automata / learning regular languages |
| L26 | 688 | present | Myhill-Nerode approximations, test sets, learning algorithm |
| L27 | 689 | present | Tamarin prover and security protocol modelling |
| L28 | 690 | present | Tamarin facts, terms, multiset rewriting, protocol examples |
