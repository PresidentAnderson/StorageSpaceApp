# Contributing to StorageSpace

Thank you for your interest in contributing to StorageSpace! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./docs/contributing/code-of-conduct.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Device/OS information**
- **App version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Possible implementation approach**
- **Alternative solutions considered**

### Pull Requests

1. **Fork the repository** and create your branch from `development`
2. **Write clear, concise commit messages** following [Conventional Commits](https://www.conventionalcommits.org/)
3. **Include tests** for new functionality
4. **Update documentation** as needed
5. **Ensure all tests pass** before submitting
6. **Submit a pull request** to the `development` branch

## Development Process

### 1. Setting Up Your Environment

```bash
# Clone your fork
git clone https://github.com/your-username/storagespace.git
cd storagespace

# Add upstream remote
git remote add upstream https://github.com/PresidentAnderson/storagespace.git

# Install dependencies
npm install
```

### 2. Creating a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout development
git merge upstream/development

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Making Changes

Follow our coding standards:

- Use TypeScript for all new code
- Follow existing patterns and conventions
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep functions small and focused

### 4. Commit Guidelines

We use Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat(booking): add calendar view for date selection"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(api): update authentication endpoints"
```

### 5. Testing

Run all tests before submitting:

```bash
# Run unit tests
npm test

# Run linting
npm run lint

# Type checking
npm run typecheck

# Run all checks
npm run test:all
```

### 6. Submitting a Pull Request

1. Push your branch to your fork
2. Go to the original repository
3. Click "New Pull Request"
4. Select your branch
5. Fill out the PR template
6. Submit for review

## Pull Request Guidelines

### PR Title Format

Follow the same convention as commits:
- `feat: add user profile editing`
- `fix: resolve map loading issue on Android`
- `docs: update deployment guide`

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No regressions found

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Code Style Guide

### TypeScript

```typescript
// Use interfaces for object types
interface User {
  id: string;
  name: string;
  email: string;
}

// Use explicit return types
const getUser = async (id: string): Promise<User> => {
  // Implementation
};

// Use enum for constants
enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
```

### React Native

```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onPress: () => void;
}

export const Button: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// Use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `LocationCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `PascalCase.ts` (e.g., `User.ts`)
- Hooks: `camelCase.ts` starting with 'use' (e.g., `useLocation.ts`)

## Review Process

### What We Look For

1. **Code Quality**
   - Clean, readable code
   - Proper error handling
   - No code duplication
   - Performance considerations

2. **Testing**
   - Adequate test coverage
   - Edge cases handled
   - No breaking changes

3. **Documentation**
   - Code comments where needed
   - README updates if required
   - API documentation for new endpoints

4. **UI/UX**
   - Consistent with design system
   - Responsive on all devices
   - Accessible

### Review Timeline

- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Small PRs reviewed faster than large ones

## Community

### Getting Help

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Discord**: For real-time chat (coming soon)

### Recognition

Contributors will be:
- Listed in our [Contributors](./CONTRIBUTORS.md) file
- Mentioned in release notes
- Given credit in commit messages

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](./LICENSE) that covers the project.