# Chapter 7 review report

## 1. Valutazione generale

Il capitolo 7 è stato verificato contro `STYLE-GUIDE.md`, le trascrizioni del
corso 89 (`L01.md`, `L02.md`, `L03.md`) e i PDF delle lezioni. La struttura
finale segue un percorso top-down: motivazione dei sistemi reattivi, ruolo dei
metodi formali, problema del model checking, modello matematico, linguaggio SMV,
uso dello strumento, modularità, composizione asincrona, fairness e breve
anticipazione delle logiche temporali.

- **Struttura:** coerente; non sono necessari ulteriori spostamenti di sezioni.
- **Correttezza:** le correzioni tecniche individuate sono state applicate. In
  particolare, il produttore aggiorna la seconda cella del buffer soltanto se
  la prima è già occupata e la seconda è vuota.
- **Completezza:** gli argomenti effettivamente trattati in L01--L03 sono
  presenti. È stata ripristinata anche l'osservazione della lezione sul costo
  della verifica del contatore meccanico a cinque cifre.
- **Qualità didattica:** esempi concreti precedono le definizioni principali;
  simboli e operatori sono nominati prima dell'uso; definizioni e figure sono
  seguite da una lettura operativa.
- **Qualità grafica:** tutte le 33 pagine fisiche del capitolo (120--152 del
  PDF, corrispondenti alle pagine stampate 119--151) sono state renderizzate e
  ispezionate. Non restano sovrapposizioni, elementi tagliati o `overfull` nel
  capitolo.

Materiali primari individuati:

- `chapters/07-reactive-systems-smv-model-checking.tex`;
- `.transcriptions/course_89/L01.md`;
- `.transcriptions/course_89/L02.md`;
- `.transcriptions/course_89/L03.md`;
- `Introduction to Model Checking (Lesson 1).pdf`;
- `The SMV language.pdf`;
- `main.tex`, `preamble.tex` e `main.pdf`;
- `mindmaps/generated/chapter-07.tex`, generato da
  `scripts/generate-mindmaps.mjs`.

La slide fisica 74/88 di `The SMV language.pdf` è stata usata per controllare
direttamente il caso producer--consumer. La sua logica è:

```smv
next(buffer[1]) := case
  buffer[0] = empty : buffer[1];
  buffer[1] = empty : {obj1, obj2, obj3};
  TRUE : buffer[1];
esac;
```

Nel libro gli oggetti sono rinominati coerentemente `o1`, `o2`, `o3`, senza
cambiare la semantica.

## 2. Struttura attuale e struttura proposta

### Indice attuale dopo la revisione

1. Why Reactive Systems?
2. Formal Methods in Context
3. The Model Checking Problem
4. Kripke Structures
5. The SMV Modelling Language
6. Simulation with NuXMV
7. Specifications and Diagnostic Counterexamples
8. Modules: Hierarchical Modelling
9. Asynchronous Composition
10. Fairness Constraints
11. LTL, CTL, and CTL*: an Overview
12. Notation Recap
13. Summary
14. Exercises

### Struttura proposta

La struttura proposta coincide con quella attuale: gli spostamenti utili sono
già stati applicati. In particolare:

| Sezione | Posizione precedente | Posizione applicata | Motivazione e raccordo |
| --- | --- | --- | --- |
| Why Reactive Systems? | Definizione prima degli esempi | Esempio di sistema operativo/controllo di volo prima della definizione | Rispetta la regola esempio-concreto-prima-della-definizione; aggiunta una lettura operativa dopo la definizione. |
| The Model Checking Problem | Definizione astratta in apertura | Arbiter e domanda di verifica prima della definizione | Rende immediatamente visibili modello, proprietà e risultato. |
| Kripke Structures | Tupla formale prima dell'istanza | Configurazione concreta dell'arbiter prima della tupla | Ogni componente formale viene verificato subito sul running example. |
| Specifications and Diagnostic Counterexamples | Trattazione autonoma estesa di safety/liveness | Breve vocabolario dopo simulazione, prima dei moduli | Conserva solo quanto serve a leggere esempi e output; il raccordo dichiara il rinvio ai capitoli successivi. |
| LTL, CTL, CTL* | Dettagli anticipati sparsi | Overview finale esplicitamente provvisoria | Non interrompe l'apprendimento di SMV e prepara i capitoli successivi. |

