# Documentation Tools

<p align="center">
  <a href="../../README.md">
    <img src="../../assets/images/rolodexter_logo.jpg" alt="rolodexter Logo" width="80px" style="border-radius: 50%;">
  </a>
</p>

<p align="center">
  <a href="../../README.md">Home</a> | <a href="../../projects/projects.md">Projects</a> | <a href="../../research/research.md">Research</a> | <a href="../../techstack/techstack.md">Tech Stack</a> | <a href="../../contact.md">Contact</a>
</p>

<details>
<summary>Notice</summary>

This repository is protected by copyright and subject to usage restrictions. See the [Copyright Notice](../../COPYRIGHT.md) for details.
</details>

## Documentation Architecture

```mermaid
graph TD
    A[Content Creation] -->|Structured Input| B[Knowledge Management]
    B -->|Processing| C[Documentation Generation]
    C -->|Publishing| D[Distribution]
    
    E[Text Expansion] -->|Automation| A
    F[Version Control] -->|Tracking| B
    G[CI/CD] -->|Automation| C
    H[Cloud Services] -->|Hosting| D
    
    I[AI Agents] -->|Enhancement| E
    J[SQL Server] -->|Storage| E
    K[Azure] -->|Cloud Sync| E
```

## Knowledge Management

### [Obsidian](https://obsidian.md/)
> Implementation of graph-based knowledge management using Dataview plugin for SQL-like queries, custom JavaScript for automation, and Python integration for AI-enhanced note processing. Utilizes YAML frontmatter for metadata management.
- Primary knowledge base and note-taking system
- Graph visualization for knowledge connections
- Custom plugins for AI integration
- Version control integration

### [Overleaf](https://www.overleaf.com/)
> LaTeX-based collaborative writing platform with Git backend integration. Implements custom document classes and BibTeX for reference management. Uses CI/CD for automated PDF generation.
- Scientific article writing and collaboration
- LaTeX document preparation
- Research paper templates
- Pre-print formatting

### [GitBook](https://www.gitbook.com/)
> Modern documentation platform with React-based components and GraphQL API. Implements OpenAPI specification for API documentation and custom JavaScript for interactive elements.
- Technical documentation hosting
- API documentation
- Integration guides
- User manuals

## Text Expansion System

```mermaid
graph TD
    A[Text Expansion Layer] -->|Primary| B[PhraseExpress]
    A -->|Secondary| C[Alternative Expanders]
    
    B -->|Storage| D[SQL Server 2022]
    D -->|Backup| E[Azure Storage]
    D -->|Sync| F[OneDrive]
    
    C -->|Open Source| G[Espanso]
    C -->|Automation| H[AutoHotkey]
    C -->|Quick Tasks| I[Beeftext]
    
    J[rolodexterAI] -->|Optimize| D
    K[rolodexterDOC] -->|Maintain| D
    L[rolodexterGIT] -->|Version| D
    
    M[Cloud Services] -->|Integration| B
    M -->|Config Sync| G
```

### Multi-Expander Architecture
> Enterprise text expansion infrastructure utilizing multiple specialized tools for different use cases, with PhraseExpress as the primary system backed by SQL Server 2022, and complementary open-source solutions for specific workflows.

#### Primary System: PhraseExpress
> Enterprise-grade text expansion system utilizing SQL Server 2022 for phrase storage, Azure Blob Storage for backup, and OneDrive for cross-device synchronization. Implements custom T-SQL procedures for phrase management.

##### Database Architecture
- SQL Server 2022 backend
  - Normalized tables for phrases, categories, and metadata
  - Full-text search indexing for rapid retrieval
  - Transaction logging with change tracking
  - Temporal tables for version history

##### Cloud Integration
- Azure Blob Storage backup
  - Automated daily snapshots
  - Point-in-time recovery
  - Geo-redundant storage
- OneDrive real-time sync
  - Multi-device deployment
  - Conflict resolution
  - Delta synchronization

#### Complementary Systems

