# **Savasana**

---

## **Pré-requis**

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **MySQL**
- **NodeJS 16**
- **Angular CLI 14**
- **Java 11**

---

## **Cloner le projet**

Depuis un terminal, placez-vous dans le dossier où vous souhaitez récupérer les sources, puis exécutez la commande suivante :

```bash
git clone https://github.com/WassimZerouta/Savasana
```

## **Installation de l’application**

### **Frontend :**
1. Ouvrez un terminal et placez-vous dans le répertoire **front** :
   ```bash
   cd front
   ```

2. Installez les dépendances avec :
   ```bash
   npm install
   ```

### **Backend :**
1. Placez-vous dans le répertoire **back** :
   ```bash
   cd back
   ```

2. Compilez le projet pour vérifier que tout est correctement configuré :
   ```bash
   mvn clean install
   ```

---

## **Démarrer l’application**

### **Frontend :**
- Depuis le répertoire **front**, lancez l’application avec :
  ```bash
  npm run start
  ```

- L’interface utilisateur sera disponible à : [http://localhost:4200](http://localhost:4200)

### **Backend :**
- Depuis le répertoire **back**, démarrez l’API avec :
  ```bash
  mvn spring-boot:run
  ```

- L’API sera accessible à : [http://localhost:8080](http://localhost:8080)

---

## **Exécution des tests**

### **Frontend :**
- Lancez les tests avec la commande suivante :
  ```bash
  npm run test
  ```
- Le code coverage avec la commande suivante :
  ```bash
  npm run test:coverage
  ```  

### **Tests end-to-end :**
- Lancer les tests avec :
  ```bash
  npm run e2e
  ```

- Une fois Cypress lancé, choisissez un navigateur de test, puis cliquez sur le fichier `all.cy.ts` pour exécuter tous les tests.

  - Pour lancer le code coverage:
  ```bash
  npm run e2e:coverage
  ```

### **Backend :**
- Exécutez les tests du backend avec :
  ```bash
  mvn clean test
  ```

  - Le code coverage du backend est accessible en ouvrant le fichier suivant dans le navigateur :
  ```bash
   back/target/site/jacoco/index.html
  ```