## 3. Problemi prioritari

### Errori tecnici corretti

- Guardia del secondo aggiornamento del produttore: la riga errata che
  combinava `buffer[0] != empty` e `buffer[1] = empty` con il mantenimento di
  `buffer[1]` è stata sostituita con i tre rami prioritari della slide 74/88.
- Significato di `M \models phi`: precisato che la formula deve valere dagli
  stati iniziali secondo la semantica della logica scelta; per LTL su tutte le
  esecuzioni iniziali, per CTL considerando la ramificazione.
- Semantica SMV: nominati esplicitamente valutazione corrente, valutazione
  successiva ed espressione prima della notazione denotazionale.
- Notation recap: `J` è ora correttamente un insieme di stati di giustizia;
  `Enabled` e `Taken` hanno notazione uniforme.
- Contatore meccanico: riportato correttamente che il controllo LTL a cinque
  cifre non termina durante la dimostrazione, mentre la variante a tre cifre è
  gestibile; non viene trasformato in un falso verdetto negativo.

### Problemi didattici corretti

- Definizioni principali precedute da esempi e seguite da una lettura
  operativa.
- Operator CTL e formule di fairness nominati prima dell'uso.
- Aggiunti riferimenti espliciti nel testo a tutte le figure.
- Distinte sintassi di modello, sintassi di proprietà e anticipazioni.
- Esercizio sul ring oscillator reso meccanicamente verificabile; la domanda
  aperta è marcata come estensione concettuale.

### Problemi strutturali corretti

- Rimossa la trattazione avanzata autonoma non richiesta da L01--L03
  (decomposizione safety/liveness, sviluppo algoritmico dei fair cycle e
  risultati assimilabili a teoremi). Sono rimaste solo brevi anticipazioni.
- Ridotte ripetizioni tra model checking, controesempi e qualità degli input.
- Uniformati i raccordi in avanti: non si usa più “recall” per concetti o figure
  non ancora comparsi.

### Problemi grafici corretti

- Eliminato l'`overfull` della parola “asynchronous” nella mappa generata.
- Allargata nel generatore la larghezza testuale dei nodi di mappe dense e
  introdotti punti di interruzione sicuri per trattini e slash.
- Resi blu i nodi iniziali dei grafi; il verde acqua resta riservato a
  target/accettazione, coerentemente con la guida.
- Evidenziate in violetto le etichette di input dell'ambiente nel diagramma
  `IVAR`.

### Contenuti non letteralmente verificabili nelle trascrizioni

- La breve spiegazione editoriale della forma a lasso dei controesempi LTL non
  usa terminologia presente letteralmente in L01--L03. È mantenuta come frase
  di raccordo, non attribuita al docente, e dichiara che la giustificazione
  arriverà nei capitoli successivi.

## 4. Revisione sezione per sezione