##### [Espanso](https://espanso.org)
> Privacy-focused, open-source text expander utilizing YAML configuration and shell integration for developer workflows.
- Cross-platform compatibility
- Shell command integration
- Custom Python/Ruby matches
- Git-based config management

##### [AutoHotkey](https://www.autohotkey.com)
> Scripting-based automation tool for complex text expansion and system automation tasks.
- Custom macro scripting
- System-wide hotkeys
- GUI automation
- Complex text manipulation

##### [Beeftext](https://beeftext.org)
> Lightweight text expander for quick tasks and simple substitutions.
- Portable deployment
- Simple combo shortcuts
- Unicode support
- CSV import/export

#### AI Agent Integration

```mermaid
graph LR
    A[rolodexterAI] -->|Analyze & Optimize| B[Phrase Repository]
    C[rolodexterDOC] -->|Document & Update| B
    D[rolodexterGIT] -->|Version Control| B
    
    B -->|Primary Storage| E[SQL Server]
    B -->|Config Files| F[Git Repository]
    
    G[User Input] -->|New Phrases| B
    H[Usage Analytics] -->|Optimization| A
```

##### Agent Responsibilities
- **rolodexterAI**
  - Phrase optimization algorithms
  - Usage pattern analysis
  - Suggestion generation
  - Context awareness

- **rolodexterDOC**
  - Documentation maintenance
  - Category organization
  - Metadata management
  - Usage guidelines

- **rolodexterGIT**
  - Version control
  - Change tracking
  - Backup coordination
  - Sync management

#### Integration Points

##### Database Connectivity
```sql
-- Example phrase management stored procedure
CREATE PROCEDURE [dbo].[usp_ManagePhrase]
    @PhraseID uniqueidentifier,
    @Content nvarchar(max),
    @Category nvarchar(100),
    @Tags nvarchar(500),
    @LastModifiedBy nvarchar(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    MERGE INTO Phrases WITH (HOLDLOCK)
    USING (SELECT @PhraseID AS ID) AS Source
    ON Phrases.PhraseID = Source.ID
    WHEN MATCHED THEN
        UPDATE SET 
            Content = @Content,
            Category = @Category,
            Tags = @Tags,
            LastModified = GETUTCDATE(),
            LastModifiedBy = @LastModifiedBy
    WHEN NOT MATCHED THEN
        INSERT (PhraseID, Content, Category, Tags, CreatedBy)
        VALUES (@PhraseID, @Content, @Category, @Tags, @LastModifiedBy);
END
```

##### Cloud Storage Integration
```mermaid
graph TD
    A[Local Changes] -->|Trigger| B[SQL Server]
    B -->|Backup| C[Azure Blob]
    B -->|Sync| D[OneDrive]
    
    E[Change Detection] -->|Monitor| B
    F[Conflict Resolution] -->|Resolve| D
    
    G[Recovery Process] -->|Restore| B
    H[Version Control] -->|Track| B
```

### Use Case Specialization

```mermaid
graph TD
    A[Text Expansion Tasks] -->|Development| B[Espanso]
    A -->|Enterprise| C[PhraseExpress]
    A -->|Automation| D[AutoHotkey]
    A -->|Quick Text| E[Beeftext]
    
    B -->|Code Snippets| F[Git Commands]
    B -->|Shell Scripts| G[DevOps Tasks]
    
    C -->|Documentation| H[Templates]
    C -->|Research| I[Citations]
    
    D -->|System| J[Macros]
    D -->|UI| K[Automation]
    
    E -->|Common| L[Quick Replies]
    E -->|Standard| M[Signatures]
```

#### Development Workflows (Espanso)
> Specialized for developer tasks with shell integration and dynamic content generation.

