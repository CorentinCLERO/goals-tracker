# Backend Architecture

The Goals Tracker backend is built with **Spring Boot 4** and follows modern Java development practices.

## Technology Stack

- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Database**: PostgreSQL 14
- **ORM**: Spring Data JPA / Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security + JWT (jjwt 0.12.3)
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Testing**: Spring Boot Test + H2 (in-memory)

## Architecture Overview

The backend follows a layered architecture pattern:

```
┌─────────────────────────────────────┐
│         Controllers (REST)          │  ← HTTP Layer
├─────────────────────────────────────┤
│            Services                 │  ← Business Logic
├─────────────────────────────────────┤
│          Repositories               │  ← Data Access
├─────────────────────────────────────┤
│         JPA / Hibernate             │  ← ORM
├─────────────────────────────────────┤
│          PostgreSQL                 │  ← Database
└─────────────────────────────────────┘
```

## Project Structure

```
src/main/java/com/example/goals_tracker/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── OpenApiConfig.java
├── controller/          # REST Controllers
│   ├── AuthController.java
│   ├── GoalController.java
│   ├── HabitController.java
│   └── UserController.java
├── dto/                # Data Transfer Objects
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── GoalRequest.java
│   └── response/
│       ├── AuthResponse.java
│       └── GoalResponse.java
├── exception/          # Exception Handling
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── BadRequestException.java
├── model/             # JPA Entities
│   ├── User.java
│   ├── Goal.java
│   ├── GoalStep.java
│   ├── Habit.java
│   └── HabitLog.java
├── repository/        # Spring Data Repositories
│   ├── UserRepository.java
│   ├── GoalRepository.java
│   └── HabitRepository.java
├── service/          # Business Logic
│   ├── AuthService.java
│   ├── GoalService.java
│   ├── HabitService.java
│   └── UserService.java
└── security/         # Security Components
    ├── JwtTokenProvider.java
    ├── JwtAuthenticationFilter.java
    └── UserDetailsServiceImpl.java

src/main/resources/
├── application.properties
└── db/migration/      # Flyway SQL Scripts
    ├── V1__init_schema.sql
    ├── V2__add_goals.sql
    └── V3__add_habits.sql
```

## Core Components

### 1. Controllers

REST endpoints that handle HTTP requests and responses.

**Example**: `GoalController.java`
```java
@RestController
@RequestMapping("/api/goals")
public class GoalController {
    
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAllGoals() {
        // Returns list of goals
    }
    
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody GoalRequest request) {
        // Creates a new goal
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoal(@PathVariable Long id) {
        // Returns a single goal
    }
}
```

### 2. Services

Business logic layer that processes data and enforces business rules.

**Example**: `GoalService.java`
```java
@Service
public class GoalService {
    
    public GoalResponse createGoal(GoalRequest request, User user) {
        // Validate input
        // Create goal entity
        // Save to database
        // Return DTO
    }
    
    public void calculateProgress(Goal goal) {
        // Calculate completion percentage
        // Update goal progress
    }
}
```

### 3. Repositories

Data access layer using Spring Data JPA.

**Example**: `GoalRepository.java`
```java
@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    
    List<Goal> findByUserId(Long userId);
    
    List<Goal> findByUserIdAndStatus(Long userId, GoalStatus status);
    
    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.dueDate < :date")
    List<Goal> findOverdueGoals(@Param("userId") Long userId, @Param("date") LocalDate date);
}
```

### 4. Models (Entities)

JPA entities that map to database tables.

**Example**: `Goal.java`
```java
@Entity
@Table(name = "goals")
public class Goal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    private GoalStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL)
    private List<GoalStep> steps;
    
    private LocalDate startDate;
    private LocalDate dueDate;
    private Integer progress;
}
```

## Security Architecture

### JWT Authentication Flow

```
1. User logs in with credentials
2. Backend validates credentials
3. JWT token generated and returned
4. Client stores token (localStorage/cookie)
5. Client sends token in Authorization header
6. JwtAuthenticationFilter validates token
7. Request proceeds if valid
```

### Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## Database Schema

### Main Tables

**users**
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- created_at
- updated_at

**goals**
- id (PK)
- user_id (FK)
- title
- description
- priority (enum)
- status (enum)
- category
- start_date
- due_date
- progress
- created_at
- updated_at

**goal_steps**
- id (PK)
- goal_id (FK)
- title
- due_date
- completed
- completed_at
- created_at

**habits**
- id (PK)
- user_id (FK)
- name
- description
- frequency (enum)
- times_per_week
- category
- start_date
- active
- created_at

**habit_logs**
- id (PK)
- habit_id (FK)
- date
- completed
- completed_at

## API Design

### RESTful Principles

- **Resources**: Goals, Habits, Users
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 404, 500
- **Content-Type**: application/json

### Example Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/goals             - Get all goals
POST   /api/goals             - Create goal
GET    /api/goals/{id}        - Get goal by ID
PUT    /api/goals/{id}        - Update goal
DELETE /api/goals/{id}        - Delete goal
POST   /api/goals/{id}/steps  - Add step to goal
GET    /api/habits            - Get all habits
POST   /api/habits/{id}/log   - Log habit completion
GET    /api/habits/{id}/stats - Get habit statistics
```

### Response Format

**Success Response:**
```json
{
  "id": 1,
  "title": "Learn Spanish",
  "description": "Become fluent in Spanish",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "progress": 45,
  "dueDate": "2026-12-31"
}
```

**Error Response:**
```json
{
  "timestamp": "2026-01-23T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Goal not found with id: 123",
  "path": "/api/goals/123"
}
```

## Database Migrations

Flyway manages database schema versioning:

**V1__init_schema.sql**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Unit Tests

```java
@SpringBootTest
class GoalServiceTest {
    
    @Mock
    private GoalRepository goalRepository;
    
    @InjectMocks
    private GoalService goalService;
    
    @Test
    void shouldCreateGoal() {
        // Arrange
        GoalRequest request = new GoalRequest();
        request.setTitle("Test Goal");
        
        // Act
        GoalResponse response = goalService.createGoal(request, user);
        
        // Assert
        assertNotNull(response);
        assertEquals("Test Goal", response.getTitle());
    }
}
```

### Integration Tests

```java
@SpringBootTest
@AutoConfigureMockMvc
class GoalControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldGetAllGoals() throws Exception {
        mockMvc.perform(get("/api/goals")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
```

## Configuration

### Application Properties

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

## Performance Optimization

- **Lazy Loading**: Use `@ManyToOne(fetch = FetchType.LAZY)`
- **Caching**: Add `@Cacheable` for frequently accessed data
- **Pagination**: Use `Pageable` for large result sets
- **Indexing**: Add database indexes on frequently queried columns
- **Connection Pooling**: HikariCP (default in Spring Boot)

## Swagger Documentation

Access interactive API documentation at:
- http://localhost:8080/swagger-ui.html

Configure in `OpenApiConfig.java`:
```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Goals Tracker API")
                .version("1.0")
                .description("API for managing goals and habits"));
    }
}
```

## Next Steps

- Learn about [Frontend Architecture](frontend.md)
- Explore [Backend Development](../development/backend.md)
- Check [API Reference](../api/authentication.md)