| Sezione | Esito | Problema | Fonte nelle trascrizioni | Modifica proposta/applicata | Priorità |
| --- | --- | --- | --- | --- | --- |
| Front matter + Why Reactive Systems? | corretto | L'esempio doveva precedere la definizione. | L01, introduzione ai sistemi reattivi e ai comportamenti infiniti | Esempio anticipato; aggiunto test operativo della definizione. | alta, risolta |
| Formal Methods in Context | corretto | Simbolo della proprietà e rinvii in avanti poco chiari. | L01, categorie dei metodi formali e confronto con testing | Nominata `P`; corretti i raccordi verso figure successive. | media, risolta |
| The Model Checking Problem | corretto | Definizione troppo astratta e semantica di soddisfacimento troppo compressa. | L01; L02:5, recap del problema e del controesempio | Arbiter prima della definizione; precisata la semantica iniziale/branching. | alta, risolta |
| Kripke Structures | corretto | Componenti formali usati prima dell'istanza concreta; operatori CTL non nominati. | L01:29--31 e L01:35--39 | Arbiter concreto prima della tupla; `A`, `G`, `X` introdotti come preview. | alta, risolta |
| SMV language -- syntax | corretto | Alcuni simboli e la priorità di `case` richiedevano una lettura esplicita. | L02:5--9 | Aggiunte letture operative e verifica sugli esempi. | media, risolta |
| SMV language -- semantics/extensions | corretto | Valutazioni non nominate; figure non sempre richiamate; colori iniziali ambigui. | L02, semantica di `ASSIGN`, `TRANS`, non-determinismo, `IVAR`, `DEFINE` | Nominati `v`, `e`, stati corrente/successivo; riferimenti e colori corretti. | alta, risolta |
| Simulation with NuXMV | corretto | Serviva un ponte esplicito tra modello e verifica. | L01:39--43; L03:13 | Inserito il flusso build/simulate/check e il raccordo alle specifiche. | media, risolta |
| Specifications and Diagnostic Counterexamples | anticipazione intenzionale | Rischio di anticipare teoria safety/liveness e controesempi LTL. | L01:23,39; L02:5,9; L03:17 | Trattazione ridotta e rinvio esplicito; mantenuti arbiter e qualità degli input. | media, risolta |
| Modules: Hierarchical Modelling | corretto | Mancava l'esito preciso della dimostrazione sul costo. | L03:5--17 | Esempio di flattening e contatore conservati; ripristinato esito 5 vs 3 cifre. | alta, risolta |
| Asynchronous Composition | corretto | Codice producer--consumer errato nel secondo `case`. | L03, parte producer--consumer; PDF SMV p. 74/88 | Ripristinati i rami prioritari corretti e spiegata la loro lettura. | bloccante, risolta |
| Fairness Constraints | corretto | Definizioni dense e distinzione modello/proprietà poco visibile. | L03, producer--consumer e fairness | Aggiunte letture operative, esempio producer-only, sintassi `JUSTICE`/`COMPASSION`. | alta, risolta |
| LTL, CTL, CTL*: Overview | anticipazione intenzionale | Il dettaglio non deve precedere i capitoli dedicati. | L01:31,35; L03:13--17 | Mantenuto un confronto minimo e dichiarato il rinvio. | bassa, corretta scelta editoriale |
| Notation Recap, Summary, Exercises | corretto | Notazione fairness e alcuni esercizi erano poco operativi. | Sintesi di L01--L03; ring oscillator in L02 come esercizio | Recap corretto; esercizi resi specifici; estensione concettuale marcata. | media, risolta |

Il framework della guida per teoremi e dimostrazioni non è applicabile: nel
capitolo non sono presenti ambienti `theorem`, `lemma` o `proof`.

## 5. Controllo di immagini e diagrammi

| Pagina/Figura | Problema grafico | Gravità | Causa | Correzione |
| --- | --- | --- | --- | --- |
| PDF fisica 120, mappa del capitolo | “asynchronous” eccedeva il nodo di meno di 1 pt | cosmetica | Larghezza testuale troppo stretta nelle mappe con oltre 32 nodi | Corretto `scripts/generate-mindmaps.mjs`, rigenerata la mappa e verificato il rendering. |
| Figure `arbiter-kripke`, `flipflop`, `flipflop-selfloop`, `mod4`, `arbiter-ivar`, `mech-counter-graph`, `computation-tree` | Il colore verde acqua poteva suggerire target/accettazione invece di stato iniziale | significativa | Convenzione cromatica non uniforme | Nodi iniziali resi blu; didascalie aggiornate dove necessario. |
| Figura `arbiter-ivar` | Input dell'ambiente poco distinguibili | cosmetica | Stesso peso visivo degli elementi controllati dal sistema | Etichette di input rese violette. |
| Tutte le tredici figure TikZ | Alcune non erano richiamate per nome nel testo vicino | significativa | Introduzione implicita della figura | Aggiunti riferimenti incrociati espliciti; ogni label compare almeno in un riferimento. |
| Figura `sync-vs-async` | La distinzione tra aggiornamento congiunto e scelta dello scheduler era affidata alla prosa | significativa | Mancava un confronto locale sullo stesso stato globale | Aggiunto diagramma affiancato: entrambe le coordinate contro un solo processo selezionato. |
| Figura `producer-consumer-buffer` | La priorità dei rami `case` era difficile da verificare soltanto dal codice | significativa | Mancava una rappresentazione operativa delle due celle | Aggiunto ciclo visuale dei quattro aggiornamenti rappresentativi, con producer arancione e consumer violetto. |
| Figura `fairness-schedules` | Enabled/taken e il limite della fairness restavano concetti astratti | significativa | La gerarchia temporale non mostrava l'effetto concreto dello scheduler | Aggiunte tre timeline: percorso ingiusto, percorso fair che svuota e percorso fair che non svuota. |
| PDF fisiche 120--152 | Nessun problema residuo di sovrapposizione, taglio, floating o leggibilità | nessuna | -- | Tutte le pagine ispezionate a 144 dpi; le tre nuove figure sono state ricontrollate a risoluzione piena. |