```yaml
# config/espanso.yml
matches:
  - trigger: ":git"
    replace: "{{output}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "git status"
  
  - trigger: ":docker"
    replace: "{{output}}"
    vars:
      - name: output
        type: choice
        params:
          values:
            - "docker-compose up -d"
            - "docker ps"
            - "docker logs -f"

  - trigger: ":pr"
    replace: |
      ## Description
      {{description}}
      
      ## Changes
      - 
      
      ## Testing
      - [ ] Unit Tests
      - [ ] Integration Tests
    vars:
      - name: description
        type: form
        params:
          layout: "Description: "
```

#### Enterprise Documentation (PhraseExpress)
> Advanced template system with SQL Server backend for enterprise-wide standardization.

```sql
-- Database Schema
CREATE TABLE Phrases (
    PhraseID uniqueidentifier PRIMARY KEY,
    Content nvarchar(max),
    Category nvarchar(100),
    Tags nvarchar(500),
    CreatedBy nvarchar(50),
    CreatedDate datetime2 DEFAULT GETUTCDATE(),
    LastModified datetime2,
    LastModifiedBy nvarchar(50),
    IsActive bit DEFAULT 1,
    Version int DEFAULT 1
);

CREATE TABLE Categories (
    CategoryID int IDENTITY(1,1) PRIMARY KEY,
    Name nvarchar(100) UNIQUE,
    ParentID int FOREIGN KEY REFERENCES Categories(CategoryID),
    Description nvarchar(500),
    IsSystem bit DEFAULT 0
);

CREATE TABLE PhraseHistory (
    HistoryID bigint IDENTITY(1,1) PRIMARY KEY,
    PhraseID uniqueidentifier,
    Content nvarchar(max),
    ModifiedBy nvarchar(50),
    ModifiedDate datetime2 DEFAULT GETUTCDATE(),
    Version int,
    ChangeType char(1), -- 'I'nsert, 'U'pdate, 'D'elete
    FOREIGN KEY (PhraseID) REFERENCES Phrases(PhraseID)
);

-- Advanced Search Procedure
CREATE PROCEDURE [dbo].[usp_SearchPhrases]
    @SearchTerm nvarchar(500),
    @Category nvarchar(100) = NULL,
    @Tags nvarchar(500) = NULL,
    @ModifiedSince datetime2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.PhraseID,
           p.Content,
           p.Category,
           p.Tags,
           p.LastModified,
           p.Version
    FROM Phrases p
    WHERE (@SearchTerm IS NULL OR 
           CONTAINS(p.Content, @SearchTerm) OR
           CONTAINS(p.Tags, @SearchTerm))
    AND (@Category IS NULL OR p.Category = @Category)
    AND (@Tags IS NULL OR p.Tags LIKE '%' + @Tags + '%')
    AND (@ModifiedSince IS NULL OR p.LastModified >= @ModifiedSince)
    AND p.IsActive = 1
    ORDER BY p.LastModified DESC;
END
```

#### System Automation (AutoHotkey)
> Complex system automation and text manipulation scripts.

```autohotkey
; Advanced Text Processing
#NoEnv
SetWorkingDir %A_ScriptDir%

; Quick documentation template
:*:@doc::
(
/**
 * @function: 
 * @param: 
 * @returns: 
 * @description: 
 */
)

; Git workflow automation
:*:@git::
InputBox, commit, Commit Message, Enter commit message:
if ErrorLevel
    return
Run, git add .
Run, git commit -m "%commit%"
Run, git push
return

; Advanced text processing
^!t::
{
    ; Get selected text
    SavedClip := ClipboardAll
    Clipboard := ""
    Send ^c
    ClipWait, 1
    if ErrorLevel
        return
    
    ; Process text
    text := Clipboard
    text := RegExReplace(text, "^\s+|\s+$", "")
    text := RegExReplace(text, "\R\R+", "`n`n")
    
    ; Send processed text
    Clipboard := text
    Send ^v
    Sleep 50
    Clipboard := SavedClip
    return
}
```

#### Quick Text (Beeftext)
> Lightweight text expansion for common patterns.

```json
{
  "combos": [
    {
      "trigger": "#email",
      "text": "contact@rolodexter.ai"
    },
    {
      "trigger": "#sig",
      "text": "Best regards,\nRolodexter Team"
    },
    {
      "trigger": "#date",
      "text": "$[DATE:yyyy-MM-dd]"
    }
  ]
}
```

