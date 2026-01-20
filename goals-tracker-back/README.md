# Goals Tracker - Backend

## 📖 Description

**Goals Tracker** est une application de gestion d'objectifs et d'habitudes permettant aux utilisateurs de créer, suivre et organiser leurs objectifs personnels. Ce backend fournit une API REST complète avec authentification JWT et système de gamification.

## 🛠️ Technologies utilisées

- **Framework** : Spring Boot 4.0.1
- **Langage** : Java 17
- **Base de données** : PostgreSQL
- **Migrations** : Flyway
- **Sécurité** : Spring Security + JWT (jjwt 0.12.3)
- **ORM** : Spring Data JPA
- **Documentation** : SpringDoc OpenAPI (Swagger)
- **Tests** : Spring Boot Test + H2 (base en mémoire)
- **Build** : Maven
- **Conteneurisation** : Docker
- **Outils** : Lombok, DevTools

## 🚀 Prérequis

- **Java 17** ou plus récent
- **Maven** 3.6+
- **Docker**

### Base de données

1. Les migrations Flyway s'exécuteront automatiquement au démarrage.

## 🏃‍♂️ Installation et démarrage

### Lancer la base de données

```bash
docker compose up db
```

### Avec Maven

```bash
# Cloner le projet
git clone <repository-url>
cd goals-tracker-back

# Copier le fichier .env.example
cp .env.example .env

# Exporter les variables d'environnement
export $(cat .env | grep -v "#" | xargs)

# Installer les dépendances
./mvnw clean install

# Démarrer l'application
./mvnw spring-boot:run
```

### Avec Docker

```bash
# Lancement avec docker-compose
docker-compose up --build
```

L'application sera accessible sur `http://localhost:8080`

## 📚 Documentation API

### Swagger UI

Une fois l'application démarrée, accédez à la documentation interactive :

- **Swagger UI** : `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON** : `http://localhost:8080/v3/api-docs`

## 📁 Structure du projet

```
src/
├── main/
│   ├── java/com/example/goals_tracker/
│   │   ├── config/          # Configuration Spring Security, CORS
│   │   ├── controller/      # Contrôleurs REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── exception/      # Gestion des exceptions
│   │   ├── model/          # Entités JPA
│   │   ├── repository/     # Repositories Spring Data
│   │   └── service/        # Logique métier
│   └── resources/
│       ├── db/migration/   # Scripts Flyway
│       └── application.properties
└── test/                   # Tests unitaires et d'intégration
```

## 🧪 Tests

```bash
# Exécuter tous les tests
./mvnw test
```

## 🐳 Docker

Le Dockerfile permet de conteneuriser l'application :

```bash
# Build
docker build -t goals-tracker-backend .

# Run
docker run -p 8080:8080 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=user \
  -e DATABASE_PASSWORD=password \
  -e DATABASE_NAME=goals_tracker_db \
  goals-tracker-backend
```
