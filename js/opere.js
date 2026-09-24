/* =====================================================================
   STUDIO COLARUSSO — DATI DEL SITO
   Questo è l'unico file che ti serve modificare per le opere e i contatti.
   ===================================================================== */

const CONFIG = {
  email: "tua-email@esempio.it",           // ← la mail dello studio (riceve i messaggi del modulo)
  instagram: "https://instagram.com/",     // ← link al profilo Instagram
  instagramNome: "@studiocolarusso",       // ← nome del profilo come deve apparire
  operaInApertura: 41                      // ← numero (n) dell'opera mostrata in apertura
};

/* ELENCO DELLE OPERE
   - titolo, anno, tecnica, misure: scrivi tra le virgolette. Se lasci "" il campo non appare.
   - genesi: il racconto dell'opera ("La genesi di quest'opera"). Se lasci "" il pulsante non appare.
   - selezione: le opere il cui numero è nella lista SELEZIONE qui sotto appaiono grandi
     nella prima parte della galleria; tutte le opere appaiono poi nell'Archivio.
   - per aggiungere un'opera: metti la foto in img/opere/ e copia una riga cambiando n e foto.
     (w e h sono larghezza e altezza della foto in pixel: servono solo come proporzione) */

const SELEZIONE = [41, 15, 21, 37, 43, 5, 34, 46, 24];

const OPERE = [
  { n:1, titolo:"Décollage n. 01", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"(Esempio — sostituisci questo testo) Strati di manifesti raccolti per le strade di Bologna, incollati e lasciati asciugare per giorni. Lo strappo è avvenuto in un solo gesto, di notte: sotto il volto è riemersa una locandina degli anni Sessanta.", foto:"img/opere/opera-01.jpg", w:668, h:921 },
  { n:2, titolo:"Décollage n. 02", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-02.jpg", w:1086, h:1448 },
  { n:3, titolo:"Décollage n. 03", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-03.jpg", w:700, h:726 },
  { n:4, titolo:"Décollage n. 04", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-04.jpg", w:618, h:855 },
  { n:5, titolo:"Décollage n. 05", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-05.jpg", w:730, h:748 },
  { n:6, titolo:"Décollage n. 06", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-06.jpg", w:727, h:938 },
  { n:7, titolo:"Décollage n. 07", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-07.jpg", w:699, h:690 },
  { n:8, titolo:"Décollage n. 08", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-08.jpg", w:634, h:634 },
  { n:9, titolo:"Décollage n. 09", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-09.jpg", w:630, h:810 },
  { n:10, titolo:"Décollage n. 10", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-10.jpg", w:1086, h:1448 },
  { n:11, titolo:"Décollage n. 11", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-11.jpg", w:1122, h:1402 },
  { n:12, titolo:"Décollage n. 12", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-12.jpg", w:1122, h:1122 },
  { n:13, titolo:"Décollage n. 13", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-13.jpg", w:1005, h:1005 },
  { n:14, titolo:"Décollage n. 14", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-14.jpg", w:1122, h:1402 },
  { n:15, titolo:"Décollage n. 15", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-15.jpg", w:1254, h:1254 },
  { n:16, titolo:"Décollage n. 16", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-16.jpg", w:1254, h:1254 },
  { n:17, titolo:"Décollage n. 17", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-17.jpg", w:1254, h:1254 },
  { n:18, titolo:"Décollage n. 18", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-18.jpg", w:1086, h:1448 },
  { n:19, titolo:"Décollage n. 19", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-19.jpg", w:872, h:872 },
  { n:20, titolo:"Décollage n. 20", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-20.jpg", w:1427, h:893 },
  { n:21, titolo:"Décollage n. 21", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-21.jpg", w:1254, h:1254 },
  { n:22, titolo:"Décollage n. 22", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-22.jpg", w:877, h:877 },
  { n:23, titolo:"Décollage n. 23", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-23.jpg", w:1254, h:1254 },
  { n:24, titolo:"Décollage n. 24", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-24.jpg", w:1254, h:1254 },
  { n:25, titolo:"Décollage n. 25", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-25.jpg", w:901, h:901 },
  { n:26, titolo:"Décollage n. 26", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-26.jpg", w:1175, h:1338 },
  { n:27, titolo:"Décollage n. 27", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-27.jpg", w:1254, h:1254 },
  { n:28, titolo:"Décollage n. 28", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-28.jpg", w:1122, h:1402 },
  { n:29, titolo:"Décollage n. 29", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-29.jpg", w:1143, h:1376 },
  { n:30, titolo:"Décollage n. 30", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-30.jpg", w:1086, h:1448 },
  { n:31, titolo:"Décollage n. 31", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-31.jpg", w:1086, h:1448 },
  { n:32, titolo:"Décollage n. 32", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-32.jpg", w:1086, h:1448 },
  { n:33, titolo:"Décollage n. 33", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-33.jpg", w:1086, h:1448 },
  { n:34, titolo:"Décollage n. 34", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-34.jpg", w:1086, h:1448 },
  { n:35, titolo:"Décollage n. 35", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-35.jpg", w:1086, h:1448 },
  { n:36, titolo:"Décollage n. 36", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-36.jpg", w:1254, h:1254 },
  { n:37, titolo:"Décollage n. 37", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-37.jpg", w:1086, h:1448 },
  { n:38, titolo:"Décollage n. 38", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-38.jpg", w:1086, h:1448 },
  { n:39, titolo:"Décollage n. 39", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-39.jpg", w:1086, h:1448 },
  { n:40, titolo:"Décollage n. 40", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-40.jpg", w:1086, h:1448 },
  { n:41, titolo:"Décollage n. 41", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-41.jpg", w:1086, h:1448 },
  { n:42, titolo:"Décollage n. 42", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-42.jpg", w:1086, h:1448 },
  { n:43, titolo:"Décollage n. 43", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-43.jpg", w:1254, h:1254 },
  { n:44, titolo:"Décollage n. 44", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-44.jpg", w:1157, h:1157 },
  { n:45, titolo:"Décollage n. 45", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-45.jpg", w:1085, h:1085 },
  { n:46, titolo:"Décollage n. 46", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-46.jpg", w:1085, h:1085 },
  { n:47, titolo:"Décollage n. 47", anno:"", tecnica:"Décollage su carta", misure:"", genesi:"", foto:"img/opere/opera-47.jpg", w:1254, h:1254 },
];