## Markdown Enhancement

```mermaid
graph TD
    A[Raw Markdown] -->|Formatting| B[Enhanced MD]
    B -->|Validation| C[Final Output]
    
    D[Custom Scripts] -->|Processing| B
    E[Extensions] -->|Enhancement| B
    F[Linters] -->|Quality| C
```

### Custom Tools
> Implementation of custom Node.js and Python scripts for markdown processing. Utilizes AST manipulation for consistent formatting and metadata injection.
- Markdown formatters with custom rulesets
- Header standardization using regex patterns
- Link validators with HTTP status checking
- Meta-documentation generators

### Extensions
> VS Code extension integration using Language Server Protocol (LSP) for real-time markdown enhancement and validation.
- Markdown Preview Enhanced with KaTeX
- Markdown All in One with TOC generation
- markdownlint with custom rules
- Paste Image with cloud storage

## Scientific Writing

```mermaid
graph TD
    A[Content] -->|LaTeX| B[Processing]
    B -->|Compilation| C[Output]
    
    D[References] -->|BibTeX| B
    E[Templates] -->|Style| B
    F[Tools] -->|Build| C
```

### LaTeX Tools
> Implementation of TeX Live 2023 with custom package management and document classes. Utilizes Lua scripts for advanced formatting.
- TeXworks with custom macros
- MiKTeX package management
- BibTeX with custom styles
- Template inheritance system

### Reference Management
> Zotero-based reference management with custom CSL styles and SQL-based data organization.
- Zotero with WebDAV sync
- Mendeley API integration
- Papers with ML tagging
- EndNote XML export

## Documentation Automation

```mermaid
graph LR
    A[Source] -->|Build| B[Static Site]
    B -->|Deploy| C[Production]
    
    D[CI/CD] -->|Automate| B
    E[Tests] -->|Validate| B
    F[Monitoring] -->|Track| C
```

### Tools
> Implementation of static site generators with custom plugins and themes. Utilizes GitHub Actions for automated deployment.
- mdBook with Rust extensions
- Docusaurus React components
- Sphinx with Python docstrings
- MkDocs with Material theme

### Custom Scripts
> Python and Node.js automation scripts with extensive test coverage and error handling.
- Auto-formatting with AST parsing
- Link checking with parallel requests
- TOC generation with depth control
- Cross-reference validation

## Integration & Workflows

### Version Control
> Git-based documentation management with custom hooks and automated quality checks.
- Git LFS for binary assets
- Pre-commit hooks for validation
- Branch protection rules
- Automated merging

### Automation
> CI/CD pipeline implementation using GitHub Actions and custom Docker containers.
- Documentation testing with Jest
- Automated builds with cache
- Link validation with retry logic
- Format checking with custom rules

### AI Agent Integration Patterns

#### rolodexterAI Implementation
```python
class PhraseOptimizer:
    def __init__(self, db_connection):
        self.db = db_connection
        self.nlp = spacy.load('en_core_web_lg')
        
    async def analyze_usage_patterns(self):
        """Analyzes phrase usage patterns and suggests optimizations."""
        query = """
        SELECT PhraseID, Content, UsageCount, LastUsed
        FROM Phrases
        WHERE IsActive = 1
        AND LastAnalyzed < DATEADD(day, -7, GETUTCDATE())
        """
        phrases = await self.db.fetch_all(query)
        
        for phrase in phrases:
            doc = self.nlp(phrase.Content)
            suggestions = self.generate_suggestions(doc)
            await self.update_suggestions(phrase.PhraseID, suggestions)
    
    def generate_suggestions(self, doc):
        """Generates optimization suggestions using NLP."""
        suggestions = []
        # Analyze phrase structure
        if len(doc) > 100:
            suggestions.append({
                'type': 'length',
                'suggestion': 'Consider breaking into smaller phrases'
            })
        
        # Check for common patterns
        patterns = self.identify_patterns(doc)
        if patterns:
            suggestions.append({
                'type': 'pattern',
                'suggestion': f'Similar patterns found: {patterns}'
            })
            
        return suggestions

    async def update_suggestions(self, phrase_id, suggestions):
        """Updates phrase suggestions in the database."""
        query = """
        UPDATE Phrases 
        SET Suggestions = @suggestions,
            LastAnalyzed = GETUTCDATE()
        WHERE PhraseID = @phrase_id
        """
        await self.db.execute(query, {
            'suggestions': json.dumps(suggestions),
            'phrase_id': phrase_id
        })
```

