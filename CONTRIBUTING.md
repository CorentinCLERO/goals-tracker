# Contributing to Goals Tracker

Thank you for your interest in contributing to Goals Tracker! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **Docker** and **Docker Compose**
- **Git**
- **Maven** (or use the included wrapper)
- **Python 3.11+** (for documentation)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/goals-tracker.git
   cd goals-tracker
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/goals-tracker.git
   ```

## Development Setup

### Quick Start with Docker Compose

The easiest way to get started:

```bash
# Start all services
docker compose up

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:8080
# Docs:     http://localhost:8001
```

### Local Development Setup

#### Backend Setup

```bash
cd goals-tracker-back

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start database only
docker compose up db

# Run backend
./mvnw spring-boot:run
```

#### Frontend Setup

```bash
cd goals-tracker-front

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Documentation Setup

```bash
cd docs/goal-tracker

# Install dependencies
pip install -r requirements.txt

# Serve documentation
mkdocs serve
```

## How to Contribute

### 1. Find or Create an Issue

- Browse [existing issues](https://github.com/OWNER/goals-tracker/issues)
- Comment on an issue to indicate you're working on it
- Create a new issue if needed

### 2. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Write clear, concise code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Backend tests
cd goals-tracker-back
./mvnw test

# Frontend linting and build
cd goals-tracker-front
npm run lint
npm run build

# Documentation build
cd docs/goal-tracker
mkdocs build --strict
```

### 5. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add user profile page"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## Coding Standards

### Backend (Java/Spring Boot)

#### Code Style

- **Indentation**: 4 spaces
- **Line length**: Max 120 characters
- **Naming conventions**:
  - Classes: `PascalCase`
  - Methods/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Packages: `lowercase`

#### Best Practices

```java
// ✅ Good
@Service
public class GoalService {
    private final GoalRepository goalRepository;
    
    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }
    
    public GoalResponse createGoal(GoalRequest request, User user) {
        validateRequest(request);
        Goal goal = mapToEntity(request);
        goal.setUser(user);
        Goal savedGoal = goalRepository.save(goal);
        return mapToResponse(savedGoal);
    }
}

// ❌ Bad - No validation, unclear naming
@Service
public class GoalService {
    @Autowired
    private GoalRepository repo;
    
    public Goal create(GoalRequest r) {
        return repo.save(new Goal(r));
    }
}
```

#### Structure

- Use constructor injection (not `@Autowired` on fields)
- Keep controllers thin - business logic in services
- Use DTOs for API requests/responses
- Add proper exception handling
- Write unit tests for services

### Frontend (React/TypeScript)

#### Code Style

- **Indentation**: 2 spaces
- **Line length**: Max 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Required

#### Naming Conventions

```typescript
// Components: PascalCase
export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  // ...
};

// Hooks: camelCase with 'use' prefix
export const useGoals = () => {
  // ...
};

// Types/Interfaces: PascalCase
interface Goal {
  id: number;
  title: string;
}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

#### Best Practices

```typescript
// ✅ Good
interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(goal);
  }, [goal, onEdit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{goal.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleEdit}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(goal.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// ❌ Bad - No types, unclear handlers
export const GoalCard = ({ goal, edit, del }) => {
  return (
    <div>
      <h2>{goal.title}</h2>
      <button onClick={() => edit(goal)}>Edit</button>
      <button onClick={() => del(goal.id)}>Delete</button>
    </div>
  );
};
```

#### Component Organization

```
src/features/goals/
├── components/
│   ├── GoalCard.tsx        # Individual components
│   ├── GoalList.tsx
│   └── GoalForm.tsx
├── hooks/
│   └── useGoals.ts         # Custom hooks
├── services/
│   └── goalService.ts      # API calls
└── types/
    └── goal.types.ts       # TypeScript types
```

### Documentation (Markdown)

- Use ATX-style headers (`#` not `===`)
- One blank line before/after headers
- Use fenced code blocks with language specified
- Keep line length reasonable (wrap at ~80-100 chars)
- Use meaningful link text (not "click here")

