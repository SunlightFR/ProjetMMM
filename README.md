# Vidéo

Voici le lien Google Drive de la vidéo (elle était trop lourde pour Github) : https://drive.google.com/file/d/1py3C6hojs05O2BKJaHhM9r-bj4Gwybt4/view?usp=sharing.

# Note sur le travail
Dû à ma situation, je n'ai pas pu travailler autant que je l'ai voulu.

J'ai également travaillé seul, sans binôme.

J'ai fait des pauses forcées parfois de plusieurs semaines, et je n'ai donc pas pu implémenter tout ce que j'aurais voulu. Néanmoins toutes les fonctionnalités demandées dans le sujet l'ont été.

Tout le code a été conçu pour supporter un changement de thème de couleur (sombre/clair) et de langue (tous les textes de l'application sont en français et en anglais) mais je n'ai pas eu le temps d'implémenter ce changement de thème et de langue.


# Fonctionnalités implémentées

## Connection
- Inscription avec nom, email, mot de passe et choix du rôle (chef de chantier ou responsable).
- Connexion avec email et mot de passe
- Déconnexion

## Fonctionnalités communes
Tous les utilisateurs peuvent :
- Voir et poster des photos du chantier
- Voir les informations du client (incluses dans le chantier) et notamment l'appeler

## Responsable des chantiers
Le responsable des chantiers peut :
- Créer un chantier
- Modifier un chantier
- Voir et poster des photos du chantier
- Voir les anomalies d'un chantier
- Sélectionner et modifier les resources allouées à un chantier
- Allouer un chef à un chantier.
- Modifier le statut d'un chantier (en cours, terminé, arrêté, etc)

## Chef de chantier
Le chef de chantier peut :
- Voir les chantiers dont il est le chef, ainsi que leurs resources
- Voir et poster des photos du chantier
- Signaler une anomalie sur un chantier

# Explications techniques

## Mise en contact du responsable et des chefs de projets 
Lors de la création de son compte, un chef de chantier obtient un code unique qu'il doit transmettre à son responsable afin que ce dernier puisse lui affecter des chantiers.

Lors de la création d'un chantier, le responsable doit choisir un chef en saisissant ce code secret. Le chef est alors enregistré comme contact du responsable. Une vérification de sa disponibilité est effectuée.

## Resources
Les resources sont créées par le responsable lorsqu'il crée son chantier. Chacune est enregistrée et peut être utilisée pour d'autres chantiers. Leur disponibilité est vérifiée. 

Une resource appartient à un type (outil, véhicule...) et possède simplement un nom (par exemple "Camion 1"). Les équipiers sont considérés comme une resource et n'ont pas de compte utilisateur.

## Chantier
Les données d'un chantier sont les suivantes :
- Titre
- Statut (en cours, arrêté, terminé, pas encore commencé)
- Nom du client
- Numéro du client
- Lieu du chantier 
- Date du début
- Demi-journée de début : matin ou après-midi
- Durée en demi-journées
- Chef de chantier
- Responsable du chantier
- Ressources du chantier

Sur la page de l'application affichant toutes ces informations :
- A côté du numéro du client, un bouton "Appeler" lance l'application téléphone avec le numéro, il n'y a plus qu'à cliquer sur "appeler" pour appeler le client.
- En plus d'afficher la date de début et les demi-journées, la date de fin est calculée et affichée.
- Le responsable voit le nom du chef et pas le sien, et inversement le chef ne voit que le nom du responsable.

## Gestion des données

### Une note sur les traductions des concepts
J'ai programmé en anglais, il a donc fallu traduire les concepts :
- chantier : project
- chef de chantier : (project) manager
- responsable des chantiers : (project) supervisor
- anomalie : problem

### Une note sur le back-end
J'ai utilisé Appwrite et son service de base de données, qui est une base de données relationnelles. Une "collection" appwrite correspond à une table dans une base de données relationnelle.

Chaque ligne de chaque collection a un ID propre. Ainsi quand je dis qu'un chantier contient un chef, cela signifie que dans la colonne "chef" se trouve l'ID du chef.

### Données
Les données des chantiers décrites ci-dessous sont stockées dans la base de données, dans une collection "projects".
Les données des utilisateurs (nom et rôle) sont stockées dans une collection "users". Il y a une colonne "contacts" qui n'est remplie que pour les responsables. Elle contient un tableau d'IDs des chefs enregistrés par un superviseur.
Les données des anomalies sont les suivantes :
- date de signalement
- titre
- description éventuelle
- et dans la base de données, l'ID du chantier auquel il se rattache

# Description de l'application
Voici les pages de l'application :
- Page d'accueil si non connecté : formulaire de connexion ou d'inscription
- Page d'accueil si connecté : affichage de jusqu'à deux chantiers ayant pour statut "en cours" avec un bouton menant à une page où ils apparaissent tous.

Ils apparaissent sous la forme de carte avec seulement les informations importantes, à savoir le nom du chantier, le nom et le numéro du client, le lieu, le statut et le nombre d'anomalies.

Quand on clique sur une carte, on arrive sur une page affichant cette fois toutes les données du chantier, mais aussi :
- Les anomalies
- Un bouton pour signaler une nouvelle anomalie (seulement pour les chefs)
- Les photos
- - Lorsque l'on clique sur une photo, cela permet de lui faire prendre la taille de l'écran et de voir les autres en swipant, comme dans l'application galerie.
- Un bouton pour prendre une nouvelle photo
- Les resources
- Pour les responsables, en haut, une icône menant à la page d'édition de chantier. A noter que cette même page permet de modifier ou de créer un chantier.
- Et comme dit précédemment, un bouton pour appeler le client.

Il y a également une page de paramètres, ne contenant qu'un bouton pour se déconnecter.