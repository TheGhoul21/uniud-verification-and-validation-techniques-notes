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
attachment each. The Part I draft has now been re-audited lecture by lecture
against the full transcripts. The current chapters cover all 12 lectures and
have been deepened with the main technical points that were initially
under-extracted: language concatenation and epsilon distinctions, epsilon-NFA
closure elimination, restricted/general/star-free regular expressions,
Myhill-Nerode quotient minimality, asynchronous Buchi intersection,
non-ultimately-periodic examples, transition-profile saturation,
ultimately-periodic fingerprints, railway interlocking verification, finite
strategy memory for Muller games, and weak/strong/strong-cyclic planning.

| Lecture | DB lecture id | Attachment status | Notes |
| --- | ---: | --- | --- |
| L01 | 651 | present | finite-state systems, words/languages, concatenation, Kleene star, DFA examples |
| L02 | 652 | present | NFA semantics, epsilon-closure, determinization, restricted/general/star-free regex |
| L03 | 653 | present | Kleene equivalence, closure constructions, decision reductions |
| L04 | 654 | present | omega-words, Buchi acceptance, closure, asynchronous intersection |
| L05 | 655 | present | omega-regular expressions, non-ultimately-periodic examples, congruence motivation |
| L06 | 656 | present | Büchi emptiness decidability; Myhill-Nerode, right-invariant equivalences, quotient/minimal DFA |
| L07 | 657 | present | transition profiles, accepting-path profiles, saturation, Ramsey setup |
| L08 | 658 | present | Buchi complementation, inclusion, ultimately-periodic fingerprint |
| L09 | 659 | present | railway interlocking case study, model-based verification, synthesis motivation |
| L10 | 660 | present | game arenas, strategies, winning regions, automata-to-game construction |
| L11 | 661 | present | weak/full Muller games, appearance records, LAR memory, parity reduction |
| L12 | 662 | present | planning as model checking, preimages, weak/strong/strong-cyclic plans |

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