```markdown
<!-- ✅ Good -->
## Installation

To install the dependencies:

```bash
npm install
```

For more information, see the [setup guide](setup.md).

<!-- ❌ Bad -->
## installation
To install the dependencies:
```
npm install
```
Click [here](setup.md) for more info.
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (deps, build config)
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(goals): add progress calculation"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs: update installation instructions"

# Multiple paragraphs
git commit -m "feat(habits): add streak tracking

- Calculate current streak
- Track best streak
- Display streak badges

Closes #123"
```

### Scope

Use the component/feature name:
- `auth`, `goals`, `habits`, `profile`
- `backend`, `frontend`, `docs`
- `ci`, `docker`, `database`

## Pull Request Process

### Before Submitting

1. ✅ **Update your branch** with latest main
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. ✅ **Run all tests**
   ```bash
   # Backend
   cd goals-tracker-back && ./mvnw test
   
   # Frontend
   cd goals-tracker-front && npm run lint && npm run build
   
   # Documentation
   cd docs/goal-tracker && mkdocs build --strict
   ```

3. ✅ **Update documentation** if needed

4. ✅ **Write a clear PR description**

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Documentation builds
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Address feedback** and update PR
4. **Approval** from maintainer
5. **Merge** (squash and merge)

### After Merge

- Delete your feature branch
- Update your local main branch
- Celebrate! 🎉

## Testing

### Backend Testing

#### Unit Tests

```java
@SpringBootTest
class GoalServiceTest {
    
    @Mock
    private GoalRepository goalRepository;
    
    @InjectMocks
    private GoalService goalService;
    
    @Test
    void shouldCreateGoal() {
        // Given
        GoalRequest request = new GoalRequest();
        request.setTitle("Learn Java");
        
        Goal goal = new Goal();
        goal.setId(1L);
        goal.setTitle("Learn Java");
        
        when(goalRepository.save(any(Goal.class))).thenReturn(goal);
        
        // When
        GoalResponse response = goalService.createGoal(request, user);
        
        // Then
        assertNotNull(response);
        assertEquals("Learn Java", response.getTitle());
        verify(goalRepository).save(any(Goal.class));
    }
}
```

#### Integration Tests

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

### Frontend Testing

```typescript
import { render, screen } from '@testing-library/react';
import { GoalCard } from './GoalCard';

describe('GoalCard', () => {
  const mockGoal: Goal = {
    id: 1,
    title: 'Test Goal',
    priority: Priority.HIGH,
    status: GoalStatus.IN_PROGRESS,
  };

  it('renders goal title', () => {
    render(<GoalCard goal={mockGoal} />);
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<GoalCard goal={mockGoal} onEdit={onEdit} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockGoal);
  });
});
```

### Test Coverage

Aim for:
- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 70% code coverage
- **Critical paths**: 100% coverage

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Add new API endpoints
- Modify configuration
- Change deployment process

### Documentation Structure

```
docs/goal-tracker/docs/
├── getting-started/    # Installation, quick start
├── architecture/       # System design, components
├── development/        # Developer guides
├── ci-cd/             # CI/CD, deployment
└── api/               # API reference
```

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add diagrams for complex concepts
- Keep it up to date with code changes
- Test commands before documenting them

### Building Documentation Locally

```bash
cd docs/goal-tracker

# Install dependencies
pip install -r requirements.txt

# Serve with live reload
mkdocs serve

# Build static site
mkdocs build --strict
```

## Issue Reporting

### Before Creating an Issue

1. Search existing issues
2. Check if it's already fixed in main
3. Gather relevant information

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 22.04]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.2.3]

## Screenshots
[Add screenshots]

## Additional Context
Any other relevant information
```

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, references
```

## Getting Help

### Communication Channels

- **Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Pull Requests**: For code reviews

### Useful Resources

- [Project README](README.md)
- [Documentation](docs/goal-tracker/docs/index.md)
- [API Documentation](http://localhost:8080/swagger-ui.html)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits

Thank you for contributing to Goals Tracker! 🎉

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
