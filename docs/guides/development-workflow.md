# Development Workflow

This guide outlines the development workflow and best practices for contributing to FocusMaster.

##  Git Workflow

We follow a **feature branch workflow** with the following branch structure:

### Branch Types

```
main              → Production-ready code
├── develop       → Integration branch (future)
├── feature/*     → New features
├── fix/*         → Bug fixes
├── hotfix/*      → Critical production fixes
└── maintenance   → Maintenance and updates
```

### Branch Naming Convention

```
feature/add-dark-mode-toggle
feature/spotify-integration
fix/session-api-500-error
fix/timer-countdown-bug
hotfix/critical-security-patch
maintenance/update-dependencies
```

---

##  Commit Message Guidelines

We follow **Conventional Commits** for clear and consistent commit history.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(timer): add customizable session durations"

# Bug fix
git commit -m "fix: add missing session CRUD endpoints

Add GET, PATCH, DELETE routes for /api/sessions/:id
Fixes 500 error when updating sessions from frontend"

# Documentation
git commit -m "docs: add API reference for sessions endpoint"

# Refactor
git commit -m "refactor(auth): simplify token validation logic"
```

---

##  Development Process

### 1. Create a New Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

```bash
# Make code changes
# ...

# Stage your changes
git add .

# Commit with a meaningful message
git commit -m "feat: add your feature description"
```

### 3. Keep Your Branch Updated

```bash
# Fetch latest changes from main
git fetch origin main

# Rebase your branch on top of main
git rebase origin/main

# Or merge main into your branch
git merge origin/main
```

### 4. Push Your Branch

```bash
# First push
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### 5. Create a Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What, why, and how
   - **Screenshots**: If UI changes
   - **Testing**: Steps to test
4. Request reviews
5. Address feedback
6. Merge when approved

---

##  Testing Workflow

### Before Committing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test
```

### Test-Driven Development (TDD)

1. **Write test first**
   ```javascript
   // session.test.js
   describe('Session API', () => {
     it('should update session mood', async () => {
       // Test implementation
     });
   });
   ```

2. **Run test** (it should fail)
   ```bash
   npm test
   ```

3. **Write code** to make it pass

4. **Refactor** while keeping tests green

---

##  Code Review Guidelines

### For Authors

- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console.log or debug code
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] PR description is complete

### For Reviewers

Focus on:
- **Logic**: Does the code do what it's supposed to?
- **Security**: Any vulnerabilities?
- **Performance**: Any bottlenecks?
- **Readability**: Is it easy to understand?
- **Testing**: Are there adequate tests?

---

##  Code Style Guidelines

### TypeScript/JavaScript

```typescript
// Good: Use descriptive names
const getUserSessions = async (userId: string) => {
  // ...
};

// Bad: Unclear names
const getData = async (id: string) => {
  // ...
};

// Good: Early returns
const validateUser = (user) => {
  if (!user) return false;
  if (!user.email) return false;
  return true;
};

// Bad: Nested conditions
const validateUser = (user) => {
  if (user) {
    if (user.email) {
      return true;
    }
  }
  return false;
};
```

### React Components

```tsx
// Good: Named exports, clear props
interface TimerProps {
  duration: number;
  onComplete: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  // Implementation
};

// Good: Extract complex logic to custom hooks
const useTimer = (duration: number) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  // Hook logic
  return { timeLeft, start, pause, reset };
};
```

---

##  Development Tools

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "mongodb.mongodb-vscode"
  ]
}
```

### Editor Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

##  Release Process

### Version Numbering (Semantic Versioning)

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (Patch: Bug fixes)
1.0.1 → 1.1.0  (Minor: New features, backward compatible)
1.1.0 → 2.0.0  (Major: Breaking changes)
```

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped in package.json
- [ ] Tagged in Git
- [ ] Deployed to production
- [ ] Smoke tests on production

---

##  Bug Fix Workflow

### 1. Reproduce the Bug

```bash
# Create a test that reproduces the bug
describe('Bug: Session update fails', () => {
  it('should update session without error', async () => {
    // Test that currently fails
  });
});
```

### 2. Create Fix Branch

```bash
git checkout -b fix/session-update-500-error
```

### 3. Fix the Bug

```javascript
// Fix the issue
// Make sure the test now passes
```

### 4. Commit with Issue Reference

```bash
git commit -m "fix: add missing session CRUD endpoints

Fixes #123"
```

---

##  Performance Optimization Workflow

### 1. Identify Bottleneck

```bash
# Use React DevTools Profiler
# Use Chrome DevTools Performance tab
# Check Network tab for slow requests
```

### 2. Benchmark Before

```javascript
console.time('fetchSessions');
await fetchSessions();
console.timeEnd('fetchSessions');
// fetchSessions: 1234ms
```

### 3. Optimize

```javascript
// Example: Add memoization
const MemoizedComponent = React.memo(ExpensiveComponent);

// Example: Use pagination
const sessions = await Session.find()
  .limit(20)
  .skip(page * 20);
```

### 4. Benchmark After

```javascript
console.time('fetchSessions');
await fetchSessions();
console.timeEnd('fetchSessions');
// fetchSessions: 234ms Improved!
```

---

##  Security Workflow

### Security Checklist

- [ ] Never commit `.env` files
- [ ] Sanitize user inputs
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Keep dependencies updated
- [ ] Use HTTPS in production
- [ ] Implement CSRF protection
- [ ] Validate JWT tokens properly

### Dependency Audits

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force
```

---

##  Documentation Workflow

### When to Update Docs

- Adding new API endpoints → Update `docs/api/`
- Changing database schema → Update `docs/architecture/database-schema.md`
- Adding new features → Update relevant guides
- Fixing bugs → Update troubleshooting guide if needed

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add diagrams where helpful (Mermaid)
- Keep examples up to date
- Link related documentation

---

##  Collaboration Best Practices

### Communication

- Comment on PRs promptly
- Be respectful and constructive
- Ask questions when unclear
- Explain your reasoning

### Code Sharing

```bash
# Share your branch
git push origin feature/your-feature

# Pull someone else's branch
git fetch origin
git checkout their-branch-name
```

---

##  CI/CD Pipeline (Future)

### Planned Automation

```yaml
# .github/workflows/ci.yml (planned)
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Run linter
        run: npm run lint
```

---

**Remember**: Good code is not just working code, it's maintainable, tested, and well-documented code! 🚀
