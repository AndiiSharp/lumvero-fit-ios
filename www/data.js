// AUTOMATISCH ERZEUGT aus SeedData.kt (tools/gen-data.mjs) – nicht von Hand ändern.
'use strict';
window.SEED = {
 "muscles": [
  "Brust",
  "Rücken",
  "Beine",
  "Gesäß",
  "Schultern",
  "Bizeps",
  "Trizeps",
  "Bauch & Core",
  "Waden",
  "Ganzkörper",
  "Mobilität"
 ],
 "equips": [
  "Langhantel",
  "Kurzhantel",
  "Kettlebell",
  "Maschine/Kabel",
  "Klimmzugstange",
  "Körpergewicht",
  "Widerstandsband",
  "Bank/Box"
 ],
 "patterns": [
  "SQUAT",
  "LUNGE",
  "HINGE",
  "PUSH_H",
  "BENCH",
  "PUSH_V",
  "PULL_V",
  "PULL_H",
  "CURL",
  "TRICEP",
  "RAISE",
  "PLANK",
  "CORE",
  "BRIDGE",
  "CALF",
  "CARDIO",
  "CARRY",
  "STRETCH"
 ],
 "patternLabels": {
  "SQUAT": "Kniebeuge",
  "LUNGE": "Ausfallschritt",
  "HINGE": "Hüftbeuge",
  "PUSH_H": "Drücken (Boden)",
  "BENCH": "Drücken (Bank)",
  "PUSH_V": "Drücken über Kopf",
  "PULL_V": "Ziehen vertikal",
  "PULL_H": "Rudern",
  "CURL": "Beugen (Arm)",
  "TRICEP": "Strecken (Arm)",
  "RAISE": "Heben seitlich",
  "PLANK": "Stütz",
  "CORE": "Rumpfbeuge",
  "BRIDGE": "Brücke",
  "CALF": "Wadenheben",
  "CARDIO": "Cardio",
  "CARRY": "Tragen",
  "STRETCH": "Dehnen"
 },
 "patternSuggest": {
  "Brust": "BENCH",
  "Rücken": "PULL_H",
  "Beine": "SQUAT",
  "Gesäß": "BRIDGE",
  "Schultern": "PUSH_V",
  "Bizeps": "CURL",
  "Trizeps": "TRICEP",
  "Bauch & Core": "CORE",
  "Waden": "CALF",
  "Ganzkörper": "CARRY",
  "Mobilität": "STRETCH"
 },
 "exercises": [
  {
   "key": "squat_bb",
   "name": "Kniebeuge (Langhantel)",
   "muscleGroup": "Beine",
   "equipment": "Langhantel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Stange auf den oberen Rücken legen, Füße schulterbreit\nBrust aufrecht, Rumpf anspannen\nHüfte nach hinten-unten, Knie folgen den Zehen\nBis mindestens parallel absenken und kraftvoll hochdrücken"
  },
  {
   "key": "front_squat",
   "name": "Frontkniebeuge",
   "muscleGroup": "Beine",
   "equipment": "Langhantel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Stange vorne auf den Schultern, Ellbogen hoch\nOberkörper möglichst senkrecht halten\nTief absenken, Knie nach außen\nÜber die ganze Fußsohle hochdrücken"
  },
  {
   "key": "goblet_squat",
   "name": "Goblet Squat",
   "muscleGroup": "Beine",
   "equipment": "Kurzhantel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Kurzhantel oder Kettlebell vor der Brust halten\nFüße etwas weiter als schulterbreit\nZwischen die Knie absenken, Rücken gerade\nAus den Fersen nach oben drücken"
  },
  {
   "key": "air_squat",
   "name": "Kniebeuge (Körpergewicht)",
   "muscleGroup": "Beine",
   "equipment": "Körpergewicht",
   "pattern": "SQUAT",
   "trackType": "REPS",
   "instructions": "Füße schulterbreit, Arme nach vorne\nHüfte zurück und tief absenken\nFersen bleiben am Boden\nZügig aufrichten"
  },
  {
   "key": "jump_squat",
   "name": "Sprungkniebeuge",
   "muscleGroup": "Beine",
   "equipment": "Körpergewicht",
   "pattern": "SQUAT",
   "trackType": "REPS",
   "instructions": "Halbtiefe Kniebeuge einnehmen\nExplosiv nach oben springen\nWeich über die Fußballen landen\nDirekt in die nächste Wiederholung"
  },
  {
   "key": "leg_press",
   "name": "Beinpresse",
   "muscleGroup": "Beine",
   "equipment": "Maschine/Kabel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Rücken fest an die Lehne, Füße hüftbreit auf die Platte\nSicherung lösen, Knie kontrolliert beugen\nNicht ins Hohlkreuz rollen\nDrücken, Knie nicht ganz durchstrecken"
  },
  {
   "key": "leg_ext",
   "name": "Beinstrecker",
   "muscleGroup": "Beine",
   "equipment": "Maschine/Kabel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Knie auf Höhe der Maschinenachse ausrichten\nPolster über dem Sprunggelenk\nBeine kontrolliert strecken\nLangsam zurückführen"
  },
  {
   "key": "leg_curl",
   "name": "Beinbeuger",
   "muscleGroup": "Beine",
   "equipment": "Maschine/Kabel",
   "pattern": "HINGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Polster oberhalb der Fersen platzieren\nHüfte fest auf dem Polster\nFersen Richtung Gesäß ziehen\nLangsam ablassen"
  },
  {
   "key": "wall_sit",
   "name": "Wandsitzen",
   "muscleGroup": "Beine",
   "equipment": "Körpergewicht",
   "pattern": "SQUAT",
   "trackType": "TIME",
   "instructions": "Rücken an die Wand lehnen\nHerunterrutschen bis Knie ca. 90 Grad\nGewicht auf den Fersen\nPosition halten und ruhig atmen"
  },
  {
   "key": "lunge_db",
   "name": "Ausfallschritt (Kurzhantel)",
   "muscleGroup": "Beine",
   "equipment": "Kurzhantel",
   "pattern": "LUNGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln seitlich halten, aufrecht stehen\nGroßen Schritt nach vorne\nHinteres Knie Richtung Boden senken\nÜber das vordere Bein zurückdrücken"
  },
  {
   "key": "reverse_lunge",
   "name": "Ausfallschritt rückwärts",
   "muscleGroup": "Beine",
   "equipment": "Körpergewicht",
   "pattern": "LUNGE",
   "trackType": "REPS",
   "instructions": "Aufrecht stehen, Hände an der Hüfte\nEin Bein weit nach hinten setzen\nBeide Knie beugen, Oberkörper aufrecht\nZurück in den Stand, Seite wechseln"
  },
  {
   "key": "split_squat",
   "name": "Bulgarian Split Squat",
   "muscleGroup": "Beine",
   "equipment": "Bank/Box",
   "pattern": "LUNGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hinteren Fuß auf eine Bank legen\nVorderer Fuß weit genug vorne\nSenkrecht absenken\nÜber die vordere Ferse hochdrücken"
  },
  {
   "key": "step_up",
   "name": "Step-up",
   "muscleGroup": "Beine",
   "equipment": "Bank/Box",
   "pattern": "LUNGE",
   "trackType": "REPS",
   "instructions": "Vor eine stabile Box oder Stufe stellen\nGanzen Fuß aufsetzen\nMit dem oberen Bein hochdrücken\nKontrolliert wieder absteigen"
  },
  {
   "key": "rdl",
   "name": "Rumänisches Kreuzheben",
   "muscleGroup": "Gesäß",
   "equipment": "Langhantel",
   "pattern": "HINGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Stange vor den Oberschenkeln, Knie leicht gebeugt\nHüfte weit nach hinten schieben\nStange nah am Bein bis unter die Knie\nGesäß anspannen und aufrichten"
  },
  {
   "key": "deadlift",
   "name": "Kreuzheben",
   "muscleGroup": "Rücken",
   "equipment": "Langhantel",
   "pattern": "HINGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Stange über der Fußmitte, hüftbreiter Stand\nGreifen, Rücken neutral, Brust raus\nBeine drücken, Stange nah am Körper\nOben Hüfte strecken, kontrolliert absetzen"
  },
  {
   "key": "kb_swing",
   "name": "Kettlebell Swing",
   "muscleGroup": "Gesäß",
   "equipment": "Kettlebell",
   "pattern": "HINGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Kettlebell zwischen den Beinen nach hinten schwingen\nHüfte explosiv nach vorne strecken\nArme nur führen, nicht heben\nGlocke bis Brusthöhe schwingen lassen"
  },
  {
   "key": "hip_thrust",
   "name": "Hip Thrust",
   "muscleGroup": "Gesäß",
   "equipment": "Langhantel",
   "pattern": "BRIDGE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Oberer Rücken an einer Bank, Stange auf der Hüfte\nFüße hüftbreit aufstellen\nHüfte hochdrücken bis zur Linie\nOben Gesäß fest anspannen"
  },
  {
   "key": "glute_bridge",
   "name": "Glute Bridge",
   "muscleGroup": "Gesäß",
   "equipment": "Körpergewicht",
   "pattern": "BRIDGE",
   "trackType": "REPS",
   "instructions": "Rückenlage, Füße nah am Gesäß\nBauch anspannen\nBecken anheben bis Knie-Hüfte-Schulter eine Linie bilden\nKurz halten, langsam ablegen"
  },
  {
   "key": "calf_raise",
   "name": "Wadenheben stehend",
   "muscleGroup": "Waden",
   "equipment": "Körpergewicht",
   "pattern": "CALF",
   "trackType": "REPS",
   "instructions": "Fußballen auf eine Stufe stellen\nFersen tief absenken\nSo hoch wie möglich auf die Zehen\nOben eine Sekunde halten"
  },
  {
   "key": "calf_raise_seated",
   "name": "Wadenheben sitzend",
   "muscleGroup": "Waden",
   "equipment": "Maschine/Kabel",
   "pattern": "CALF",
   "trackType": "WEIGHT_REPS",
   "instructions": "Polster auf die Oberschenkel\nFußballen auf die Plattform\nFersen absenken und hochdrücken\nLangsam und vollständig bewegen"
  },
  {
   "key": "bench_bb",
   "name": "Bankdrücken (Langhantel)",
   "muscleGroup": "Brust",
   "equipment": "Langhantel",
   "pattern": "BENCH",
   "trackType": "WEIGHT_REPS",
   "instructions": "Auf die Bank legen, Augen unter der Stange\nSchulterblätter zusammen, Füße fest\nStange kontrolliert zur unteren Brust\nGerade nach oben drücken"
  },
  {
   "key": "bench_db",
   "name": "Kurzhantel-Bankdrücken",
   "muscleGroup": "Brust",
   "equipment": "Kurzhantel",
   "pattern": "BENCH",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln auf Brusthöhe, Handflächen nach vorn\nSchulterblätter fixieren\nNach oben drücken, Hanteln nähern sich\nLangsam tief absenken"
  },
  {
   "key": "incline_db",
   "name": "Schrägbankdrücken (Kurzhantel)",
   "muscleGroup": "Brust",
   "equipment": "Kurzhantel",
   "pattern": "BENCH",
   "trackType": "WEIGHT_REPS",
   "instructions": "Bank auf 30–45 Grad stellen\nHanteln über der oberen Brust\nKontrolliert absenken\nKraftvoll nach oben drücken"
  },
  {
   "key": "close_bench",
   "name": "Enges Bankdrücken",
   "muscleGroup": "Trizeps",
   "equipment": "Langhantel",
   "pattern": "BENCH",
   "trackType": "WEIGHT_REPS",
   "instructions": "Schulterbreiter Griff\nEllbogen nah am Körper\nStange zur unteren Brust\nMit Trizeps nach oben drücken"
  },
  {
   "key": "db_fly",
   "name": "Fliegende (Kurzhantel)",
   "muscleGroup": "Brust",
   "equipment": "Kurzhantel",
   "pattern": "BENCH",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln über der Brust, Ellbogen leicht gebeugt\nIn weitem Bogen seitlich absenken\nDehnung in der Brust spüren\nIm gleichen Bogen zusammenführen"
  },
  {
   "key": "cable_cross",
   "name": "Kabelzug-Crossover",
   "muscleGroup": "Brust",
   "equipment": "Maschine/Kabel",
   "pattern": "RAISE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Zwischen zwei Kabeltürme stellen, leichter Schritt nach vorn\nGriffe in weitem Bogen vor der Brust zusammenführen\nKurz halten\nKontrolliert öffnen"
  },
  {
   "key": "pushup",
   "name": "Liegestütz",
   "muscleGroup": "Brust",
   "equipment": "Körpergewicht",
   "pattern": "PUSH_H",
   "trackType": "REPS",
   "instructions": "Hände etwas breiter als schulterbreit\nKörper bildet eine Linie\nBrust bis knapp über den Boden\nKraftvoll hochdrücken"
  },
  {
   "key": "knee_pushup",
   "name": "Knie-Liegestütz",
   "muscleGroup": "Brust",
   "equipment": "Körpergewicht",
   "pattern": "PUSH_H",
   "trackType": "REPS",
   "instructions": "Knie am Boden, Hände unter den Schultern\nHüfte gestreckt halten\nBrust Richtung Boden senken\nHochdrücken"
  },
  {
   "key": "incline_pushup",
   "name": "Erhöhter Liegestütz",
   "muscleGroup": "Brust",
   "equipment": "Bank/Box",
   "pattern": "PUSH_H",
   "trackType": "REPS",
   "instructions": "Hände auf Bank oder Tisch\nKörper gerade, Bauch fest\nBrust zur Kante senken\nWegdrücken"
  },
  {
   "key": "diamond_pushup",
   "name": "Diamond-Liegestütz",
   "muscleGroup": "Trizeps",
   "equipment": "Körpergewicht",
   "pattern": "PUSH_H",
   "trackType": "REPS",
   "instructions": "Hände unter der Brust, Daumen und Zeigefinger bilden eine Raute\nEllbogen nah am Körper\nAbsenken bis Brust die Hände berührt\nHochdrücken"
  },
  {
   "key": "dips",
   "name": "Dips",
   "muscleGroup": "Brust",
   "equipment": "Klimmzugstange",
   "pattern": "TRICEP",
   "trackType": "REPS",
   "instructions": "Im Stütz am Barren, Arme gestreckt\nOberkörper leicht nach vorne\nAbsenken bis Oberarme parallel\nNach oben drücken"
  },
  {
   "key": "pullup",
   "name": "Klimmzug",
   "muscleGroup": "Rücken",
   "equipment": "Klimmzugstange",
   "pattern": "PULL_V",
   "trackType": "REPS",
   "instructions": "Schulterbreiter Obergriff\nAus dem Hang Schulterblätter nach unten ziehen\nKinn über die Stange ziehen\nLangsam ganz ablassen"
  },
  {
   "key": "chinup",
   "name": "Chin-up (Untergriff)",
   "muscleGroup": "Rücken",
   "equipment": "Klimmzugstange",
   "pattern": "PULL_V",
   "trackType": "REPS",
   "instructions": "Schulterbreiter Untergriff\nBrust zur Stange ziehen\nEllbogen nach unten führen\nKontrolliert ablassen"
  },
  {
   "key": "lat_pulldown",
   "name": "Latzug",
   "muscleGroup": "Rücken",
   "equipment": "Maschine/Kabel",
   "pattern": "PULL_V",
   "trackType": "WEIGHT_REPS",
   "instructions": "Breiter Griff, Oberschenkel fixiert\nLeicht zurücklehnen\nStange zur oberen Brust ziehen\nLangsam nach oben führen"
  },
  {
   "key": "row_bb",
   "name": "Langhantelrudern",
   "muscleGroup": "Rücken",
   "equipment": "Langhantel",
   "pattern": "PULL_H",
   "trackType": "WEIGHT_REPS",
   "instructions": "Oberkörper ca. 45 Grad vorgebeugt, Rücken gerade\nStange hängt unter den Schultern\nZum Bauchnabel ziehen\nKontrolliert absenken"
  },
  {
   "key": "row_db",
   "name": "Kurzhantelrudern einarmig",
   "muscleGroup": "Rücken",
   "equipment": "Kurzhantel",
   "pattern": "PULL_H",
   "trackType": "WEIGHT_REPS",
   "instructions": "Knie und Hand auf der Bank abstützen\nHantel hängt gerade nach unten\nEllbogen Richtung Hüfte ziehen\nLangsam ablassen, Seite wechseln"
  },
  {
   "key": "cable_row",
   "name": "Kabelrudern sitzend",
   "muscleGroup": "Rücken",
   "equipment": "Maschine/Kabel",
   "pattern": "PULL_H",
   "trackType": "WEIGHT_REPS",
   "instructions": "Aufrecht sitzen, Füße auf der Plattform\nGriff zum Bauch ziehen\nSchulterblätter zusammenführen\nArme kontrolliert strecken"
  },
  {
   "key": "inverted_row",
   "name": "Umgekehrtes Rudern",
   "muscleGroup": "Rücken",
   "equipment": "Klimmzugstange",
   "pattern": "PULL_H",
   "trackType": "REPS",
   "instructions": "Unter eine hüfthohe Stange oder einen Tisch legen\nKörper gerade, Fersen am Boden\nBrust zur Stange ziehen\nLangsam ablassen"
  },
  {
   "key": "face_pull",
   "name": "Face Pull",
   "muscleGroup": "Schultern",
   "equipment": "Maschine/Kabel",
   "pattern": "PULL_H",
   "trackType": "WEIGHT_REPS",
   "instructions": "Seil auf Augenhöhe einhängen\nZum Gesicht ziehen, Ellbogen hoch\nHände außen neben die Ohren\nKontrolliert zurück"
  },
  {
   "key": "band_pullapart",
   "name": "Band Pull-Apart",
   "muscleGroup": "Schultern",
   "equipment": "Widerstandsband",
   "pattern": "RAISE",
   "trackType": "REPS",
   "instructions": "Band schulterbreit vor der Brust halten\nArme gestreckt auseinanderziehen\nSchulterblätter zusammen\nLangsam zurück"
  },
  {
   "key": "superman",
   "name": "Superman",
   "muscleGroup": "Rücken",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "REPS",
   "instructions": "Bauchlage, Arme nach vorne\nArme und Beine gleichzeitig anheben\nZwei Sekunden halten\nAblegen und wiederholen"
  },
  {
   "key": "ohp_bb",
   "name": "Schulterdrücken (Langhantel)",
   "muscleGroup": "Schultern",
   "equipment": "Langhantel",
   "pattern": "PUSH_V",
   "trackType": "WEIGHT_REPS",
   "instructions": "Stange auf Schulterhöhe, Griff etwas breiter als Schultern\nGesäß und Bauch anspannen\nSenkrecht über den Kopf drücken\nKontrolliert zurück zur Schulter"
  },
  {
   "key": "ohp_db",
   "name": "Kurzhantel-Schulterdrücken",
   "muscleGroup": "Schultern",
   "equipment": "Kurzhantel",
   "pattern": "PUSH_V",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln auf Schulterhöhe\nÜber Kopf drücken\nOben nicht zusammenschlagen\nLangsam absenken"
  },
  {
   "key": "arnold",
   "name": "Arnold Press",
   "muscleGroup": "Schultern",
   "equipment": "Kurzhantel",
   "pattern": "PUSH_V",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln vor dem Gesicht, Handflächen zu dir\nBeim Hochdrücken nach außen drehen\nOben Handflächen nach vorne\nRückwärts zurückdrehen"
  },
  {
   "key": "lateral_raise",
   "name": "Seitheben",
   "muscleGroup": "Schultern",
   "equipment": "Kurzhantel",
   "pattern": "RAISE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln seitlich, Ellbogen leicht gebeugt\nArme seitlich bis Schulterhöhe heben\nNicht schwingen\nLangsam absenken"
  },
  {
   "key": "front_raise",
   "name": "Frontheben",
   "muscleGroup": "Schultern",
   "equipment": "Kurzhantel",
   "pattern": "RAISE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln vor den Oberschenkeln\nArme gestreckt nach vorne bis Augenhöhe heben\nKurz halten\nKontrolliert ablassen"
  },
  {
   "key": "reverse_fly",
   "name": "Reverse Flys",
   "muscleGroup": "Schultern",
   "equipment": "Kurzhantel",
   "pattern": "RAISE",
   "trackType": "WEIGHT_REPS",
   "instructions": "Oberkörper vorgebeugt, Rücken gerade\nArme seitlich nach oben öffnen\nSchulterblätter zusammen\nLangsam absenken"
  },
  {
   "key": "pike_pushup",
   "name": "Pike-Liegestütz",
   "muscleGroup": "Schultern",
   "equipment": "Körpergewicht",
   "pattern": "PUSH_V",
   "trackType": "REPS",
   "instructions": "Hüfte hoch, Körper bildet ein umgedrehtes V\nKopf zwischen die Hände senken\nEllbogen nach hinten\nZurück nach oben drücken"
  },
  {
   "key": "curl_bb",
   "name": "Langhantel-Curl",
   "muscleGroup": "Bizeps",
   "equipment": "Langhantel",
   "pattern": "CURL",
   "trackType": "WEIGHT_REPS",
   "instructions": "Schulterbreiter Untergriff\nEllbogen am Körper fixieren\nStange zur Brust beugen\nLangsam ablassen"
  },
  {
   "key": "curl_db",
   "name": "Kurzhantel-Curl",
   "muscleGroup": "Bizeps",
   "equipment": "Kurzhantel",
   "pattern": "CURL",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln seitlich, Handflächen nach vorne\nAbwechselnd oder gleichzeitig beugen\nOben kurz anspannen\nKontrolliert strecken"
  },
  {
   "key": "hammer_curl",
   "name": "Hammer-Curl",
   "muscleGroup": "Bizeps",
   "equipment": "Kurzhantel",
   "pattern": "CURL",
   "trackType": "WEIGHT_REPS",
   "instructions": "Handflächen zeigen zueinander\nEllbogen ruhig halten\nHanteln zur Schulter beugen\nLangsam ablassen"
  },
  {
   "key": "conc_curl",
   "name": "Konzentrationscurl",
   "muscleGroup": "Bizeps",
   "equipment": "Kurzhantel",
   "pattern": "CURL",
   "trackType": "WEIGHT_REPS",
   "instructions": "Sitzend, Ellbogen an der Innenseite des Oberschenkels\nHantel zur Schulter beugen\nOben anspannen\nGanz strecken"
  },
  {
   "key": "tricep_pushdown",
   "name": "Trizepsdrücken am Kabel",
   "muscleGroup": "Trizeps",
   "equipment": "Maschine/Kabel",
   "pattern": "TRICEP",
   "trackType": "WEIGHT_REPS",
   "instructions": "Seil oder Stange oben am Kabel\nEllbogen eng am Körper\nNach unten strecken\nKontrolliert zurück bis 90 Grad"
  },
  {
   "key": "overhead_ext",
   "name": "Überkopf-Trizepsstrecken",
   "muscleGroup": "Trizeps",
   "equipment": "Kurzhantel",
   "pattern": "TRICEP",
   "trackType": "WEIGHT_REPS",
   "instructions": "Eine Hantel mit beiden Händen über dem Kopf\nHinter den Kopf absenken\nEllbogen zeigen nach vorne\nNach oben strecken"
  },
  {
   "key": "bench_dips",
   "name": "Bank-Dips",
   "muscleGroup": "Trizeps",
   "equipment": "Bank/Box",
   "pattern": "TRICEP",
   "trackType": "REPS",
   "instructions": "Hände hinter dir auf der Bankkante\nBeine gestreckt oder angewinkelt\nEllbogen bis 90 Grad beugen\nHochdrücken"
  },
  {
   "key": "plank",
   "name": "Unterarmstütz (Plank)",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "PLANK",
   "trackType": "TIME",
   "instructions": "Unterarme unter den Schultern\nKörper bildet eine gerade Linie\nBauch und Gesäß anspannen\nHalten und gleichmäßig atmen"
  },
  {
   "key": "side_plank",
   "name": "Seitstütz",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "PLANK",
   "trackType": "TIME",
   "instructions": "Seitlich auf einen Unterarm stützen\nHüfte anheben, Körper gerade\nHalten\nSeite wechseln"
  },
  {
   "key": "crunch",
   "name": "Crunch",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "REPS",
   "instructions": "Rückenlage, Füße aufgestellt\nHände an die Schläfen\nSchultern einrollend anheben\nLangsam ablegen"
  },
  {
   "key": "bicycle",
   "name": "Fahrrad-Crunch",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "REPS",
   "instructions": "Rückenlage, Beine angehoben\nEllbogen zum gegenüberliegenden Knie\nSeiten im Wechsel\nRücken bleibt am Boden"
  },
  {
   "key": "leg_raise",
   "name": "Beinheben hängend",
   "muscleGroup": "Bauch & Core",
   "equipment": "Klimmzugstange",
   "pattern": "PULL_V",
   "trackType": "REPS",
   "instructions": "An die Stange hängen\nBeine kontrolliert nach vorne heben\nNicht schwingen\nLangsam absenken"
  },
  {
   "key": "russian_twist",
   "name": "Russian Twist",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "REPS",
   "instructions": "Sitzend, Oberkörper leicht zurückgelehnt\nFüße optional anheben\nOberkörper links und rechts drehen\nRücken gerade halten"
  },
  {
   "key": "dead_bug",
   "name": "Dead Bug",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "REPS",
   "instructions": "Rückenlage, Arme und Beine in die Luft\nLendenwirbel in den Boden drücken\nGegenüberliegenden Arm und Bein strecken\nIm Wechsel wiederholen"
  },
  {
   "key": "bird_dog",
   "name": "Bird Dog",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "PLANK",
   "trackType": "REPS",
   "instructions": "Vierfüßlerstand\nRechten Arm und linkes Bein strecken\nKurz halten, Becken ruhig\nSeite wechseln"
  },
  {
   "key": "hollow_hold",
   "name": "Hollow Hold",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "CORE",
   "trackType": "TIME",
   "instructions": "Rückenlage, Lendenwirbel am Boden\nArme und Beine gestreckt anheben\nBananenform halten\nGleichmäßig atmen"
  },
  {
   "key": "mountain_climber",
   "name": "Mountain Climber",
   "muscleGroup": "Bauch & Core",
   "equipment": "Körpergewicht",
   "pattern": "PLANK",
   "trackType": "TIME",
   "instructions": "Hoher Liegestütz\nKnie abwechselnd zur Brust ziehen\nHüfte tief halten\nZügiges Tempo"
  },
  {
   "key": "jumping_jack",
   "name": "Hampelmann",
   "muscleGroup": "Ganzkörper",
   "equipment": "Körpergewicht",
   "pattern": "CARDIO",
   "trackType": "TIME",
   "instructions": "Aufrecht stehen\nBeine grätschen und Arme über den Kopf\nZurück in die Ausgangsposition\nLocker und rhythmisch"
  },
  {
   "key": "burpee",
   "name": "Burpee",
   "muscleGroup": "Ganzkörper",
   "equipment": "Körpergewicht",
   "pattern": "CARDIO",
   "trackType": "REPS",
   "instructions": "Aus dem Stand in die Hocke\nFüße in den Liegestütz springen\nFüße zurück zur Hocke\nStrecksprung nach oben"
  },
  {
   "key": "high_knees",
   "name": "Kniehebelauf",
   "muscleGroup": "Ganzkörper",
   "equipment": "Körpergewicht",
   "pattern": "CARDIO",
   "trackType": "TIME",
   "instructions": "Auf der Stelle laufen\nKnie bis Hüfthöhe heben\nArme aktiv mitnehmen\nAuf den Fußballen bleiben"
  },
  {
   "key": "jump_rope",
   "name": "Seilspringen",
   "muscleGroup": "Ganzkörper",
   "equipment": "Körpergewicht",
   "pattern": "CARDIO",
   "trackType": "TIME",
   "instructions": "Seil hinter dem Körper\nAus den Handgelenken drehen\nKleine Sprünge auf den Fußballen\nGleichmäßiger Rhythmus"
  },
  {
   "key": "thruster",
   "name": "Thruster (Kurzhantel)",
   "muscleGroup": "Ganzkörper",
   "equipment": "Kurzhantel",
   "pattern": "SQUAT",
   "trackType": "WEIGHT_REPS",
   "instructions": "Hanteln auf Schulterhöhe\nTiefe Kniebeuge\nBeim Aufstehen direkt über Kopf drücken\nZurück zur Schulter, nächste Wiederholung"
  },
  {
   "key": "farmers_walk",
   "name": "Farmer's Walk",
   "muscleGroup": "Ganzkörper",
   "equipment": "Kurzhantel",
   "pattern": "CARRY",
   "trackType": "TIME",
   "instructions": "Schwere Hanteln seitlich greifen\nAufrecht, Schultern zurück\nMit kurzen Schritten gehen\nRumpf fest, nicht schwanken"
  },
  {
   "key": "kb_clean_press",
   "name": "Kettlebell Clean & Press",
   "muscleGroup": "Ganzkörper",
   "equipment": "Kettlebell",
   "pattern": "PUSH_V",
   "trackType": "WEIGHT_REPS",
   "instructions": "Kettlebell zwischen den Füßen\nExplosiv zur Schulter umsetzen\nÜber Kopf drücken\nKontrolliert zurück"
  },
  {
   "key": "cat_cow",
   "name": "Katze-Kuh",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "STRETCH",
   "trackType": "TIME",
   "instructions": "Vierfüßlerstand\nEinatmen: Rücken senken, Blick nach vorn\nAusatmen: Rücken rund machen\nLangsam im Atemrhythmus"
  },
  {
   "key": "hip_flexor",
   "name": "Hüftbeuger-Dehnung",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "STRETCH",
   "trackType": "TIME",
   "instructions": "Halbkniestand, ein Knie am Boden\nBecken nach vorne schieben\nGesäß des hinteren Beins anspannen\n30–60 Sekunden pro Seite"
  },
  {
   "key": "worlds_greatest",
   "name": "Weltbeste Dehnung",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "STRETCH",
   "trackType": "TIME",
   "instructions": "Tiefer Ausfallschritt\nGleichseitigen Ellbogen zum Boden\nArm zur Decke aufdrehen\nSeiten im Wechsel"
  },
  {
   "key": "hamstring_stretch",
   "name": "Beinrückseiten-Dehnung",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "HINGE",
   "trackType": "TIME",
   "instructions": "Ein Bein gestreckt auf eine Erhöhung\nRücken gerade, aus der Hüfte vorbeugen\nDehnung halten\nSeite wechseln"
  },
  {
   "key": "chest_stretch",
   "name": "Brustdehnung an der Wand",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "RAISE",
   "trackType": "TIME",
   "instructions": "Unterarm an eine Wand oder Türrahmen\nOberkörper langsam wegdrehen\nDehnung in der Brust halten\nSeite wechseln"
  },
  {
   "key": "childs_pose",
   "name": "Kindhaltung",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "STRETCH",
   "trackType": "TIME",
   "instructions": "Kniestand, Gesäß auf die Fersen\nArme weit nach vorne strecken\nStirn ablegen\nTief in den Rücken atmen"
  },
  {
   "key": "hip_9090",
   "name": "90/90 Hüftrotation",
   "muscleGroup": "Mobilität",
   "equipment": "Körpergewicht",
   "pattern": "STRETCH",
   "trackType": "TIME",
   "instructions": "Sitzen, beide Knie 90 Grad gebeugt\nVorderes und hinteres Bein am Boden\nOberkörper aufrecht über das vordere Bein\nSeiten langsam wechseln"
  }
 ],
 "plans": [
  {
   "name": "Ganzkörper A",
   "description": "Grundübungen, 3× pro Woche im Wechsel mit B",
   "category": "Ganzkörper",
   "items": [
    {
     "key": "squat_bb",
     "sets": 3,
     "minReps": 5,
     "maxReps": 8,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "bench_bb",
     "sets": 3,
     "minReps": 5,
     "maxReps": 8,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "row_bb",
     "sets": 3,
     "minReps": 8,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "ohp_db",
     "sets": 2,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "plank",
     "sets": 3,
     "minReps": 30,
     "maxReps": 60,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Ganzkörper B",
   "description": "Ergänzung zu A mit Kreuzheben und Klimmzügen",
   "category": "Ganzkörper",
   "items": [
    {
     "key": "deadlift",
     "sets": 3,
     "minReps": 3,
     "maxReps": 6,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "incline_db",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "lat_pulldown",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "split_squat",
     "sets": 2,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "hammer_curl",
     "sets": 2,
     "minReps": 10,
     "maxReps": 15,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Push",
   "description": "Brust, Schultern, Trizeps",
   "category": "Push/Pull/Beine",
   "items": [
    {
     "key": "bench_bb",
     "sets": 4,
     "minReps": 6,
     "maxReps": 10,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "incline_db",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "ohp_db",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "lateral_raise",
     "sets": 3,
     "minReps": 12,
     "maxReps": 20,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "tricep_pushdown",
     "sets": 3,
     "minReps": 10,
     "maxReps": 15,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Pull",
   "description": "Rücken und Bizeps",
   "category": "Push/Pull/Beine",
   "items": [
    {
     "key": "pullup",
     "sets": 4,
     "minReps": 5,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "row_bb",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "cable_row",
     "sets": 3,
     "minReps": 10,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "face_pull",
     "sets": 3,
     "minReps": 12,
     "maxReps": 20,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "curl_bb",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "hammer_curl",
     "sets": 2,
     "minReps": 10,
     "maxReps": 15,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Beine",
   "description": "Beine, Gesäß, Waden, Core",
   "category": "Push/Pull/Beine",
   "items": [
    {
     "key": "squat_bb",
     "sets": 4,
     "minReps": 5,
     "maxReps": 8,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "rdl",
     "sets": 3,
     "minReps": 8,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "leg_press",
     "sets": 3,
     "minReps": 10,
     "maxReps": 15,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "split_squat",
     "sets": 2,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "calf_raise",
     "sets": 3,
     "minReps": 12,
     "maxReps": 20,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "leg_raise",
     "sets": 3,
     "minReps": 8,
     "maxReps": 15,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Zuhause ohne Geräte",
   "description": "Ganzkörper nur mit Körpergewicht",
   "category": "Zuhause",
   "items": [
    {
     "key": "air_squat",
     "sets": 3,
     "minReps": 15,
     "maxReps": 25,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "pushup",
     "sets": 3,
     "minReps": 8,
     "maxReps": 20,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "reverse_lunge",
     "sets": 3,
     "minReps": 10,
     "maxReps": 16,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "superman",
     "sets": 3,
     "minReps": 10,
     "maxReps": 15,
     "rest": 45,
     "superset": 0
    },
    {
     "key": "glute_bridge",
     "sets": 3,
     "minReps": 12,
     "maxReps": 20,
     "rest": 45,
     "superset": 0
    },
    {
     "key": "pike_pushup",
     "sets": 2,
     "minReps": 6,
     "maxReps": 12,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "plank",
     "sets": 3,
     "minReps": 30,
     "maxReps": 60,
     "rest": 45,
     "superset": 0
    }
   ]
  },
  {
   "name": "7-Minuten-Quick-Workout",
   "description": "12 Übungen à 30 Sekunden, 10 Sekunden Pause",
   "category": "Quick",
   "items": [
    {
     "key": "jumping_jack",
     "sets": 1,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "wall_sit",
     "sets": 1,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "pushup",
     "sets": 1,
     "minReps": 10,
     "maxReps": 15,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "crunch",
     "sets": 1,
     "minReps": 15,
     "maxReps": 20,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "step_up",
     "sets": 1,
     "minReps": 10,
     "maxReps": 15,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "air_squat",
     "sets": 1,
     "minReps": 15,
     "maxReps": 20,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "bench_dips",
     "sets": 1,
     "minReps": 10,
     "maxReps": 15,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "plank",
     "sets": 1,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "high_knees",
     "sets": 1,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "reverse_lunge",
     "sets": 1,
     "minReps": 10,
     "maxReps": 14,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "knee_pushup",
     "sets": 1,
     "minReps": 10,
     "maxReps": 15,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "side_plank",
     "sets": 1,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    }
   ]
  },
  {
   "name": "Mobilität 10 Minuten",
   "description": "Sanfte Routine für Hüfte, Rücken und Brust",
   "category": "Mobilität",
   "items": [
    {
     "key": "cat_cow",
     "sets": 1,
     "minReps": 60,
     "maxReps": 60,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "worlds_greatest",
     "sets": 1,
     "minReps": 60,
     "maxReps": 60,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "hip_flexor",
     "sets": 2,
     "minReps": 45,
     "maxReps": 45,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "hamstring_stretch",
     "sets": 2,
     "minReps": 45,
     "maxReps": 45,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "hip_9090",
     "sets": 1,
     "minReps": 60,
     "maxReps": 60,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "chest_stretch",
     "sets": 2,
     "minReps": 30,
     "maxReps": 30,
     "rest": 10,
     "superset": 0
    },
    {
     "key": "childs_pose",
     "sets": 1,
     "minReps": 60,
     "maxReps": 60,
     "rest": 0,
     "superset": 0
    }
   ]
  }
 ],
 "programs": [
  {
   "name": "5×5 A",
   "description": "Kraftprogramm für Einsteiger, 3× pro Woche im Wechsel mit B. Gewicht steigern, wenn alle 5×5 geschafft sind.",
   "category": "Programm 5×5",
   "items": [
    {
     "key": "squat_bb",
     "sets": 5,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "bench_bb",
     "sets": 5,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "row_bb",
     "sets": 5,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    }
   ]
  },
  {
   "name": "5×5 B",
   "description": "Wechsel mit A: Kniebeuge, Schulterdrücken, Kreuzheben (1×5).",
   "category": "Programm 5×5",
   "items": [
    {
     "key": "squat_bb",
     "sets": 5,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "ohp_bb",
     "sets": 5,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "deadlift",
     "sets": 1,
     "minReps": 5,
     "maxReps": 5,
     "rest": 180,
     "superset": 0
    }
   ]
  },
  {
   "name": "GZCLP Tag 1",
   "description": "T1 schwer 5×3, T2 mittel 3×10, T3 leicht 3×15–25.",
   "category": "Programm GZCLP",
   "items": [
    {
     "key": "squat_bb",
     "sets": 5,
     "minReps": 3,
     "maxReps": 3,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "bench_bb",
     "sets": 3,
     "minReps": 10,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "lat_pulldown",
     "sets": 3,
     "minReps": 15,
     "maxReps": 25,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "GZCLP Tag 2",
   "description": "T1 Schulterdrücken, T2 Kreuzheben, T3 Rudern.",
   "category": "Programm GZCLP",
   "items": [
    {
     "key": "ohp_bb",
     "sets": 5,
     "minReps": 3,
     "maxReps": 3,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "deadlift",
     "sets": 3,
     "minReps": 10,
     "maxReps": 10,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "row_db",
     "sets": 3,
     "minReps": 15,
     "maxReps": 25,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "GZCLP Tag 3",
   "description": "T1 Bankdrücken, T2 Kniebeuge, T3 Latzug.",
   "category": "Programm GZCLP",
   "items": [
    {
     "key": "bench_bb",
     "sets": 5,
     "minReps": 3,
     "maxReps": 3,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "squat_bb",
     "sets": 3,
     "minReps": 10,
     "maxReps": 10,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "lat_pulldown",
     "sets": 3,
     "minReps": 15,
     "maxReps": 25,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "GZCLP Tag 4",
   "description": "T1 Kreuzheben, T2 Schulterdrücken, T3 Rudern.",
   "category": "Programm GZCLP",
   "items": [
    {
     "key": "deadlift",
     "sets": 5,
     "minReps": 3,
     "maxReps": 3,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "ohp_bb",
     "sets": 3,
     "minReps": 10,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "row_db",
     "sets": 3,
     "minReps": 15,
     "maxReps": 25,
     "rest": 60,
     "superset": 0
    }
   ]
  },
  {
   "name": "Oberkörper",
   "description": "Ober-/Unterkörper-Split. Bizeps und Trizeps als Supersatz.",
   "category": "Programm OK/UK",
   "items": [
    {
     "key": "bench_bb",
     "sets": 4,
     "minReps": 6,
     "maxReps": 8,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "row_bb",
     "sets": 4,
     "minReps": 6,
     "maxReps": 8,
     "rest": 150,
     "superset": 0
    },
    {
     "key": "ohp_db",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "lat_pulldown",
     "sets": 3,
     "minReps": 8,
     "maxReps": 12,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "curl_db",
     "sets": 3,
     "minReps": 10,
     "maxReps": 12,
     "rest": 60,
     "superset": 1
    },
    {
     "key": "tricep_pushdown",
     "sets": 3,
     "minReps": 10,
     "maxReps": 12,
     "rest": 60,
     "superset": 1
    }
   ]
  },
  {
   "name": "Unterkörper",
   "description": "Ober-/Unterkörper-Split. Waden und Core als Supersatz.",
   "category": "Programm OK/UK",
   "items": [
    {
     "key": "squat_bb",
     "sets": 4,
     "minReps": 5,
     "maxReps": 8,
     "rest": 180,
     "superset": 0
    },
    {
     "key": "rdl",
     "sets": 3,
     "minReps": 8,
     "maxReps": 10,
     "rest": 120,
     "superset": 0
    },
    {
     "key": "leg_press",
     "sets": 3,
     "minReps": 10,
     "maxReps": 15,
     "rest": 90,
     "superset": 0
    },
    {
     "key": "leg_curl",
     "sets": 3,
     "minReps": 10,
     "maxReps": 15,
     "rest": 60,
     "superset": 0
    },
    {
     "key": "calf_raise",
     "sets": 3,
     "minReps": 12,
     "maxReps": 20,
     "rest": 60,
     "superset": 1
    },
    {
     "key": "plank",
     "sets": 3,
     "minReps": 30,
     "maxReps": 60,
     "rest": 60,
     "superset": 1
    }
   ]
  }
 ],
 "measurementKinds": [
  "Taille",
  "Brust",
  "Hüfte",
  "Oberarm",
  "Oberschenkel",
  "Wade",
  "Körperfett %"
 ]
};
