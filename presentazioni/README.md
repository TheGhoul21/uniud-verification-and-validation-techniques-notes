# Presentazioni del corso

Le due presentazioni sono esportate dai documenti `.lesson` di Lesson Studio.
Contengono soltanto le celle visibili e le figure e gli output salvati; note del
relatore, celle nascoste, chat e registrazioni non sono pubblicati.

Per rigenerarle, dalla cartella del sito con Lesson Studio nel repository accanto:

```sh
python3 ../lesson-studio/scripts/export_presentations.py --output presentazioni
quarto render
```

Il rendering è eseguito anche dal workflow GitHub Pages. I file HTML in `_site`
provengono da Quarto e non vanno modificati a mano.

Il catalogo `presentations.json` associa ogni capitolo al proprio deck e riserva
`youtube_url` per il futuro video montato. Al momento vengono pubblicate soltanto
le presentazioni. I font distribuiti includono le rispettive licenze OFL.
