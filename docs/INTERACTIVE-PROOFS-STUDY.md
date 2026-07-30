# Studio: dimostrazioni interattive nei notebook

- Stato: prima tranche implementata per i nove teoremi dei Capitoli 1--4
- Data: 30 luglio 2026

## Aggiornamento sull'implementazione

La prima tranche di Proof Lab è ora disponibile sotto `proofs/`. Un runtime
condiviso presenta una visualizzazione dominante, una sequenza di passaggi
interattivi, prosa tecnica che ne esplicita il ruolo logico, giustificazioni
formali composte con MathJax e una sintesi completa della prova. Il PDF collega
direttamente ciascuno dei nove teoremi dei Capitoli 1--4 alla rispettiva pagina.
Le scelte progettuali e i criteri esposti di seguito restano il fondamento
dell'implementazione.

## Sintesi esecutiva

La proposta preferita è **ProofLab**, un formato comune per trasformare alcune
dimostrazioni del libro in spiegazioni esplorabili, senza sostituire la prova
formale e senza ridurla a una sequenza di animazioni.

Ogni ProofLab mostra la stessa dimostrazione attraverso tre lenti sincronizzate:

1. **mappa della prova**: obiettivo, dipendenze, casi e obblighi ancora aperti;
2. **argomento formale**: il passaggio matematico corrente e la sua
   giustificazione;
3. **esempio vivo**: lo stesso passaggio eseguito su un automa, una parola, un
   gioco, un prodotto o una sequenza di approssimanti.

La caratteristica decisiva non è il pulsante “avanti”. Prima di rivelare un
passaggio, lo studente deve poter prevedere una conseguenza, scegliere una
costruzione, giocare una mossa avversaria, proporre un insieme successivo o
alterare un’ipotesi. L’interfaccia risponde mostrando **perché** la scelta è
valida o quale controesempio la confuta. L’interazione modifica quindi un
oggetto matematico rilevante e rende visibile un nesso logico reale.

La raccomandazione è netta:

- mantenere il PDF e i capitoli LaTeX come fonte autorevole della prova;
- usare i notebook come “microscopi semantici” della prova, non come
  theorem prover general-purpose;
- iniziare con due vertical slice molto diverse:
  **correttezza della subset construction** (Capitolo 1) e
  **correttezza dell’attrattore** (Capitolo 5);
- costruire un solo runtime condiviso HTML/CSS/JavaScript, con dati
  dichiarativi e piccoli modelli matematici puri;
- usare HTML semantico e SVG; D3 solo quando serve per layout, zoom o
  collegamenti, mai come contenitore della logica;
- non usare Mermaid;
- evitare autoplay, premi, quiz di memoria e animazioni che non corrispondono a
  un passaggio dell’argomento.

Questa scelta è coerente con il framework `Proof-as-Story-Arc` già presente:
`catalyst`, `proofmap`, `walkthrough`, `counterpoint` e `takeaway` diventano
regioni interattive dello stesso racconto. È anche coerente con i notebook
esistenti, che già usano esempi guidati, SVG e avanzamento per passi, ma supera
la loro duplicazione e rende espliciti invarianti, giustificazioni e failure
cases.

## 1. Che cosa significa “dimostrazione interattiva”

In questo studio il termine non indica:

- un *interactive proof system* nel senso della teoria della complessità;
- un’animazione che illustra solo l’enunciato;
- un quiz a scelta multipla collocato dopo la prova;
- un proof assistant completo come Lean o Rocq;
- una visualizzazione che convince su un singolo esempio ma non rende visibile
  il passaggio dal caso concreto all’argomento generale.

Indica invece una **presentazione interattiva di una prova matematica del
corso**, nella quale:

- lo stato visibile corrisponde a oggetti citati nella prova;
- ogni transizione di stato ha una giustificazione matematica nominata;
- esempio e formula evolvono insieme;
- le dipendenze tra passi restano ispezionabili;
- lo studente può esplorare casi che confermano e casi che rompono l’argomento;
- la versione statica rimane completa e leggibile.

La prova formale stabilisce la validità generale. L’esempio interattivo rende
visibili il meccanismo, l’invariante, le scelte e i punti in cui le ipotesi sono
usate. L’interfaccia deve ripetere esplicitamente questa distinzione:
**“l’esempio spiega il passo; la giustificazione formale lo prova per tutti i
casi”**.

## 2. Audit del repository

### 2.1 Linea editoriale già favorevole

`STYLE-GUIDE.md` contiene quasi tutte le premesse pedagogiche necessarie:

- esempio concreto prima della definizione;
- intuizione operativa dopo il blocco formale;
- costruzione prima dell’invariante che ne dimostra la correttezza;
- inizializzazione, preservazione e terminazione per gli algoritmi;
- esempi ricorrenti trattati come parte della prova;
- failure cases quando spiegano la necessità di un’ipotesi;
- walkthrough che affiancano argomento formale ed esempio.

Il framework LaTeX in `preamble.tex` realizza già un arco narrativo:

- `catalyst`: perché serve il risultato;
- `proofmap`: dipendenze di una prova articolata;
- `walkthrough` e `\wtstep`: passo formale più esempio;
- `counterpoint`: che cosa si rompe;
- `takeaway`: significato operativo.

`custom.scss` contiene le controparti web `.catalyst`, `.proofmap`,
`.walkthrough`, `.wt-step`, `.counterpoint` e `.takeaway`, con la palette
teal/orange/violet coerente con il libro. ProofLab non deve inventare una
seconda grammatica visiva: deve rendere interattiva questa grammatica.

### 2.2 Stato dei notebook

Sono stati esaminati in dettaglio i notebook:

- `02-nfa-reachable-states.qmd`;
- `03-subset-construction.qmd`;
- `06-reachability-fixpoint.qmd`;
- `09-ltl.qmd`;
- `10-model-checking.qmd`;
- `13-vectorial-closure.qmd`;
- `14-buchi-emptiness-lasso.qmd`.

Sono stati inoltre controllati struttura e pattern ricorrenti degli altri
notebook.

I punti forti da preservare sono:

- esempi piccoli e legati al materiale del corso;
- avanzamento controllato dallo studente;
- tracce, insiemi attivi e grafi mostrati contemporaneamente;
- colori coerenti con il PDF;
- SVG leggibili e responsive;
- sezioni finali “What To Notice” che estraggono il significato.

I limiti che ProofLab dovrebbe risolvere sono:

1. **La maggior parte dei widget simula costruzioni, non una prova.** Mostra
   correttamente cosa fa l’algoritmo, ma non sempre rende visibile quale
   invariante collega la simulazione all’enunciato generale.
2. **Il tasto Step spesso rivela una storia già codificata.** Lo studente non
   deve formulare una previsione né scegliere tra mosse matematicamente
   significative.
3. **Stili e controlli sono duplicati.** Classi come `.sc-lab`, `.sc-btn` e
   `.sc-panel` sono ridefinite in molti `.qmd`; dati, UI e logica sono spesso
   nello stesso script inline.
4. **Il legame con il testo formale è manuale e implicito.** Non esiste un ID
   condiviso per passo, lemma, esempio e stato visuale.
5. **Accessibilità non uniforme.** Molti SVG hanno `role="img"` e alcuni
   pannelli usano regioni live, ma non c’è ancora un contratto comune per
   navigazione da tastiera, annunci di stato, focus, testo alternativo e
   `prefers-reduced-motion`.
