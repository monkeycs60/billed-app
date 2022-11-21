 # Titre 
__Billed App__

Lien vers l'application [Billed-App](https://monkeycs60.github.io/billed-app/Billed-app-FR-Front/index.html)

## Description
Solution RH dont le but est de gérer les notes de frais des employés d'une entreprise.
Le but est de permettre à l'employé de saisir ses notes de frais et de les envoyer à son manager pour validation.
Le manager pourra ensuite valider ou non les notes de frais de son employé.

L'objectif de ce projet est de prendre en main les tests unitaires et les tests d'intégration avec Jest.

Comment lancer le projet ?

étape 1 - lancer le back-end

1)      $ cd Billed-app-FR-Back

2)      $ npm run run:dev


étape 2 - Lancer le front-end :
Allez au repo cloné :

1)      $ cd Billed-app-FR-Front

Installez les packages npm (décrits dans package.json) :

2)      $ npm install

Installez live-server pour lancer un serveur local :

3)      $ npm install -g live-server

Lancez l'application :

4)      $ live-server


Puis allez à l'adresse : http://127.0.0.1:8080/

Comment lancer tous les tests en local avec Jest ?
-       $ npm run test

Comment lancer un seul test ?
Installez jest-cli :
-       $npm i -g jest-cli
-       $jest src/__tests__/your_test_file.js

Comment voir la couverture de test ?
http://127.0.0.1:8080/coverage/lcov-report/

Comptes et utilisateurs :
Vous pouvez vous connecter en utilisant les comptes:

administrateur :
utilisateur : admin@test.tld 
mot de passe : admin
employé :
utilisateur : employee@test.tld
mot de passe : employee



