# Presentazioni del corso

Le due presentazioni sono esportate dai documenti `.lesson` di Lesson Studio.
Contengono soltanto le celle visibili e le figure e gli output salvati; note del
relatore, celle nascoste, chat e registrazioni non sono pubblicati.

Ogni capitolo ha due viste: il deck Reveal.js e una pagina `-lettura.qmd` con
scorrimento continuo. Entrambe includono lo stesso corpo Markdown `_01-*.md` o
`_02-*.md`, che va modificato per aggiornare il contenuto. Le formule usano KaTeX:
il template Reveal.js di Quarto 1.6 usa il plugin MathJax 2 anche quando gli si
passa l'URL di MathJax 3, provocando errori JavaScript.

Su uno schermo portrait fino a 768 px il deck apre automaticamente la lettura.
Il link "Modalità slide" aggiunge `?view=slides` per rispettare la scelta esplicita.
Il passaggio tra le viste conserva la scena corrente. Formule e codice lunghi
si scorrono orizzontalmente senza allargare la pagina.

Per rigenerarle, dalla cartella del sito con Lesson Studio nel repository accanto:

```sh
python3 ../lesson-studio/scripts/export_presentations.py --output presentazioni
quarto render
```

L'esportatore esterno originale produce deck monolitici: prima di sostituire i
file del sito, separare il corpo esportato nei rispettivi `_01-*.md` / `_02-*.md`
e conservare i front matter dei deck, i wrapper di lettura e i file di supporto.

Il rendering è eseguito anche dal workflow GitHub Pages. I file HTML in `_site`
provengono da Quarto e non vanno modificati a mano.

Il catalogo `presentations.json` associa ogni capitolo al proprio deck e riserva
`youtube_url` per il futuro video montato. Al momento vengono pubblicate soltanto
le presentazioni. I font distribuiti includono le rispettive licenze OFL.