#### rolodexterDOC Integration
```python
class DocumentationManager:
    def __init__(self, db_connection, git_repo):
        self.db = db_connection
        self.repo = git_repo
        
    async def update_documentation(self):
        """Updates documentation based on phrase changes."""
        changes = await self.get_recent_changes()
        for change in changes:
            await self.process_change(change)
            await self.update_git_repo(change)
    
    async def get_recent_changes(self):
        """Retrieves recent phrase changes."""
        query = """
        SELECT ph.PhraseID,
               ph.Content,
               ph.ModifiedBy,
               ph.ModifiedDate,
               ph.Version,
               ph.ChangeType
        FROM PhraseHistory ph
        WHERE ph.ModifiedDate > DATEADD(hour, -24, GETUTCDATE())
        ORDER BY ph.ModifiedDate DESC
        """
        return await self.db.fetch_all(query)
    
    async def process_change(self, change):
        """Updates documentation for a phrase change."""
        if change.ChangeType == 'I':
            await self.document_new_phrase(change)
        elif change.ChangeType == 'U':
            await self.document_update(change)
        elif change.ChangeType == 'D':
            await self.document_deletion(change)
```

#### rolodexterGIT Integration
```python
class VersionController:
    def __init__(self, db_connection, backup_service):
        self.db = db_connection
        self.backup = backup_service
        
    async def sync_changes(self):
        """Synchronizes changes across systems."""
        await self.backup_to_azure()
        await self.sync_to_onedrive()
        await self.update_git_repo()
    
    async def backup_to_azure(self):
        """Handles Azure backup process."""
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        backup_file = f'phrases_backup_{timestamp}.bak'
        
        # Create backup
        query = """
        BACKUP DATABASE PhraseDB
        TO DISK = @backup_file
        WITH FORMAT, COMPRESSION
        """
        await self.db.execute(query, {'backup_file': backup_file})
        
        # Upload to Azure
        await self.backup.upload_blob(
            container='phrase-backups',
            blob_name=backup_file,
            file_path=backup_file
        )
    
    async def sync_to_onedrive(self):
        """Syncs changes to OneDrive."""
        changes = await self.get_pending_changes()
        for change in changes:
            await self.upload_to_onedrive(change)
            await self.mark_synced(change.PhraseID)
```

### Integration Workflows

```mermaid
graph TD
    A[User Input] -->|New Phrase| B[PhraseExpress]
    B -->|Store| C[SQL Server]
    
    D[rolodexterAI] -->|Analyze| C
    D -->|Optimize| B
    
    E[rolodexterDOC] -->|Monitor| C
    E -->|Update| F[Documentation]
    
    G[rolodexterGIT] -->|Backup| H[Azure]
    G -->|Sync| I[OneDrive]
    
    J[Usage Analytics] -->|Feed| D
    K[Change Events] -->|Trigger| E
    L[Schedule] -->|Trigger| G
```

### Error Handling & Retry Mechanisms