Il log del capitolo non contiene `overfull`, riferimenti indefiniti o label
duplicate. Restano tre `underfull` cosmetici: uno nella tabella sui metodi
formali e due nella tabella di confronto tra forme di `ASSIGN`.

## 6. Modifiche applicate

File modificati:

- `chapters/07-reactive-systems-smv-model-checking.tex`;
- `SOURCE_MAP.md`;
- `scripts/generate-mindmaps.mjs`;
- `mindmaps/generated/chapter-07.tex` (rigenerato);
- `main.pdf` (ricompilato).

Interventi principali:

- riordinati localmente esempi e definizioni senza cambiare la progressione
  tematica generale;
- riscritti raccordi, letture operative e spiegazioni della notazione;
- corretto il producer--consumer e precisate semantica del model checking e
  fairness;
- condensati contenuti avanzati non sostenuti da L01--L03;
- ripristinata l'osservazione sul limite di risorse del contatore;
- corretti colori, riferimenti e dimensionamento della mappa generata.

La differenza rispetto a `HEAD` è di 972 righe aggiunte e 1035 rimosse nel
complesso dei file considerati; il solo capitolo ha 886 righe aggiunte e 963
rimosse. La riduzione netta deriva
soprattutto dalla sostituzione di materiale avanzato e ripetitivo con raccordi
brevi, non dalla rimozione degli esempi delle tre lezioni. Il capitolo finale
occupa 33 pagine fisiche.

Validazione eseguita:

```text
node scripts/generate-mindmaps.mjs
latexmk -pdf -interaction=nonstopmode main.tex
```

Esito: build riuscita, `main.pdf` di 302 pagine, riferimenti del capitolo
risolti e controllo visivo completo.

## 7. Elementi volutamente lasciati brevi

- semantica completa di LTL, CTL e CTL*;
- algoritmi automata-theoretic per il model checking e costruzione dei lassi;
- symbolic model checking, BDD e bounded model checking;
- teoria formale di safety e liveness;
- sintesi e rapporto completo tra verifica e sintesi;
- ring oscillator, mantenuto come esercizio come nelle slide;
- algoritmi completi di fairness.

Questi argomenti sono soltanto introdotti e saranno approfonditi nei capitoli
successivi.

## 8. Questioni ancora dubbie

1. La frase editoriale sulla forma a lasso dei controesempi LTL non è
   letteralmente rintracciabile in L01--L03. È tecnicamente corretta e serve da
   raccordo, ma può essere rimossa se si desidera una politica di aderenza
   esclusivamente letterale alle tre lezioni.
2. `.claude/workflows/style-guide-audit-ch7.js` usa intervalli di riga fissi.
   Sono stati sincronizzati con le intestazioni attuali e coprono senza buchi
   le righe 1--2344; dovranno essere aggiornati di nuovo dopo futuri
   spostamenti strutturali nel capitolo.