6. **I notebook 9 e 10 sono ancora pagine ponte.** LTL e model checking sono
   quindi aree ideali per nuovi laboratori progettati direttamente col formato
   ProofLab.

### 2.3 Vincoli tecnici osservati

- Quarto rende file `.qmd` statici in `_site/`.
- I notebook correnti usano HTML, CSS e JavaScript inline, senza framework
  client.
- Il sito usa Cabin e la palette del libro in `custom.scss`.
- Le mind map hanno già introdotto D3/SVG e componenti condivisi.
- Non esiste una test suite applicativa; oggi `quarto render` è il gate
  principale.
- Il PDF deve continuare a funzionare senza JavaScript e non deve dipendere dal
  sito per la completezza matematica.

Questi vincoli favoriscono Web Components leggeri o moduli ES standard, non
un’applicazione React separata e non un servizio server.

## 3. Evidenze e riferimenti progettuali

### 3.1 Spiegazione esplorabile, non sandbox

Nell’originale
[Explorable Explanations](https://worrydream.com/ExplorableExplanations/),
Bret Victor distingue un modello esplorabile integrato nell’argomento da un
widget isolato che lascia il lettore a “capire da solo”. Il principio rilevante
qui è che l’autore deve mantenere una regia: il testo funziona staticamente, lo
studente può poi alterare esempi e assunzioni per interrogare l’argomento.

Applicazione a ProofLab:

- partire sempre da un esempio guidato;
- rendere modificabili proprio gli oggetti usati dall’argomento;
- aggiornare testo, formula e figura insieme;
- permettere lettura lineare e approfondimento libero;
- non aprire un “sandbox” vuoto come prima esperienza.

### 3.2 Diagrammi come organizzazione dell’informazione

Larkin e Simon mostrano che una rappresentazione diagrammatica può essere più
efficiente di una sentenziale quando raggruppa informazioni correlate e rende
percettivamente economiche le inferenze rilevanti
([articolo e DOI](https://doi.org/10.1111/j.1551-6708.1987.tb00863.x)).
Non segue che qualsiasi diagramma aiuti. La figura deve collocare vicini gli
elementi che il passo logico mette in relazione.

Applicazione:

- evidenziare insieme premessa, oggetto trasformato e conseguenza;
- usare la posizione per codificare struttura stabile, non per decorazione;
- evitare che lo stesso stato “salti” arbitrariamente tra un passo e l’altro;
- non affidare significato solo al colore.

### 3.3 Attività costruttiva e previsione

Il framework ICAP distingue coinvolgimento passivo, attivo, costruttivo e
interattivo e prevede risultati migliori quando lo studente produce inferenze o
costruzioni, non quando manipola soltanto l’interfaccia
([Chi e Wylie, 2014](https://doi.org/10.1080/00461520.2014.965823)).

Per questo un buon ProofLab usa azioni come:

- predire l’insieme successivo;
- scegliere una mossa che diminuisce un rango;
- classificare un cammino rispetto al caso induttivo;
- costruire un testimone;
- spiegare quale ipotesi giustifica una conclusione;
- proporre un controesempio quando una condizione è rimossa.

Trascinare un nodo senza produrre una conseguenza matematica non è sufficiente.

### 3.4 Comprendere una prova è multidimensionale

Il modello di Mejía-Ramos et al. distingue comprensione locale e olistica:
significato degli enunciati, stato logico, giustificazione dei passaggi, idea
globale, struttura modulare, trasferimento e relazione con esempi
([paper originale](https://doi.org/10.1007/s10649-011-9349-7);
[copia degli autori](https://sites.math.rutgers.edu/~jpmejia/files/Mejia%20et%20al%20%282012%29.pdf)).

ProofLab dovrebbe progettare e misurare tutte queste dimensioni:

| Dimensione | Meccanismo nell’interfaccia |
|---|---|
| Significato | tooltip contestuali, tipi degli oggetti, lettura operativa |
| Stato logico | badge “ipotesi”, “invariante”, “caso”, “conclusione” |
| Giustificazione | arco esplicito dal passo usato alla nuova conseguenza |
| Idea globale | proof map sempre disponibile |
| Moduli | gruppi nominati e comprimibili |
| Trasferimento | esempio nuovo in modalità libera |
| Esempi | sincronizzazione formula-grafo-traccia |

### 3.5 Il rischio dell’animazione troppo assistita

Uno studio controllato sugli e-Proofs ha trovato risultati immediati simili ma
peggiore ritenzione per la versione multimediale; l’eye tracking suggeriva
minore elaborazione autonoma quando il supporto guidava troppo l’attenzione
([Roy, Inglis e Alcock, 2017](https://doi.org/10.1007/s10649-017-9754-7)).
È un avvertimento direttamente pertinente: rendere una prova più fluida e
gradevole non garantisce apprendimento profondo.

Contromisure obbligatorie:

- niente autoplay;
- checkpoint “predici prima di rivelare”;
- pulsante “non lo so / mostrami un indizio” senza penalità;
- fading: gli aiuti diminuiscono nei casi successivi;
- esempio di trasferimento non identico a quello guidato;
- test differito, non solo soddisfazione o tempo sulla pagina.

### 3.6 Cosa prendere dai proof assistant

Gli strumenti di interactive theorem proving offrono idee UI utili:

- Lean associa widget interattivi a una posizione del documento e al relativo
  stato semantico
  ([manuale ufficiale dei widget Lean](https://lean-lang.org/examples/1900-1-1-widgets/));
- Paperproof rende visibile come cambiano ipotesi e obiettivi lungo una prova
  ([documentazione del progetto](https://reservoir.lean-lang.org/%40Paper-Proof/paperproof));
- Proviola rappresenta una sessione come “film” di frame riproducibili, con
  input e risposta del prover
  ([Tankink et al., 2010](https://arxiv.org/abs/1005.2672));
- l’Incredible Proof Machine rappresenta prove come port graph e la sua
  metateoria è stata formalizzata in Isabelle
  ([Archive of Formal Proofs](https://www.isa-afp.org/entries/Incredible_Proof_Machine.html)).

Queste fonti suggeriscono proof state, history e dipendenze esplicite. Non
implicano che questo corso debba incorporare Lean. Uno studio recente
sull’uso didattico di Coq e Lean rileva benefici ma anche ostacoli dovuti a
sintassi, messaggi d’errore e maggiore verbosità delle formalizzazioni
([Mahinpei, Horta Ribeiro e Milano, SPLASH-E 2025](https://doi.org/10.1145/3758317.3759679)).

La raccomandazione è quindi:

- **MVP senza proof assistant**;
- modello matematico controllato e testato nel browser;
- eventuale fase futura “formal audit” con frammenti Lean separati;
- nessuna dicitura “machine checked” finché non esiste davvero una
  formalizzazione collegata.

### 3.7 Tecnologia e accessibilità

Quarto supporta nativamente Observable JS e il suo runtime reattivo
([documentazione ufficiale](https://quarto.org/docs/interactive/ojs/)).
È una buona opzione per prototipi isolati, ma il repository usa già moduli
JavaScript e markup esplicito. Per componenti condivisi e testabili, un runtime
ES module dedicato è più coerente e rende più semplice mantenere fallback
statici.

D3 è un toolkit a basso livello costruito sugli standard web, adatto a grafici
dinamici e data-driven
([documentazione ufficiale](https://d3js.org/what-is-d3)). Questo controllo è
utile per grafi e zoom, ma la logica della prova non deve vivere dentro callback
D3.

L’accessibilità deve puntare almeno a WCAG 2.2 AA; le linee guida si applicano
anche a contenuto dinamico e mobile
([W3C WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/)).

## 4. Principi non negoziabili

1. **Ogni gesto ha semantica.** Un click seleziona una premessa, applica una
   regola, sceglie una mossa o interroga un oggetto; non avvia una decorazione.
2. **Ogni passaggio risponde a “perché?”.** L’interfaccia mostra il warrant:
   definizione, ipotesi, lemma, caso induttivo o proprietà del costrutto.
3. **Esempio e generale sono simultanei.** Non prima tutta l’animazione e poi
   tutta la prova.
4. **L’invariante è persistente.** Rimane visibile e cambia stato da “da
   stabilire” a “verificato in questo passo”, senza scomparire.
5. **Il fallimento è causale.** Una scelta errata produce il più piccolo
   testimone o la fuga che la confuta.
6. **La prova resta leggibile senza interazione.** JavaScript migliora, non
   crea, il contenuto fondamentale.
7. **Guidato prima, libero dopo.** L’esempio iniziale ha regia; il trasferimento
   richiede autonomia.
8. **Niente falsa certificazione.** Una simulazione esaustiva su un’istanza non
   viene presentata come dimostrazione generale.
9. **Movimento misurato.** Transizioni brevi aiutano la continuità spaziale;
   nessun autoplay e rispetto di `prefers-reduced-motion`.
10. **Stesso linguaggio del libro.** Terminologia, simboli, esempi e colori
    seguono capitolo e `STYLE-GUIDE.md`.

## 5. Tassonomia dei pattern interattivi

### 5.1 Proof-state synchronizer

**Per:** invarianti, simulazioni di automi, equivalenze di costruzioni.

Mostra affiancati due oggetti che la prova dichiara equivalenti. A ogni simbolo
o trasformazione, lo studente predice entrambi gli stati; una fascia centrale
visualizza l’invariante di corrispondenza.

Esempio:

\[
\widehat{\delta}_D(\{q_0\},w)
=
\widehat{\Delta}(q_0,w).
\]

Il pattern è corretto solo se rende visibili base, preservazione e uso finale
dell’invariante, non soltanto due simulazioni parallele.

### 5.2 Construction bench

**Per:** subset construction, Thompson, prodotti, complementi, traduzioni
logica-automa.

Lo studente compone l’oggetto destinazione scegliendo blocchi ammessi. Ogni
pezzo espone:

- precondizioni;
- proprietà semantica preservata;
- nuovi obblighi;
- collegamento al costrutto formale.

Una costruzione sbagliata deve produrre una parola o traccia che separa origine
e destinazione.

### 5.3 Induction frontier

**Per:** induzione su parole, struttura o indice \(k\).

Uno scrubber controlla la frontiera induttiva. Sono visibili:

- oggetti già disponibili per ipotesi induttiva;
- nuovo caso da giustificare;
- decomposizione che riduce il nuovo caso ai precedenti;
- misura che decresce o indice che avanza.

Il gesto centrale è classificare/decomporre, non premere “next”.

### 5.4 Witness extractor

**Per:** esistenza, non-vuotezza, controesempi, small-model property.

Lo studente costruisce un testimone finito dal dato strutturale della prova:
parola, cammino, lasso, stato distinguente. Il pannello formale mostra in quale
direzione dell’“se e solo se” ci troviamo.

Il failure case deve distinguere:

- testimone inesistente;
- candidato che non soddisfa una condizione;
- condizione necessaria ma non sufficiente.

### 5.5 Adversarial proof game

**Per:** giochi, strategie, quantificatori alternati, universalità.

Lo studente controlla il sistema; l’interfaccia può scegliere la peggiore mossa
dell’ambiente. Il rango, l’insieme vincente e l’obbligo corrente restano
visibili.

Questo pattern rende operativa la differenza tra:

- “esiste un successore buono”;
- “tutti i successori sono buoni”.

L’ambiente non è un’animazione casuale: è un costruttore di controstrategie.

### 5.6 Fixpoint wavefront

**Per:** reachability, attrattori, CTL, planning, SCC.

Visualizza la sequenza
\[
Z_0,\ Z_1,\ \ldots,\ Z_k=Z_{k+1}
\]
come ondate di giustificazioni. Cliccando uno stato si vede:

- quando è entrato o uscito;
- quale predecessore lo giustifica;
- se la condizione è esistenziale o universale;
- la prova locale che il passo è monotono.

La stabilizzazione non è solo un’animazione: deve mostrare l’uguaglianza che
certifica il fixed point e il motivo della terminazione sul reticolo finito.

### 5.7 Reduction pipeline

**Per:** inclusione/equivalenza, LTL model checking, decidibilità.

Mostra una domanda trasformata in un’altra tramite tappe tipate. Ogni arco
espone un’equivalenza logica e permette di proiettare un testimone all’indietro.

Esempio:

\[
\mathcal M\models\varphi
\iff
L(\mathcal M)\cap L(\mathcal A_{\neg\varphi})=\varnothing.
\]

Se il prodotto contiene un lasso, lo studente deve poterlo proiettare nella
traccia del sistema e verificare dove viola \(\varphi\).

### 5.8 Hypothesis surgery

**Per:** controesempi e ruolo delle ipotesi.

Lo studente disattiva una condizione dell’enunciato. La proof map evidenzia i
passi che la usano e il modello cerca un controesempio minimo. Non basta dire
“la prova non funziona”: si deve mostrare se è falso il teorema o soltanto
inapplicabile quell’argomento.

### 5.9 Proof dependency map

**Per:** qualsiasi prova multi-modulo.

È un DAG, non una mind map e non Mermaid. I nodi rappresentano obiettivi,
lemmi, casi o costruzioni; gli archi significano “usa”. Deve consentire:

- overview;
- focus sul ramo corrente;
- elenco testuale equivalente;
- salto a un passo senza perdere il contesto;
- distinzione tra dipendenza logica e ordine espositivo.

### 5.10 Predict-explain-transfer

È il guscio pedagogico comune a tutti i pattern:

1. **Predict:** lo studente produce una conseguenza.
2. **Explain:** l’interfaccia confronta e mostra la giustificazione.
3. **Transfer:** un esempio vicino ma non identico richiede la stessa idea con
   meno aiuto.

Questo evita che ProofLab sia un film controllato con il mouse.

## 6. Concept UX comune: ProofLab

### 6.1 Anatomia

```text
┌──────────────────────────────────────────────────────────────────────┐
│ THEOREM · Subset construction       Guided ○── Free   Example: aba  │
│ Goal: prove L(D) = L(A)             Step 2 of 4 · Inductive step    │
├──────────────────────────────────────────────────────────────────────┤
│ PROOF MAP  [Setup]──[Base]──[Preservation]──[Acceptance]             │
│                              ▲ current                               │
├───────────────────────────────────────┬──────────────────────────────┤
│ EXAMPLE LENS                          │ FORMAL LENS                  │
│ NFA branches + DFA subset             │ Goal: I(wa)                 │
│ word: a [b] a                         │ Given: I(w), state S         │
│ active NFA = {q0,qa}                  │ Rule: definition of δ_D      │
│ DFA state  = {q0,qa}                  │ Conclusion: union Δ(q,b)     │
├───────────────────────────────────────┴──────────────────────────────┤
│ INVARIANT: DFA state = set of reachable NFA states          ✓ so far│
│ Predict the next subset: [ {q0} ] [ {qa} ] [type it] [I need a hint]│
└──────────────────────────────────────────────────────────────────────┘
```

### 6.2 Proof map e timeline

Sono due rappresentazioni diverse:

- la **proof map** mostra dipendenze e struttura globale;
- la **timeline** mostra l’ordine didattico seguito nell’esempio corrente.

Una prova per casi può avere rami paralleli nella mappa ma presentarli in
sequenza nella timeline. Confondere le due strutture nasconderebbe la logica.

Ogni passo ha:

- nome verbale breve;
- obiettivo;
- oggetti noti;
- regola/warrant;
- esempio;
- stato degli obblighi;
- eventuale ipotesi usata.

### 6.3 Pannello formale ed esempio

Su desktop sono simultanei. Passando il focus su un simbolo, si evidenziano le
sue occorrenze nelle due viste:

- \(S\) nella formula;
- il gruppo di nodi dell’automa;
- la cella della trace table.

La vista formale non è un dump di LaTeX: mostra una riga principale, la
giustificazione e un’espansione “Formal details”. Il testo completo della prova
resta immediatamente raggiungibile nel capitolo/PDF.

### 6.4 Modalità Guided e Free

**Guided**

- esempio canonico del capitolo;
- passaggi ordinati;
- previsione prima del reveal;
- hint progressivi;
- spiegazione causale dell’errore;
- aiuti che si riducono nel secondo esempio.

**Free**

- selezione o modifica dell’istanza entro limiti espliciti;
- salto tra passi;
- confronto di due scelte;
- attivazione/disattivazione di ipotesi;
- ispezione di testimoni e controesempi;
- nessun blocco artificiale della navigazione.

Guided è il percorso consigliato, non una gabbia. Deve sempre esistere “Show
me” per chi usa tecnologie assistive o vuole consultare rapidamente.

### 6.5 Progressive disclosure

Ordine predefinito:

1. domanda concreta;
2. esempio piccolo;
3. pattern osservato;
4. invariante/lemma;
5. passaggio formale;
6. failure case;
7. trasferimento.

Dettagli tecnici, algebra estesa e lemmi già noti sono comprimibili, ma:

- l’obiettivo corrente non si comprime;
- la giustificazione del passo non è nascosta per default dopo il reveal;
- una dipendenza compressa resta nominata.

### 6.6 Microcopy

Il sito è in inglese, quindi i componenti di produzione dovrebbero usare
microcopy inglese coerente con i notebook:

- `What are we proving?`
- `What do we know?`
- `Predict the next state`
- `Why is this step valid?`
- `Show one hint`
- `Try a counterexample`
- `Formal argument`
- `Running example`
- `Transfer case`

Evitare `Correct!` isolato. Preferire:

> Valid because every environment successor already has lower rank.

oppure:

> This choice is insufficient: the environment can escape through \(e_2\).

### 6.7 Accessibilità

Contratto minimo:

- tutti i controlli raggiungibili e azionabili da tastiera;
- focus visibile e ordine coerente;
- SVG con titolo/descrizione e alternativa testuale strutturata;
- nodi interattivi duplicati in una lista o tabella HTML;
- aggiornamenti importanti in una regione `aria-live="polite"`;
- nessuna informazione affidata solo al colore;
- simboli, pattern di bordo e testo per stato corrente/valido/errore;
- pulsanti di almeno 44 × 44 CSS px;
- zoom del browser al 200% senza perdita;
- `prefers-reduced-motion`;
- nessun limite temporale;
- annunci che non leggano nuovamente l’intera prova a ogni click.

### 6.8 Mobile

A 360–430 px:

1. header e progresso;
2. proof map come lista orizzontale scorrevole più outline testuale;
3. esempio;
4. invariante;
5. argomento formale;
6. checkpoint.

Le viste Formal/Example possono diventare sezioni espandibili, ma non tab
mutuamente esclusive che facciano perdere il confronto. Il focus su un elemento
deve scorrere anche la sua controparte in vista.

### 6.9 Fallback statico e PDF

Il markup iniziale contiene sempre:

- enunciato;
- proof map testuale;
- elenco completo dei passi;
- esempio guidato in 3–5 snapshot;
- invariant box;
- counterpoint;
- takeaway;
- collegamento al punto esatto del PDF.

JavaScript trasforma questo markup nella versione sincronizzata. Con JS
disabilitato, nessun contenuto matematico essenziale sparisce.

In stampa:

- controlli nascosti;
- tutti i passi espansi;
- snapshot chiave, non ogni frame;
- URL breve del ProofLab;
- richiamo al numero/label del risultato nel libro.

Il PDF non deve incorporare una copia enorme del laboratorio: conserva la prova
story-arc e può aggiungere una proof map più 2–3 frame scelti.

## 7. Sei piloti reali

### Pilota 1 — Subset construction correctness

**Fonte:** Capitolo 1, `thm:subset-construction`; estensione naturale di
`notebooks/03-subset-construction.qmd`.

**Obiettivo didattico.** Capire che un DFA state non “somiglia” a un insieme di
run: è esattamente l’insieme degli stati NFA raggiungibili dopo lo stesso
prefisso, e questa uguaglianza è l’invariante che prova l’equivalenza dei
linguaggi.

**Modello mentale.** Molte run NFA vengono impacchettate in un solo stato
deterministico; l’informazione non viene scelta né persa, viene unita.

**Interazioni.**

- inserire una parola oppure usare `aba`;
- prima di ogni simbolo, costruire il prossimo subset selezionando i target;
- cliccare una run NFA e vedere il suo contributo all’unione;
- confrontare regola esistenziale corretta
  \(S\cap F\neq\varnothing\) con l’errata “tutti finali”;
- passare da base a preservazione e infine all’accettazione.

**Stato visualizzato.**

- prefisso \(w\) e simbolo successivo \(a\);
- insieme delle run NFA vive;
- stato subset del DFA;
- equazione dell’invariante;
- archi usati e rami morti;
- obligation `base / preservation / acceptance`.

**Esempio guidato.** NFA “last symbol is \(a\)”, parola `aba`, già usati nel
capitolo. Il secondo caso usa `a`: mostra immediatamente che
\(\{q_s,q_a\}\) deve essere finale anche se \(q_s\notin F\).

**Errori/failure cases.**

- scegliere un solo target: una run accettante scompare;
- usare intersezione invece di unione: controesempio minimo;
- dichiarare finale solo un subset contenuto in \(F\): `a` separa NFA e DFA;
- credere che tutti i \(2^{|Q|}\) subset siano raggiungibili.

**Collegamento alla prova formale.** Ogni passo evidenzia la corrispondente
parte del walkthrough: base \(w=\varepsilon\), ipotesi per \(w\), calcolo su
\(wa\), uso di \(F_D\).

**Valore oltre la lettura statica.** La prova per induzione non resta una
formula plausibile: lo studente vede e costruisce l’uguaglianza di tipi a ogni
prefisso, poi la usa per trasferire l’accettazione.

### Pilota 2 — La frontiera induttiva di Kleene

**Fonte:** Capitolo 2, `thm:kleene`, direzione automa → espressione;
evoluzione di `notebooks/07-kleene-state-elimination.qmd`.

**Obiettivo didattico.** Comprendere il significato degli indici
\(R_{i,j}^k\) e perché l’introduzione di \(q_k\) forza esattamente:

\[
R_{i,j}^k =
R_{i,j}^{k-1}
+
R_{i,k}^{k-1}(R_{k,k}^{k-1})^*R_{k,j}^{k-1}.
\]

**Modello mentale.** \(k\) è una frontiera che sblocca possibili stati
intermedi. Ogni cammino o evita il nuovo stato oppure lo visita, si spezza
nella prima entrata, nei ritorni completi e nell’ultima uscita.

**Interazioni.**

- scrubber \(k=0,\ldots,n\);
- selezionare un cammino e marcare i suoi stati intermedi;
- classificare il cammino come `avoid q_k` o `visit q_k`;
- se visita \(q_k\), scegliere i punti di taglio;
- vedere i frammenti trasformarsi nei quattro fattori della recurrence;
- provare una diversa numerazione degli stati e osservare espressioni diverse
  ma linguaggio invariato.

**Stato visualizzato.**

- grafo originale stabile;
- stati intermedi permessi/vietati;
- cella \(R_{i,j}^k\) nella tabella dinamica;
- espressione prima/dopo semplificazione;
- ipotesi induttive disponibili;
- decomposizione del cammino selezionato.

**Esempio guidato.** DFA di parità a due stati del capitolo:
\(R_{2,2}^1=(\varepsilon+b)+a(\varepsilon+b)^*a\).

**Errori/failure cases.**

- confondere endpoint e stato intermedio (`a` è in \(R_{1,2}^0\));
- omettere \(\varepsilon\) quando \(i=j\);
- usare `+` al posto dello star per più ritorni;
- tagliare a una visita non prima/ultima e perdere l’unicità della
  decomposizione;
- credere che l’espressione ottenuta sia sintatticamente unica.

**Collegamento formale.** Base \(k=0\), dicotomia del caso induttivo, closure
delle regex e unione finale sugli stati accettanti sono nodi separati della
proof map.

**Valore oltre la lettura statica.** Rende percettivo il ruolo di ogni indice e
fa emergere lo star da cammini concreti, invece di presentare la recurrence
come formula da memorizzare.

### Pilota 3 — Büchi emptiness e lasso witness

**Fonte principale:** Capitolo 3, `prop:buchi-emptiness`; collegamento al
`cor:ultimately-periodic-witness` e revisione di
`notebooks/14-buchi-emptiness-lasso.qmd`.

**Obiettivo didattico.** Comprendere entrambe le direzioni dell’equivalenza:
un accepting cycle genera una run infinita; una run accettante infinita
contiene due visite allo stesso stato accettante e quindi un ciclo.

**Modello mentale.** Un oggetto infinito accettante contiene un certificato
finito: stem + cycle.

**Interazioni.**

- trovare prima un accettante raggiungibile;
- verificare separatamente il ritorno non vuoto a se stesso;
- costruire stem e period;
- riprodurre alcune iterazioni mantenendo visibile che il periodo continua;
- nella direzione inversa, selezionare due visite allo stesso accettante in una
  run lunga e comprimere il segmento in un ciclo;
- proiettare il lasso in \(uv^\omega\).

**Stato visualizzato.**

- reachability set;
- SCC/ciclo candidato;
- visite ad accettanti;
- stem \(u\), period \(v\neq\varepsilon\);
- direzione corrente del bicondizionale;
- condizione Büchi `infinitely often`.

**Esempio guidato.** Request/acknowledgement già presente nel notebook, poi
esempio con stato accettante raggiungibile ma non su ciclo.

**Errori/failure cases.**

- accettante raggiungibile ma aciclico;
- ciclo raggiungibile senza stato accettante;
- accettante in ciclo ma non raggiungibile dall’iniziale;
- periodo vuoto;
- confondere “visitato almeno una volta” con “infinitely often”.

**Collegamento formale.** Due rami della proof map corrispondono esattamente ai
due paragrafi della prova della proposizione. Il lasso fornisce inoltre una
lettura automata-based dell’ultimately periodic witness; va presentata come
secondo ingresso compatibile col corollario, senza sostituire la derivazione
tramite espressioni \(\omega\)-regolari già usata nel capitolo.

**Valore oltre la lettura statica.** Fa vedere perché servono congiuntamente
reachability e recurrence, e comprime in modo controllato infinito e finito.

### Pilota 4 — Correttezza dell’attrattore

**Fonte:** Capitolo 5, `thm:attractor-correctness`.

**Obiettivo didattico.** Vedere entrambe le direzioni della prova e capire la
dualità:

- dentro l’attrattore, il rango induce una strategia vincente;
- fuori, il complemento chiuso induce una controstrategia dell’ambiente.

**Modello mentale.** Il rango è un conto alla rovescia verso il target; il
complemento è una zona da cui l’ambiente può impedire per sempre l’uscita.

**Interazioni.**

- calcolare ondate \(\mathsf{Attr}_k(T)\);
- decidere se un nodo system/environment entra nella prossima ondata;
- giocare dal nodo selezionato contro un ambiente avversario;
- scegliere una mossa a rango inferiore;
- passare al complemento \(U\) e impersonare l’ambiente;
- alterare il proprietario di un nodo e osservare il cambio
  esistenziale/universale.

**Stato visualizzato.**

- arena, ownership e target;
- rango di ogni vertice;
- successori che giustificano l’ingresso;
- strategia posizionale estratta;
- regione \(U=V\setminus\mathsf{Attr}(T)\);
- quantificatore corrente \(\exists/\forall\).

**Esempio guidato.** Figura del capitolo con \(s_0,e_1,T,e_2\): mostra perché
un environment node con una fuga non entra. Un secondo esempio aggiunge un
system node con una sola scelta buona.

**Errori/failure cases.**

- applicare la regola esistenziale a un environment node;
- scegliere un successore di pari rango e non garantire progresso;
- concludere che un nodo fuori è perdente senza costruire la controstrategia;
- ignorare dead end/totalità dell’arena;
- credere che serva memoria quando la prova estrae una strategia posizionale.

**Collegamento formale.** Il pannello formale alterna induzione sul rango e
chiusura duale del complemento; il gioco evidenzia il quantificatore usato in
ogni riga.

**Valore oltre la lettura statica.** La differenza tra “some” e “all” diventa
un’esperienza avversaria, mentre rango e strategia vengono estratti dalla
stessa costruzione usata nella prova.

### Pilota 5 — Riduzione automata-theoretic LTL model checking

**Fonte:** Capitolo 12, `thm:ltl-mc-automata`; sostituzione sostanziale della
pagina ponte `notebooks/10-model-checking.qmd`.

**Obiettivo didattico.** Capire perché una proprietà universale si verifica
cercando un controesempio esistenziale e come un accepting run del prodotto si
proietta in una traccia del sistema che soddisfa \(\neg\varphi\).

**Modello mentale.** Il prodotto è un detector sincronizzato: il sistema
produce una traccia, l’automa della negazione controlla se quella traccia è
cattiva.

**Interazioni.**

- scegliere tra una proprietà safety semplice e request/eventual grant;
- negare la formula con un passaggio esplicito;
- sincronizzare una mossa del sistema e una transizione
  dell’automa \(\mathcal A_{\neg\varphi}\);
- costruire solo il prodotto raggiungibile;
- cercare un accepting lasso;
- proiettare il lasso sulle due componenti;
- modificare una transizione del sistema e vedere comparire/scomparire il
  controesempio.

**Stato visualizzato.**

- Kripke structure;
- formula, negazione e obligation;
- automa per la negazione;
- stato prodotto \((s,q)\);
- accepting condition;
- traccia proiettata e punto di violazione.

**Esempio guidato.** Sistema request/grant con una transizione che permette di
rimandare `grant` per sempre; proprietà
\(\mathbf G(req\rightarrow\mathbf F grant)\).

**Errori/failure cases.**

- costruire l’automa di \(\varphi\) invece di \(\neg\varphi\);
- usare un’intersezione non sincronizzata;
- trovare un accepting state ma nessun accepting cycle;
- non proiettare il witness a una traccia valida del sistema;
- interpretare “nessun witness trovato finora” come prova di correttezza.

**Collegamento formale.** Ogni arco della reduction pipeline è una equivalenza
del teorema. Il witness percorre gli archi al contrario per spiegare la
direzione non banale.

**Valore oltre la lettura statica.** Collega in un unico oggetto concetti oggi
separati tra LTL, Büchi, product construction ed emptiness, rendendo verificabile
ogni interfaccia della riduzione.

### Pilota 6 — CTL come least/greatest fixed point

**Fonte:** Capitolo 13, proposizione “CTL as fixed points”; estensione del
pattern di `notebooks/06-reachability-fixpoint.qmd`.

**Obiettivo didattico.** Distinguere:

- \(\mu\): crescere dalla base tramite giustificazioni finite;
- \(\nu\): restringere l’universo eliminando stati che non si sostengono;
- predecessore esistenziale e universale.

**Modello mentale.** `EF` è un’onda di reachability; `AG` è una fortezza che
sopravvive a ogni uscita; `EG` conserva almeno un cammino interno.

**Interazioni.**

- scegliere `EF`, `AF`, `EG`, `AG`;
- predire lo stato di appartenenza al prossimo approssimante;
- alternare vista insiemistica e formula simbolica;
- cliccare uno stato per ottenere l’albero delle giustificazioni;
- costruire un path witness per operatori esistenziali;
- costruire un branch counterexample per operatori universali;
- confrontare simultaneamente \(Pre_E\) e \(Pre_A\).

**Stato visualizzato.**

- \(Z_i\) e \(Z_{i+1}\);
- stati aggiunti/rimossi e motivazione;
- fixed-point equation;
- quantificatore del predecessor;
- witness/counterexample;
- stato di stabilizzazione e bound \(|Q|\).

**Esempio guidato.** Piccola Kripke structure con goal e bad sink:
`EF goal` cresce; `AG safe` rimuove a ritroso gli stati con una fuga.

**Errori/failure cases.**

- iniziare un least fixed point da \(Q\);
- iniziare un greatest fixed point da \(\varnothing\);
- usare \(Pre_E\) per `AF/AG`;
- fermarsi prima di \(Z_i=Z_{i+1}\);
- confondere una singola path witness con una proprietà universale.

**Collegamento formale.** La formula corrente viene valutata come transformer;
monotonicità, inizializzazione e stabilizzazione hanno nodi dedicati nella
proof map.

**Valore oltre la lettura statica.** Unifica operatori temporali, quantificatori
e algoritmi su insiemi; lo studente vede la stessa equazione sia come semantica
sia come procedura.

## 8. Architettura tecnica proposta

### 8.1 Struttura dei file

Proposta futura, non implementata in questo studio:

```text
proofs/
├── prooflab.css
├── prooflab.js
├── proof-schema.json
├── renderers/
│   ├── automaton-svg.js
│   ├── game-svg.js
│   ├── product-svg.js
│   ├── fixpoint-svg.js
│   └── trace-table.js
├── models/
│   ├── subset-construction.js
│   ├── kleene-frontier.js
│   ├── buchi-lasso.js
│   ├── attractor.js
│   ├── ltl-product.js
│   └── ctl-fixpoint.js
└── data/
    ├── subset-construction.json
    └── ...
```

I notebook contengono introduzione, fallback statico e un mount point:

```html
<section
  class="vv-prooflab"
  data-proof="subset-construction"
  aria-labelledby="subset-title">
  <!-- contenuto statico completo e mount hooks -->
</section>
```

### 8.2 Contratto dichiarativo della prova

Schema indicativo:

```json
{
  "id": "subset-construction",
  "source": {
    "chapter": 1,
    "label": "thm:subset-construction"
  },
  "statement": "...",
  "invariants": [
    {
      "id": "same-reachable-set",
      "math": "\\widehat{\\delta}_D(...) = \\widehat{\\Delta}(...)"
    }
  ],
  "steps": [
    {
      "id": "preservation",
      "label": "Inductive step",
      "dependsOn": ["base", "construction-transition"],
      "goal": "Establish the invariant for wa",
      "uses": ["induction-hypothesis", "definition-delta-D"],
      "exampleAction": "consume-symbol",
      "checkpoint": "predict-next-subset"
    }
  ],
  "examples": [
    {
      "id": "last-a-aba",
      "model": "last-a",
      "input": "aba",
      "mode": "guided"
    }
  ]
}
```

Lo schema descrive narrazione e dipendenze. La semantica computazionale resta in
un piccolo model module puro:

```js
export function initialState(example) { /* ... */ }
export function legalActions(state) { /* ... */ }
export function reduce(state, action) { /* ... */ }
export function assertions(state) { /* invarianti verificabili */ }
export function explain(state, action) { /* reason code, non HTML arbitrario */ }
```

Separare data e model evita due estremi:

- una sequenza rigida di stringhe HTML che finge interattività;
- un motore universale troppo astratto e difficile da verificare.

### 8.3 Runtime condiviso

`prooflab.js` gestisce soltanto:

- modalità Guided/Free;
- timeline e proof map;
- focus sincronizzato;
- checkpoint/hint;
- URL state, per esempio
  `#proof=subset&step=preservation&example=aba`;
- regioni live;
- persistenza locale opzionale;
- caricamento del renderer richiesto;
- ripristino e confronto;
- progressive enhancement.

La logica matematica non deve dipendere dal DOM. Questo consente test con
`node:test` su funzioni pure.

### 8.4 Light DOM, non Shadow DOM

Usare custom elements senza Shadow DOM, oppure normali controller montati su
classi namespaced:

- permette a `custom.scss` di governare tipografia e colori;
- facilita MathJax/Quarto;
- rende più semplice l’ispezione con tecnologie assistive;
- consente fallback statici nello stesso albero.

Le classi devono essere prefissate, per esempio `.vv-proof-*`, evitando una
nuova collisione con `.sc-*`.

### 8.5 SVG, HTML, D3 e Canvas

**Scelta preferita: HTML + SVG.**

- HTML per testo formale, obligation, controlli e tabelle;
- SVG per automi, arene, prodotti, proof map e wavefront;
- DOM addressable per focus, tooltip e cross-highlighting;
- scalabilità e stampa migliori;
- alternativa testuale più naturale.

**D3 selettivo.**

Usare i moduli già noti al progetto per:

- layout di grafi;
- join tra stato e nodi SVG;
- zoom/pan dove necessario;
- transizioni spaziali brevi.

Non usare D3 per:

- calcolare la prova;
- conservare lo stato autorevole;
- generare testo formale;
- imporre un layout force instabile a grafi piccoli.

Per grafi didattici di 5–30 nodi, coordinate curate a mano sono spesso migliori
di un force layout: mantengono la mappa mentale tra un passo e l’altro.

**Canvas non raccomandato per MVP.** Sarebbe utile solo per centinaia o migliaia
di elementi, che questi piloti non hanno. Renderebbe più costosi accessibilità,
hit testing, stampa, selezione e annotazioni.

### 8.6 OJS

Observable JS è ottimo per prototipare un fixed-point explorer in una singola
pagina. Non è raccomandato come runtime principale perché:

- il repository ha già un modello raw HTML/JS;
- i componenti devono essere riusati anche fuori da celle OJS;
- test e fallback sono più semplici con funzioni ES standard;
- non serve un secondo sistema reattivo per una state machine esplicita.

Può comunque essere usato in fase di esplorazione, purché il risultato venga
riscritto nel runtime condiviso.

### 8.7 Matematica dinamica

Limitare la generazione dinamica di formule. Le formule principali devono
essere markup Quarto statico. Quando una sostituzione dipende dall’esempio:

- aggiornare piccoli token con `textContent`;
- usare MathJax solo sulla regione modificata;
- mantenere una versione parlata/lineare in `aria-label` o testo adiacente;
- non costruire formule con `innerHTML` non sanitizzato.

### 8.8 Test

Per ogni model module:

- test di ogni passaggio guidato;
- determinismo di reset/replay;
- proprietà degli invarianti dopo ogni azione valida;
- failure case atteso per azioni invalide;
- exhaustive check sulle piccole istanze quando fattibile;
- round-trip del witness, per esempio lasso → run accettante;
- test della proiezione prodotto → traccia del sistema.

Per il componente:

- smoke test della pagina renderizzata;
- navigazione completa da tastiera;
- nessun errore console;
- check di link/label verso il capitolo;
- snapshot a 360, 768 e 1280 px;
- `quarto render`.

### 8.9 Fonte di verità e sincronizzazione col libro

Non tentare di estrarre automaticamente una semantica interattiva dal LaTeX:
una buona visualizzazione richiede scelte editoriali.

Usare invece:

- `source.chapter` e `source.label` obbligatori;
- un linter che verifica l’esistenza del label nel capitolo;
- stessa terminologia e stesso running example;
- review congiunta di prova statica e data file;
- versione/hash dell’enunciato per segnalare possibili divergenze;
- link bidirezionale notebook ↔ PDF.

## 9. MVP e roadmap

### Tranche 0 — Specifica e design system

Output:

- schema dati v0;
- shell ProofLab statica;
- palette e component tokens;
- contratto di accessibilità;
- fixture di una prova fittizia molto piccola;
- test harness delle pure state machine.

Gate:

- funziona senza JS come outline completa;
- nessun renderer specifico è codificato nel core;
- proof map e timeline restano concetti distinti.

### Tranche 1 — MVP, due vertical slice

1. Subset construction correctness.
2. Attractor correctness.

Sono la coppia migliore perché esercitano meccaniche diverse:

- induzione e invariante sincronizzato;
- fixpoint, gioco avversario e controstrategia.

Il runtime è considerato MVP solo se entrambi i piloti lo usano senza fork del
core.

Gate:

- almeno due esempi per prova;
- almeno un controesempio;
- Guided + Free;
- fallback stampabile;
- test delle invarianti;
- review matematica;
- test rapido con studenti.

### Tranche 2 — Witness e induzione strutturale

3. Büchi emptiness/lasso.
4. Kleene induction frontier.

Questa tranche aggiunge:

- witness extractor;
- scrubber della frontiera induttiva;
- decomposizione di cammini;
- reuse/upgrade di notebook esistenti.

### Tranche 3 — Riduzioni e logiche temporali

5. Automata-theoretic LTL model checking.
6. CTL fixed points.

Questa tranche colma anche le pagine ponte di LTL/model checking e collega
capitoli oggi separati.

### Tranche 4 — Authoring e valutazione

- documentazione per autori;
- generatore di skeleton `.qmd` + JSON;
- linter dei source labels;
- gallery dei pattern;
- dataset di test condivisi;
- confronto delayed-learning;
- decisione sull’eventuale formal audit con Lean.

### Cosa non mettere nell’MVP

- editor visuale general-purpose;
- import/export di automi arbitrari;
- collaborazione real-time;
- gamification, punti, streak;
- generazione AI di passi;
- theorem prover in browser;
- Canvas/WebGL;
- analytics individuali;
- conversione automatica di tutte le prove del libro.

## 10. Criteri di qualità

### 10.1 Gate matematico

Un ProofLab è pubblicabile solo se:

- enunciato e ipotesi coincidono col capitolo;
- ogni passo dichiara cosa usa e cosa stabilisce;
- la proof map non introduce dipendenze inesistenti;
- esempio e formula usano la stessa notazione;
- ogni failure case è realmente un controesempio o è etichettato come limite
  dell’argomento;
- il model module soddisfa invariant assertions;
- un docente/revisore valida la corrispondenza con la prova formale.

### 10.2 Gate pedagogico

- entro 20 secondi è chiaro cosa si deve dimostrare;
- l’esempio precede l’astrazione;
- almeno un checkpoint richiede produzione, non riconoscimento;
- ogni errore riceve spiegazione causale;
- esiste un transfer case;
- lo studente può riassumere la prova dalla mappa;
- il takeaway non ripete soltanto l’enunciato.

### 10.3 Gate UX

- reset e back sono sempre disponibili;
- nessuna azione distrugge irreversibilmente il lavoro;
- URL riproduce passo ed esempio;
- le viste sincronizzate non mostrano stati incompatibili;
- niente autoplay;
- transizioni sotto il controllo dello studente;
- lo stato corrente è leggibile senza colore;
- il layout funziona su mobile e con zoom.

### 10.4 Gate tecnico

- un solo bundle/core;
- nessuna dipendenza nuova senza motivazione;
- nessun fetch remoto necessario ai dati della prova;
- nessun errore console;
- `quarto render` riuscito;
- model tests riusciti;
- fallback statico presente;
- print stylesheet verificato;
- CSP e sanitizzazione considerate per contenuto dinamico.

## 11. Misurare se funziona davvero

Non usare come metriche principali:

- tempo trascorso;
- numero di click;
- gradimento;
- completamento dell’animazione.

Sono segnali diagnostici, non comprensione.

### 11.1 Misure di apprendimento

Per ogni pilota preparare un mini test prima, subito dopo e dopo 7–14 giorni,
bilanciato sulle dimensioni di proof comprehension:

- significato di un termine/passo;
- stato logico di un’affermazione;
- warrant mancante;
- riassunto dell’idea;
- relazione tra moduli;
- applicazione a un nuovo esempio;
- adattamento del metodo a un caso vicino.

Esempi:

- subset: “perché l’unione, e non una scelta, preserva l’invariante?”;
- attractor: “costruisci una controstrategia dal complemento”;
- Büchi: “fornisci un automa con accepting reachable ma language empty”;
- CTL: “quale inizializzazione distingue \(\mu\) da \(\nu\)?”.

### 11.2 Confronto

In una piccola sperimentazione didattica:

- gruppo/turno A: walkthrough statico;
- gruppo/turno B: stesso testo più ProofLab;
- stessa durata massima;
- problemi isomorfi, non identici;
- delayed test;
- raccolta di self-explanation brevi.

Con classi piccole è preferibile un crossover tra due teoremi, così ogni
studente usa entrambi i formati in ordine bilanciato.

### 11.3 Telemetria prudente

Se introdotta, solo aggregata e coerente con privacy policy:

- checkpoint tentati;
- hint depth;
- uso del transfer case;
- passaggi riaperti;
- failure case esplorati;
- modalità Guided/Free.

Non memorizzare parole, formule o grafi arbitrari inseriti dallo studente senza
consenso. Il valore del laboratorio deve restare anche senza analytics.

### 11.4 Soglie iniziali

Soglie da calibrare, non promesse:

- almeno 80% completa il percorso guidato senza assistenza esterna;
- almeno 70% spiega correttamente l’invariante/idea globale subito dopo;
- nessun peggioramento nel delayed test rispetto al walkthrough statico;
- almeno 60% risolve il transfer case con massimo un hint;
- tutti i task core completabili da tastiera.

Il criterio più importante è il delayed test: il rischio documentato è creare
un’esperienza piacevole che riduce l’elaborazione autonoma.

## 12. Rischi e mitigazioni

| Rischio | Conseguenza | Mitigazione |
|---|---|---|
| Visualizzazione scambiata per prova | falsa comprensione | formal lens e warrant sempre presenti; messaggio esempio/generale |
| Over-scaffolding | ritenzione peggiore | predict-before-reveal, fading, transfer, delayed test |
| Novelty effect | attenzione alla UI, non alla logica | niente premi/autoplay; gesto con semantica matematica |
| Divergenza dal PDF | contraddizioni tra fonti | label obbligatorio, review congiunta, linter e statement hash |
| Bug nel modello | spiegazione matematicamente falsa | funzioni pure, invariant assertions, exhaustive tests piccoli |
| Runtime troppo astratto | lentezza editoriale | core limitato; renderer e model domain-specific |
| Duplicazione | manutenzione costosa | CSS/JS condivisi, schema e classi namespaced |
| Grafi instabili | perdita della mappa mentale | coordinate curate per esempi piccoli; force layout solo se necessario |
| Accessibilità tardiva | redesign e esclusione | contratto WCAG dalla Tranche 0 |
| Mobile come riduzione | impossibile confrontare viste | stacking sincronizzato e outline persistente |
| Dipendenza CDN | laboratorio rotto/offline | asset locali/pinned; nessun fetch per proof data |
| Lean troppo presto | barriera sintattica e scope explosion | formal audit solo dopo validazione del formato |
| Troppe prove subito | qualità disomogenea | sei piloti, due nell’MVP, gate severi |

## 13. Decisioni raccomandate

### Sì

- ProofLab a tre lenti sincronizzate;
- formal proof nel PDF come fonte autorevole;
- due MVP: subset construction + attractor correctness;
- HTML semantico + SVG;
- JavaScript modulare, modelli puri e dati dichiarativi;
- D3 selettivo e condiviso;
- Guided/Free con predict-explain-transfer;
- proof map DAG e timeline separate;
- controesempi minimi;
- accessibilità e fallback statico dal primo commit;
- misura delayed e transfer.

### No

- Mermaid;
- autoplay;
- quiz di memoria come interazione principale;
- Canvas per i piloti;
- framework frontend pesante;
- proof assistant nel core MVP;
- “sandbox” prima dell’esempio guidato;
- una lunga serie di step hard-coded come stringhe HTML;
- pubblicazione senza review matematica e invariant tests.

## 14. Proposta finale

Il passo successivo consigliato non è implementare sei notebook in parallelo.
È costruire **un prototipo verticale della subset construction** che includa
già:

- proof map;
- formal/example lens sincronizzate;
- invariante persistente;
- checkpoint di previsione;
- hypothesis surgery sulla condizione di accettazione;
- transfer case;
- fallback statico;
- tastiera/mobile;
- test del modello.

Subito dopo, usare lo stesso core per l’attrattore. Se il secondo pilota
richiede di riscrivere il runtime, il design non è ancora condivisibile. Se
invece i due convivono con soli renderer/model diversi, ProofLab è pronto per
la roadmap.

Questa è l’opzione più innovativa che rimane pedagogicamente rigorosa: non
“spettacolarizza” la prova, ma rende osservabili i suoi oggetti invisibili —
stato dell’argomento, invariante, obblighi, quantificatori, testimoni e
controstrategie — e lascia allo studente il controllo sufficiente per
interrogarli.

## Riferimenti essenziali

- Bret Victor,
  [Explorable Explanations](https://worrydream.com/ExplorableExplanations/),
  2011, postscript 2024.
- Jill H. Larkin e Herbert A. Simon,
  [Why a Diagram is (Sometimes) Worth Ten Thousand Words](https://doi.org/10.1111/j.1551-6708.1987.tb00863.x),
  *Cognitive Science* 11, 1987.
- Michelene T. H. Chi e Ruth Wylie,
  [The ICAP Framework: Linking Cognitive Engagement to Active Learning Outcomes](https://doi.org/10.1080/00461520.2014.965823),
  *Educational Psychologist* 49(4), 2014.
- Juan Pablo Mejía-Ramos et al.,
  [An assessment model for proof comprehension in undergraduate mathematics](https://doi.org/10.1007/s10649-011-9349-7),
  *Educational Studies in Mathematics* 79, 2012.
- Somali Roy, Matthew Inglis e Lara Alcock,
  [Multimedia resources designed to support learning from written proofs: an eye-movement study](https://doi.org/10.1007/s10649-017-9754-7),
  *Educational Studies in Mathematics* 96, 2017.
- Carst Tankink et al.,
  [Proviola: A Tool for Proof Re-animation](https://arxiv.org/abs/1005.2672),
  2010.
- Joachim Breitner e Denis Lohner,
  [The meta theory of the Incredible Proof Machine](https://www.isa-afp.org/entries/Incredible_Proof_Machine.html),
  Archive of Formal Proofs, 2016.
- Lean,
  [User widgets system](https://lean-lang.org/examples/1900-1-1-widgets/).
- Paperproof,
  [A new proof interface for Lean 4](https://reservoir.lean-lang.org/%40Paper-Proof/paperproof).
- Romina Mahinpei, Manoel Horta Ribeiro e Mae Milano,
  [Interactive Theorem Provers for Proof Education](https://doi.org/10.1145/3758317.3759679),
  SPLASH-E 2025.
- Moritz Weckbecker, Solida Neziri e Georges Hattab,
  [Supporting Mathematical Education with Interactive Visual Proofs](https://visualization.group/documents/weckbeckerneziri2023.pdf),
  2023; [piattaforma](https://visualproofs.github.io/).
- Quarto,
  [Observable JS documentation](https://quarto.org/docs/interactive/ojs/).
- D3,
  [What is D3?](https://d3js.org/what-is-d3).
- W3C,
  [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/).