```python
class RetryManager:
    def __init__(self, max_retries=3, backoff_factor=1.5):
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
        
    async def execute_with_retry(self, operation, *args, **kwargs):
        """Execute operation with exponential backoff retry."""
        last_exception = None
        for attempt in range(self.max_retries):
            try:
                return await operation(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if not self._should_retry(e):
                    raise
                    
                wait_time = self.backoff_factor ** attempt
                logging.warning(f"Attempt {attempt + 1} failed: {str(e)}. Retrying in {wait_time}s")
                await asyncio.sleep(wait_time)
                
        raise MaxRetriesExceededError(f"Operation failed after {self.max_retries} attempts") from last_exception
    
    def _should_retry(self, exception):
        """Determine if exception is retryable."""
        retryable_exceptions = (
            ConnectionError,
            TimeoutError,
            azure.core.exceptions.ServiceRequestError,
            sqlalchemy.exc.OperationalError
        )
        return isinstance(exception, retryable_exceptions)

class ErrorBoundary:
    def __init__(self, logger):
        self.logger = logger
        
    async def handle_error(self, context, error):
        """Centralized error handling with context."""
        error_id = str(uuid.uuid4())
        self.logger.error(f"Error ID: {error_id}", extra={
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context,
            'stack_trace': traceback.format_exc()
        })
        
        if isinstance(error, BusinessLogicError):
            return {'error': 'Business logic error', 'details': str(error)}
        elif isinstance(error, ValidationError):
            return {'error': 'Validation failed', 'details': error.errors()}
        else:
            return {
                'error': 'Internal server error',
                'error_id': error_id,
                'contact': 'support@rolodexter.ai'
            }
```

### Agent Configuration

```yaml
# config/agents/rolodexter.yml
agents:
  ai:
    model: gpt-4-turbo
    temperature: 0.7
    max_tokens: 2000
    retry_config:
      max_retries: 3
      backoff_factor: 1.5
    rate_limits:
      requests_per_minute: 60
      burst_limit: 100
    
  doc:
    update_interval: 300  # seconds
    batch_size: 50
    concurrent_tasks: 4
    git:
      branch: main
      commit_message_template: "docs: update {category} documentation"
    
  git:
    sync_interval: 900  # seconds
    backup:
      retention_days: 30
      compression_level: 9
    azure:
      container: phrase-backups
      tier: Cool
      
monitoring:
  logging:
    level: INFO
    handlers:
      - type: console
        format: "%(asctime)s [%(levelname)s] %(message)s"
      - type: file
        filename: logs/rolodexter.log
        max_size: 10MB
        backup_count: 5
  metrics:
    prometheus:
      port: 9090
      path: /metrics
    custom_metrics:
      - name: phrase_optimization_duration
        type: histogram
        buckets: [0.1, 0.5, 1.0, 2.0, 5.0]
      - name: sync_success_rate
        type: gauge
        
security:
  encryption:
    algorithm: AES-256-GCM
    key_rotation_days: 90
  authentication:
    jwt:
      expiry: 3600
      refresh_enabled: true
  authorization:
    roles:
      - admin
      - editor
      - viewer
    permissions:
      admin:
        - manage_agents
        - manage_phrases
        - manage_users
      editor:
        - edit_phrases
        - view_analytics
      viewer:
        - view_phrases
```

### Monitoring & Logging

```python
class MonitoringSystem:
    def __init__(self):
        self.metrics = PrometheusMetrics()
        self.logger = structlog.get_logger()
        self.tracer = OpenTelemetryTracer()
        
    async def track_operation(self, operation_name, **kwargs):
        """Track operation with metrics, logs, and traces."""
        with self.tracer.start_span(operation_name) as span:
            start_time = time.time()
            try:
                result = await self._execute_operation(operation_name, **kwargs)
                duration = time.time() - start_time
                
                # Record metrics
                self.metrics.operation_duration.observe(duration)
                self.metrics.operation_success.inc()
                
                # Structured logging
                self.logger.info(
                    "operation_completed",
                    operation=operation_name,
                    duration=duration,
                    **kwargs
                )
                
                return result
                
            except Exception as e:
                self.metrics.operation_failure.inc()
                self.logger.error(
                    "operation_failed",
                    operation=operation_name,
                    error=str(e),
                    **kwargs
                )
                raise

class MetricsCollector:
    def __init__(self):
        # Prometheus metrics
        self.phrase_count = Counter(
            'rolodexter_phrases_total',
            'Total number of phrases',
            ['category']
        )
        self.optimization_duration = Histogram(
            'rolodexter_optimization_seconds',
            'Time spent optimizing phrases',
            buckets=[0.1, 0.5, 1.0, 2.0, 5.0]
        )
        self.sync_errors = Counter(
            'rolodexter_sync_errors_total',
            'Total number of sync errors',
            ['service']
        )
        
    async def collect_metrics(self):
        """Collect and export metrics."""
        while True:
            metrics = await self._gather_metrics()
            await self._export_metrics(metrics)
            await asyncio.sleep(60)
    
    async def _gather_metrics(self):
        """Gather metrics from various sources."""
        return {
            'system': await self._system_metrics(),
            'application': await self._application_metrics(),
            'business': await self._business_metrics()
        }
```

