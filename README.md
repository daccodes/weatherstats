# WEATHER-STATS-APP
![Progetto senza titolo](https://user-images.githubusercontent.com/85349333/129809198-8a12999c-9ea5-45d8-a3be-c876c9510467.png)

## Di cosa si tratta: 
 
Un servizio web che consente all'utente di ricercare informazioni riguardanti i principali inquinanti presenti nell'aria ed altri dati generici quali temperatura, pressione ed umidità.


## Utilizzo:

Il suo utilizzo è piuttosto semplice, infatti basta indicare quale funzione si desidera eseguire e fare click sul pulsante di ricerca. È inoltre possibile comparare i dati di più stazioni meteo, data la ricerca multipla che accoda alla ricerca precedente un'ulteriore riga con la ricerca corrente.


## Come è strutturato il progetto:
Il progetto è realizzato utilizzando esclusivamente javascript,typescript e css per dare enfasi alla versatilità degli stessi linguaggi. Infatti proprio per questo motivo che grazie a webpack e loaders dedicati,  è stato possibile gestire risorse front-end come HTML, CSS e immagini. Per quanto riguarda la parte di build e di deployment, il webserver viene gestito da netlify. 


## N.B.
La scelta dell'utilizzo di javascript per disegnare tutti gli elementi del DOM è frutto solamente della volontà di mostrare le potenzialità del linguaggio, sia chiaro che non è la scelta ottimale sia per quanto riguarda le prestazioni, sia per quanto riguarda la facilità di lettura e manutenzione del codice.

## Come utilizzarlo offline:
Una volta scaricato il codice ed aperto nell'editor preferito, compilare il progetto secondo questi criteri:

* installare le dipendenze: 
  ```
  npm install
  ```
* avviare la build: 
  ```
  npm run build
  ```
* avviare il webserver in locale:
  ```
  npm start
  ```

Ecco che il progetto sarà visibile all'indirizzo:
http://localhost:8080

A seguire il link dove è possibile provare l'applicazione.

Happy Coding!

## Live Demo:

https://weatherstatsapp.netlify.app