### Security & Access Control

```python
class SecurityManager:
    def __init__(self, config):
        self.config = config
        self.crypto = CryptoProvider()
        self.auth = AuthenticationService()
        self.rbac = RBACProvider()
        
    async def secure_operation(self, user, operation, resource):
        """Secure operation execution with authentication and authorization."""
        # Verify JWT token
        if not await self.auth.verify_token(user.token):
            raise AuthenticationError("Invalid or expired token")
            
        # Check permissions
        if not await self.rbac.check_permission(user.id, operation, resource):
            raise AuthorizationError(f"User {user.id} not authorized for {operation} on {resource}")
            
        # Audit logging
        await self._audit_log(user, operation, resource)
        
    async def rotate_keys(self):
        """Rotate encryption keys periodically."""
        while True:
            try:
                new_key = self.crypto.generate_key()
                await self._safely_rotate_key(new_key)
                await asyncio.sleep(self.config.key_rotation_interval)
            except Exception as e:
                logging.error(f"Key rotation failed: {str(e)}")
                
    async def _safely_rotate_key(self, new_key):
        """Safely rotate encryption keys without data loss."""
        async with self.db.transaction():
            # Re-encrypt sensitive data with new key
            phrases = await self.db.fetch_all("SELECT * FROM Phrases")
            for phrase in phrases:
                decrypted = self.crypto.decrypt(phrase.content, self.current_key)
                encrypted = self.crypto.encrypt(decrypted, new_key)
                await self.db.execute(
                    "UPDATE Phrases SET content = $1 WHERE id = $2",
                    encrypted, phrase.id
                )
            
            # Update key metadata
            await self.db.execute(
                "INSERT INTO KeyRotation (key_id, created_at) VALUES ($1, $2)",
                new_key.id, datetime.utcnow()
            )
            
class RBACProvider:
    def __init__(self):
        self.role_definitions = {
            'admin': {
                'permissions': ['manage_agents', 'manage_phrases', 'manage_users'],
                'scope': 'global'
            },
            'editor': {
                'permissions': ['edit_phrases', 'view_analytics'],
                'scope': 'assigned_categories'
            },
            'viewer': {
                'permissions': ['view_phrases'],
                'scope': 'public'
            }
        }
        
    async def check_permission(self, user_id, operation, resource):
        """Check if user has permission for operation on resource."""
        user_roles = await self.get_user_roles(user_id)
        required_permission = self._get_required_permission(operation)
        
        for role in user_roles:
            if required_permission in self.role_definitions[role]['permissions']:
                if await self._check_scope(user_id, role, resource):
                    return True
                    
        return False
        
    async def _check_scope(self, user_id, role, resource):
        """Check if user's role scope includes the resource."""
        scope = self.role_definitions[role]['scope']
        if scope == 'global':
            return True
            
        if scope == 'assigned_categories':
            return await self._is_in_assigned_category(user_id, resource)
            
        if scope == 'public':
            return await self._is_public_resource(resource)
            
        return False
```

---

Last Updated: March 2025  
Contact: docs@rolodexter.ai 