// Single global instance
let simulationInstance = null;

class WebTerminalSimulation {
    constructor() {
        console.log('WebTerminalSimulation constructor called');
        this.chatSequenceStarted = false;
        this.simulationStarted = false;
        this.isLoggingIn = false;
        this.initComplete = false;
        this.sessionIPs = {
            joe: '172.16.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256),
            rolodexter: '10.0.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256)
        };
        this.serverId = 'srv-' + Math.random().toString(36).substr(2, 9);
        this.systemMetrics = {
            cpuLoad: Math.floor(Math.random() * 30) + 10,
            memoryUsage: Math.floor(Math.random() * 512) + 512
        };
        this.networkMetrics = {
            latency: Math.floor(Math.random() * 50) + 20,
            throughput: Math.floor(Math.random() * 500) + 500,
            packetLoss: (Math.random() * 0.5).toFixed(2)
        };
        this.connectionStages = [
            "Initializing secure connection [protocol=TLSv1.3, cipher=AES-256-GCM]",
            "Establishing encrypted channel [handshake=ECDHE-RSA, curve=X25519]",
            "Authenticating service endpoints [method=JWT, alg=RS256]",
            "Loading relationship matrix [format=sparse, compression=zstd-19]",
            "Syncing neural pathways [model=transformer-xl, batch=32]"
        ];
        this.queries = [
            "query GetUserProfile($id: ID!) { user(id: $id) { id name preferences { theme language } } }",
            "query FetchAnalytics { dailyStats { visitors conversions revenue } }",
            "subscription WatchTransactions { pendingTx { hash from to value } }",
            "query LoadBlockData($hash: String!) { block(hash: $hash) { number timestamp transactions } }"
        ];
        this.endpoints = [
            "api.ethereum.org/v1/beacon/blocks",
            "graph.company.io/v1/metrics",
            "auth.service/verify",
            "cdn.assets/fetch",
            "ws.datacenter/stream"
        ];
        this.serverRegions = [
            "us-east-1", "eu-west-2", "ap-southeast-1",
            "sa-east-1", "me-south-1", "af-south-1"
        ];
        this.services = [
            "LoadBalancer", "AuthService", "DataSync",
            "CacheLayer", "QueueWorker", "BlockIndexer"
        ];
        this.typingAnimationEnabled = true;
        this.messageAnimationEnabled = true;
        this.statusAnimationEnabled = true;
        this.loginMetricsInterval = null;
        this.loginMetrics = {
            neuralSync: { min: 97.5, max: 99.9 },
            memoryPool: { min: 800, max: 900 },
            latency: { min: 18, max: 35 },
            cacheHitRate: { min: 98.5, max: 99.9 }
        };
        this.cloudProviders = {
            aws: { name: 'AWS', color: '#FF9900' },
            azure: { name: 'Azure', color: '#008AD7' },
            gcp: { name: 'Google Cloud', color: '#4285F4' },
            vercel: { name: 'Vercel', color: '#000000' }
        };
        this.selectedCloudProvider = null;
        this.macros = {
            'macro-1': 'Deploy to Cloud',
            'macro-2': 'Scale Resources',
            'macro-3': 'Monitor Performance',
            'macro-custom': 'Custom Macro'
        };
        this.initialize();
        this.startStatusUpdates();
    }

    async initialize() {
        if (this.initComplete) {
            console.log('Already initialized');
            return;
        }

        try {
            console.log('Initializing elements...');
            await this.initElements();
            this.startLoginMetrics();
            this.startAutoScroll(); // Add this line
            await this.startSimulation();
            this.initComplete = true;
        } catch (error) {
            console.error('Initialization error:', error);
            setTimeout(() => this.initialize(), 500);
        }
    }

    startLoginMetrics() {
        const updateMetric = (selector, value, unit = '') => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value + unit;
                element.className = 'metric-value ' + this.getMetricStatus(value);
            }
        };

        const updateMetrics = () => {
            // Neural Sync
            const neuralSync = this.getRandomFloat(
                this.loginMetrics.neuralSync.min,
                this.loginMetrics.neuralSync.max
            ).toFixed(1);
            updateMetric('.metric-line:nth-child(1) .metric-value', neuralSync, '%');

            // Memory Pool
            const memoryPool = this.getRandomFloat(
                this.loginMetrics.memoryPool.min,
                this.loginMetrics.memoryPool.max
            ).toFixed(1);
            updateMetric('.metric-line:nth-child(2) .metric-value', memoryPool, ' GB');

            // Network Latency
            const latency = Math.floor(this.getRandomFloat(
                this.loginMetrics.latency.min,
                this.loginMetrics.latency.max
            ));
            updateMetric('.metric-line:nth-child(4) .metric-value', latency, 'ms');

            // Cache Hit Rate
            const cacheHitRate = this.getRandomFloat(
                this.loginMetrics.cacheHitRate.min,
                this.loginMetrics.cacheHitRate.max
            ).toFixed(1);
            updateMetric('.metric-line:nth-child(6) .metric-value', cacheHitRate, '%');

            // Random Connection ID
            if (Math.random() < 0.1) { // 10% chance to update
                const newId = 'rx-' + Math.random().toString(36).substr(2, 11);
                updateMetric('.metric-line:nth-child(9) .metric-value', newId, '');
            }
        };

        updateMetrics(); // Initial update
        this.loginMetricsInterval = setInterval(updateMetrics, 2000);
    }

    getMetricStatus(value) {
        if (value >= 98) return 'good';
        if (value >= 90) return 'warning';
        return '';
    }

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    async initElements() {
        const required = {
            loginContainer: 'login-container',
            statusFrame: 'status-frame',
            chatInput: 'chat-input',
            messagesContainer: 'chat-messages',
            usernameInput: 'username',
            passwordInput: 'password',
            sendButton: 'send-button',
            modelSelect: 'model-select',
            fileInput: 'file-input',
            attachmentPreview: 'attachment-preview',
            chatForm: 'chat-form'
        };

        for (const [key, id] of Object.entries(required)) {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Required element not found: ${id}`);
            }
            this[key] = element;
        }

        // Ensure status frame is visible and properly initialized
        this.statusFrame.style.display = 'block';
        this.statusFrame.style.visibility = 'visible';
        this.statusFrame.style.opacity = '1';
        
        // Initialize chat controls
        this.initChatControls();

        // Initialize auto-scroll
        this.startAutoScroll();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startSimulation() {
        if (this.simulationStarted) {
            console.log('Simulation already started');
            return;
        }

        console.log('Starting simulation...');
        this.simulationStarted = true;

        try {
            console.log('Starting connection sequence...');
            await this.showConnectionSequence();
            
            console.log('Starting login sequence...');
            await this.simulateLogin();
            
            console.log('Starting continuous updates...');
            this.startContinuousUpdates();
        } catch (error) {
            console.error('Simulation error:', error);
            this.simulationStarted = false;
            setTimeout(() => this.startSimulation(), 500);
        }
    }

    async showConnectionSequence() {
        for (const stage of this.connectionStages) {
            const statusLine = document.createElement('div');
            statusLine.className = 'status-line pending';
            const timestamp = new Date().toLocaleTimeString();
            statusLine.innerHTML = `<time>${timestamp}</time> ${this.serverId} ${stage}`;
            this.statusFrame.appendChild(statusLine);
            
            await this.sleep(1000);
            statusLine.classList.remove('pending');
            statusLine.classList.add('success');
        }
    }

    async simulateLogin() {
        if (this.isLoggingIn) return;
        this.isLoggingIn = true;

        try {
            const usernameField = this.usernameInput.closest('.login-field');
            const passwordField = this.passwordInput.closest('.login-field');
            
            await this.sleep(1000);
            
            await this.typeCredential(this.usernameInput, usernameField, "JoeMaristela");
            await this.sleep(500);
            await this.typeCredential(this.passwordInput, passwordField, "rolodexter", true);
            
            this.loginContainer.classList.add('processing');
            await this.sleep(500);
            
            this.loginContainer.classList.add('hidden');
            await this.sleep(500);
            this.loginContainer.style.display = 'none';
            
            this.chatInput.removeAttribute('readonly');
            document.querySelector('.chat-controls').classList.add('enabled');
            
            await this.startChatSequence();
        } finally {
            this.isLoggingIn = false;
            if (this.loginMetricsInterval) {
                clearInterval(this.loginMetricsInterval);
                this.loginMetricsInterval = null;
            }
        }
    }

    async typeCredential(input, field, text, isPassword = false) {
        field.classList.add('typing');
        input.classList.add('typing');
        
        for (const char of text) {
            input.value += isPassword ? '*' : char;
            await this.sleep(Math.random() * 100 + 50);
        }
        
        field.classList.remove('typing');
        field.classList.add('done');
        input.classList.remove('typing');
        await this.sleep(500);
    }

    startContinuousUpdates() {
        setInterval(() => {
            const cpuLoad = Math.floor(Math.random() * 30) + 10;
            const memUsage = Math.floor(Math.random() * 512) + 512;
            this.addStatusLine(`System metrics [cpu=${cpuLoad}%, mem=${memUsage}MB]`);
        }, 3000);
    }

    generateRandomHash() {
        return '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generateRandomIP() {
        return Array.from({length: 4}, () => 
            Math.floor(Math.random() * 256)).join('.');
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    startStatusUpdates() {
        // Kubernetes pod and container metrics
        setInterval(() => {
            const podNames = ['nomix-api', 'nomix-processor', 'nomix-cache', 'nomix-indexer'];
            const namespaces = ['prod', 'staging', 'dev'];
            const pod = this.getRandomElement(podNames);
            const namespace = this.getRandomElement(namespaces);
            const cpuUsage = (Math.random() * 800 + 200).toFixed(2);
            const memoryUsage = Math.floor(Math.random() * 1024 + 512);
            
            this.addStatusLine(
                `[K8S] pod=${pod} namespace=${namespace} cpu=${cpuUsage}m memory=${memoryUsage}Mi status=Running ready=1/1 restarts=0`,
                'system'
            );
        }, 800); // Increased frequency

        // Prometheus metrics and alerts
        setInterval(() => {
            const metrics = [
                'http_request_duration_seconds',
                'node_memory_MemAvailable_bytes',
                'node_cpu_seconds_total',
                'solana_transaction_count',
                'nomix_schema_validation_latency',
                'blockchain_sync_progress'
            ];
            const metric = this.getRandomElement(metrics);
            const value = (Math.random() * 1000).toFixed(3);
            const labels = `{job="nomix",env="prod",instance="node-${Math.floor(Math.random() * 5)}"}`;
            
            this.addStatusLine(
                `[PROMETHEUS] ${metric}${labels} ${value} ${Date.now()}`,
                'query'
            );
        }, 600); // More frequent updates

        // Solana transaction monitoring
        setInterval(() => {
            const txTypes = ['TokenTransfer', 'NFTMint', 'ProgramInvoke', 'SystemProgram', 'SchemaUpdate'];
            const txType = this.getRandomElement(txTypes);
            const success = Math.random() > 0.05;
            const latency = Math.floor(Math.random() * 500 + 100);
            const slot = Math.floor(Math.random() * 100000 + 9000000);
            const signature = this.generateRandomHash().substring(0, 16);
            
            this.addStatusLine(
                `[SOLANA] type=${txType} slot=${slot} success=${success} latency=${latency}ms signature=${signature} schema_version=${Math.floor(Math.random() * 5) + 1}`,
                success ? 'blockchain' : 'error'
            );
        }, 900);

        // Real-time system metrics with detailed stats
        setInterval(() => {
            const timestamp = new Date().toISOString();
            const load = (Math.random() * 4 + 1).toFixed(2);
            const processes = Math.floor(Math.random() * 100 + 400);
            const openFiles = Math.floor(Math.random() * 1000 + 2000);
            const entropy = Math.floor(Math.random() * 3000 + 1000);
            const gc = (Math.random() * 50).toFixed(1);
            
            this.addStatusLine(
                `[SYSTEM] timestamp=${timestamp} load=${load} processes=${processes} open_files=${openFiles} entropy_avail=${entropy} gc_time=${gc}ms`,
                'info'
            );
        }, 700);

        // Enhanced network metrics
        setInterval(() => {
            const interfaces = ['eth0', 'eth1', 'wg0'];
            const iface = this.getRandomElement(interfaces);
            const rxBytes = Math.floor(Math.random() * 1e6);
            const txBytes = Math.floor(Math.random() * 1e6);
            const rxPackets = Math.floor(rxBytes / 1500);
            const txPackets = Math.floor(txBytes / 1500);
            const errors = Math.floor(Math.random() * 5);
            const dropped = Math.floor(Math.random() * 10);
            
            this.addStatusLine(
                `[NET] if=${iface} rx_bytes=${this.formatBytes(rxBytes)} tx_bytes=${this.formatBytes(txBytes)} rx_packets=${rxPackets} tx_packets=${txPackets} errors=${errors} dropped=${dropped} mtu=1500`,
                errors > 0 ? 'warning' : 'network'
            );
        }, 1100);

        // API Gateway metrics with detailed request tracking
        setInterval(() => {
            const endpoints = [
                '/api/v1/transactions',
                '/api/v1/accounts',
                '/api/v1/status',
                '/api/v1/schema/validate',
                '/api/v1/nomix/sync'
            ];
            const methods = ['GET', 'POST', 'PUT'];
            const endpoint = this.getRandomElement(endpoints);
            const method = this.getRandomElement(methods);
            const statusCode = Math.random() > 0.95 ? 500 : 200;
            const duration = Math.floor(Math.random() * 200);
            const ip = this.generateRandomIP();
            const userAgent = `curl/${Math.floor(Math.random() * 50 + 50)}.0`;
            
            this.addStatusLine(
                `[API] method=${method} path=${endpoint} status=${statusCode} duration=${duration}ms ip=${ip} user_agent=${userAgent} ratelimit_remaining=${Math.floor(Math.random() * 1000)}`,
                statusCode === 200 ? 'success' : 'warning'
            );
        }, 500);

        // Enhanced Redis cache operations
        setInterval(() => {
            const ops = ['SET', 'GET', 'HSET', 'LPUSH', 'ZADD', 'MULTI', 'EXEC'];
            const op = this.getRandomElement(ops);
            const keyPrefix = ['user', 'tx', 'block', 'stats', 'schema', 'validation'];
            const prefix = this.getRandomElement(keyPrefix);
            const keyId = Math.random().toString(36).substring(2, 10);
            const duration = Math.floor(Math.random() * 10);
            const memory = Math.floor(Math.random() * 1024 + 2048);
            const hits = Math.floor(Math.random() * 1000);
            
            this.addStatusLine(
                `[REDIS] op=${op} key=${prefix}:${keyId} duration=${duration}ms used_memory=${memory}M hits=${hits} clients=${Math.floor(Math.random() * 50 + 10)} qps=${Math.floor(Math.random() * 5000 + 1000)}`,
                'cache'
            );
        }, 750);

        // Schema validation metrics
        setInterval(() => {
            const schemaTypes = ['transaction', 'account', 'program', 'token'];
            const type = this.getRandomElement(schemaTypes);
            const validations = Math.floor(Math.random() * 1000 + 100);
            const failures = Math.floor(Math.random() * 10);
            const latency = (Math.random() * 100).toFixed(2);
            
            this.addStatusLine(
                `[SCHEMA] type=${type} validations=${validations} failures=${failures} avg_latency=${latency}ms cache_hits=${Math.floor(validations * 0.85)}`,
                failures > 5 ? 'warning' : 'info'
            );
        }, 1300);

        // Continue with existing intervals...
        // System metrics update - more frequent updates
        setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const metrics = [
                {
                    type: 'METRICS',
                    data: {
                        cpu: Math.floor(Math.random() * 30) + 10,
                        mem: Math.floor(Math.random() * 512) + 512,
                        lat: Math.floor(Math.random() * 50) + 5,
                        threads: Math.floor(Math.random() * 50) + 100,
                        heap: Math.floor(Math.random() * 1024) + 2048
                    }
                },
                {
                    type: 'SERVICE',
                    data: {
                        name: this.getRandomElement(this.services),
                        region: this.getRandomElement(this.serverRegions),
                        responseTime: Math.floor(Math.random() * 200) + 50,
                        status: Math.random() > 0.9 ? 'degraded' : 'healthy'
                    }
                },
                {
                    type: 'GRAPHQL',
                    data: {
                        query: this.getRandomElement(this.queries),
                        endpoint: this.getRandomElement(this.endpoints),
                        duration: Math.floor(Math.random() * 100) + 20
                    }
                }
            ];

            // Add status updates with real timestamps
            metrics.forEach(metric => {
                let message = '';
                let type = 'info';

                switch (metric.type) {
                    case 'METRICS':
                        message = `[${metric.type}] host=${this.serverId} cpu=${metric.data.cpu}% mem=${metric.data.mem}MB threads=${metric.data.threads} heap=${metric.data.heap}MB gc_pause=${Math.random() * 10}ms`;
                        type = 'system';
                        break;
                    case 'SERVICE':
                        message = `[${metric.type}] ${metric.data.name} [${metric.data.region}] health=${metric.data.status} response_time=${metric.data.responseTime}ms load=0.${Math.floor(Math.random() * 99)}`;
                        type = metric.data.status === 'healthy' ? 'success' : 'warning';
                        break;
                    case 'GRAPHQL':
                        message = `[${metric.type}] ${metric.data.endpoint} duration=${metric.data.duration}ms depth=${Math.floor(Math.random() * 5) + 1} complexity=${Math.floor(Math.random() * 100) + 50}`;
                        type = 'query';
                        break;
                }

                this.addStatusLine(message, type);
            });
        }, 1000); // Update every second for more active streaming

        // Blockchain updates
        setInterval(() => {
            const txHash = this.generateRandomHash();
            const blockNumber = Math.floor(Math.random() * 1000000) + 15000000;
            const gasUsed = Math.floor(Math.random() * 2000000) + 500000;
            const confirmations = Math.floor(Math.random() * 12) + 1;
            
            this.addStatusLine(
                `[BLOCKCHAIN] block=${blockNumber} tx=${txHash.substring(0, 18)}... gas=${gasUsed} conf=${confirmations} miners=active:${Math.floor(Math.random() * 50) + 100}`, 
                'blockchain'
            );
        }, 2500);

        // Network metrics
        setInterval(() => {
            const sourceIP = this.generateRandomIP();
            const targetIP = this.generateRandomIP();
            const bytes = Math.floor(Math.random() * 1024 * 1024 * 50);
            const packets = Math.floor(bytes / 1500);
            const loss = (Math.random() * 0.5).toFixed(3);
            
            this.addStatusLine(
                `[NETWORK] src=${sourceIP} dst=${targetIP} bytes=${this.formatBytes(bytes)} packets=${packets} loss=${loss}% route=optimal`,
                'network'
            );
        }, 1500);

        // Cache and database operations
        setInterval(() => {
            const operations = [
                'INSERT', 'UPDATE', 'SELECT', 'DELETE', 'MERGE', 'INDEX', 'ANALYZE'
            ];
            const tables = [
                'transactions', 'blocks', 'accounts', 'contracts', 'events'
            ];
            const op = this.getRandomElement(operations);
            const table = this.getRandomElement(tables);
            const rows = Math.floor(Math.random() * 10000) + 100;
            
            this.addStatusLine(
                `[DATABASE] op=${op} table=${table} rows=${rows} duration=${Math.floor(Math.random() * 100)}ms cache_hit=${(Math.random() * 100).toFixed(1)}%`,
                'cache'
            );
        }, 2000);

        // Security and auth events
        setInterval(() => {
            const events = [
                'AUTH_REQUEST', 'TOKEN_VERIFY', 'CERT_CHECK', 'PERMS_UPDATE'
            ];
            const statuses = [
                'success', 'denied', 'expired', 'renewed'
            ];
            const event = this.getRandomElement(events);
            const status = this.getRandomElement(statuses);
            
            this.addStatusLine(
                `[SECURITY] event=${event} status=${status} ip=${this.generateRandomIP()} auth_level=${Math.floor(Math.random() * 5)} latency=${Math.floor(Math.random() * 50)}ms`,
                status === 'success' ? 'success' : 'warning'
            );
        }, 3000);

        // System warnings and notifications
        setInterval(() => {
            if (Math.random() > 0.7) {
                const warnings = [
                    'High memory pressure detected',
                    'Network latency spike observed',
                    'Cache invalidation rate increased',
                    'Database connection pool near capacity',
                    'API rate limit approaching threshold'
                ];
                const warning = this.getRandomElement(warnings);
                this.addStatusLine(`[WARNING] ${warning} - initiating automated recovery`, 'warning');
            }
        }, 5000);
    }

    // Update addStatusLine to handle new status types
    addStatusLine(message, type = 'info') {
        const statusLine = document.createElement('div');
        statusLine.className = `status-line ${type}`;
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
        
        if (type === 'pending' || type === 'system' || type === 'blockchain' || type === 'warning') {
            statusLine.innerHTML = `
                <time>${timestamp}</time>
                <span class="status-indicator ${type}"></span>
                ${message}
            `;
        } else {
            statusLine.innerHTML = `<time>${timestamp}</time> ${message}`;
        }
        
        statusLine.style.opacity = '0';
        statusLine.style.transform = 'translateY(-10px)';
        this.statusFrame.appendChild(statusLine);

        // Force immediate scroll to bottom
        this.statusFrame.scrollTop = this.statusFrame.scrollHeight;
        
        requestAnimationFrame(() => {
            statusLine.style.opacity = '1';
            statusLine.style.transform = 'translateY(0)';
            // Ensure scroll to bottom again after animation
            this.statusFrame.scrollTop = this.statusFrame.scrollHeight;
        });

        // Keep more lines in the status frame but remove older ones
        while (this.statusFrame.children.length > 200) {
            const firstChild = this.statusFrame.firstChild;
            if (firstChild) {
                this.statusFrame.removeChild(firstChild);
            }
        }
    }

    // Add new method to handle auto-scrolling
    startAutoScroll() {
        // Add scroll event listener to detect manual scrolling
        let userScrolled = false;
        let scrollTimeout;

        this.statusFrame.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            userScrolled = true;

            // Reset userScrolled flag after 2 seconds of no scrolling
            scrollTimeout = setTimeout(() => {
                const isNearBottom = this.statusFrame.scrollHeight - this.statusFrame.clientHeight <= this.statusFrame.scrollTop + 50;
                if (isNearBottom) {
                    userScrolled = false;
                }
            }, 2000);
        });

        // Add a scroll-to-bottom button
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-bottom';
        scrollButton.innerHTML = '⬇';
        scrollButton.style.cssText = `
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(41, 182, 246, 0.2);
            color: #29b6f6;
            border: 1px solid rgba(41, 182, 246, 0.3);
            cursor: pointer;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 1000;
            display: none;
            backdrop-filter: blur(4px);
        `;

        this.statusFrame.style.position = 'relative';
        this.statusFrame.appendChild(scrollButton);

        // Show/hide scroll button based on scroll position
        this.statusFrame.addEventListener('scroll', () => {
            const isNearBottom = this.statusFrame.scrollHeight - this.statusFrame.clientHeight <= this.statusFrame.scrollTop + 50;
            if (!isNearBottom && this.statusFrame.scrollTop < this.statusFrame.scrollHeight - this.statusFrame.clientHeight) {
                scrollButton.style.display = 'block';
                requestAnimationFrame(() => {
                    scrollButton.style.opacity = '1';
                    scrollButton.style.transform = 'translateY(0)';
                });
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    scrollButton.style.display = 'none';
                }, 300);
            }
        });

        // Scroll to bottom when button is clicked
        scrollButton.addEventListener('click', () => {
            userScrolled = false;
            this.statusFrame.scrollTo({
                top: this.statusFrame.scrollHeight,
                behavior: 'smooth'
            });
        });

        // Add hover effect to scroll button
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.background = 'rgba(41, 182, 246, 0.3)';
            scrollButton.style.transform = 'translateY(0) scale(1.1)';
        });

        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.background = 'rgba(41, 182, 246, 0.2)';
            scrollButton.style.transform = 'translateY(0) scale(1)';
        });
    }

    async startChatSequence() {
        if (this.chatSequenceStarted) return;
        this.chatSequenceStarted = true;
        
        // Enable chat controls early
        this.chatInput.removeAttribute('readonly');
        this.sendButton.removeAttribute('disabled');

        const messages = [
            ["rolodexter", "Hey Joe, that was a little weird. Your meeting earlier."],
            ["joe", "It was okay, I've updated some notes and sent them to you."],
            ["rolodexter", "Yes, I'm already synthesizing and have some questions for you about that."],
            ["joe", "Okay, great. Let's go over that later though. Right now, I need you to set up an MVP of NOMIX. I've updated a few things about the system, pertaining to Solana transactions."],
            ["rolodexter", "Got it. Please respond to pending Jira issues posted about NOMIX schema, and I'll spin this up on a local server right away. Do you want me to deploy to a temp Vercel workspace as well?"],
            ["joe", "Sure, yes, I won't have access to ParkHealth later, so Vercel would be great."],
            ["rolodexter", "Got it, see you in a bit."]
        ];

        for (const [sender, text] of messages) {
            if (sender === "rolodexter") {
                await this.displayRolodexterMessage(text);
            } else {
                await this.simulateJoeTypingAndSending(text);
            }
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    async displayRolodexterMessage(text) {
        const div = document.createElement('div');
        div.className = 'message rolodexter';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = 'images/rolodexter.jpg';
        avatar.alt = 'rolodexter';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        
        const content = document.createElement('div');
        content.className = 'content typing';
        
        // Show typing animation first
        contentWrapper.appendChild(content);
        div.appendChild(avatar);
        div.appendChild(contentWrapper);
        this.messagesContainer.appendChild(div);

        // Special handling for synthesizing message
        if (text === "Yes, I'm already synthesizing and have some questions for you about that.") {
            const parts = text.split('synthesizing');
            const beforeText = parts[0];
            const afterText = parts[1];
            
            content.innerHTML = beforeText;
            const link = document.createElement('span');
            link.className = 'interactive-link';
            link.textContent = 'synthesizing';
            link.style.cssText = `
                color: #2196F3;
                text-decoration: underline;
                cursor: pointer;
            `;
            
            // Add highlight effect
            link.addEventListener('mouseenter', () => {
                link.style.color = '#1976D2';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.color = '#2196F3';
            });
            
            content.appendChild(link);
            content.insertAdjacentText('beforeend', afterText);
            content.classList.remove('typing');
            content.classList.add('delivered');

            // Simulate Joe's cursor clicking the link after a delay
            setTimeout(async () => {
                const cursor = document.createElement('div');
                cursor.className = 'simulated-cursor';
                cursor.style.cssText = `
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 10000;
                    transform: translate(-50%, -50%);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.8);
                `;
                document.body.appendChild(cursor);

                // Start position (from Joe's side)
                const startX = window.innerWidth - 100;
                const startY = window.innerHeight - 200;

                // Target position (the link)
                const linkRect = link.getBoundingClientRect();
                const targetX = linkRect.left + linkRect.width / 2;
                const targetY = linkRect.top + linkRect.height / 2;

                // Position cursor at start
                cursor.style.left = startX + 'px';
                cursor.style.top = startY + 'px';
                
                await this.sleep(500);

                // Move to link
                cursor.style.left = targetX + 'px';
                cursor.style.top = targetY + 'px';
                
                await this.sleep(1000);

                // Click animation
                cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursor.style.background = 'rgba(33, 150, 243, 0.8)';
                link.style.color = '#1565C0';
                link.style.transform = 'scale(0.95)';
                
                await this.sleep(200);
                
                link.style.transform = '';
                cursor.style.opacity = '0';
                
                await this.sleep(300);
                cursor.remove();

                // Show preview window
                await this.showNotesPreview();
            }, 2000);
        } else if (text.includes('Jira issues posted about NOMIX schema')) {
            const parts = text.split('Jira issues');
            const beforeText = parts[0];
            const afterText = parts[1];
            
            content.innerHTML = beforeText;
            const link = document.createElement('span');
            link.className = 'interactive-link jira-link';
            link.textContent = 'Jira issues';
            link.style.cssText = `
                color: #0052CC;
                text-decoration: underline;
                cursor: pointer;
            `;
            
            // Add hover effect
            link.addEventListener('mouseenter', () => {
                link.style.color = '#0747A6';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.color = '#0052CC';
            });
            
            content.appendChild(link);
            content.insertAdjacentText('beforeend', afterText);
            content.classList.remove('typing');
            content.classList.add('delivered');

            // Set up click handler
            link.addEventListener('click', () => this.showJiraPreview());
            
            // Simulate Joe's cursor clicking the link after a delay
            setTimeout(() => this.simulateJiraClick(), 2000);
        } else {
            await this.simulateTypingEffect(content, text);
        }
        
        // Add timestamp with date
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        const dateTime = new Date();
        const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
        timestamp.innerHTML = `${formattedDateTime} <span class="ip-address">${this.sessionIPs.rolodexter}</span>`;
        contentWrapper.appendChild(timestamp);
        
        await this.sleep(2000);
    }

    async showNotesPreview() {
        return new Promise(async (resolve) => {
            const linkElement = document.querySelector('.interactive-link');
            const previewContainer = document.createElement('div');
            previewContainer.className = 'notes-preview-container';
            
            // Position relative to the link
            const linkRect = linkElement.getBoundingClientRect();
            
            // Position the preview just above and to the right of the link
            const topPosition = linkRect.top - 10; // Slightly higher than the link
            const leftPosition = linkRect.right + 10; // Slightly to the right of the link
            
            previewContainer.style.cssText = `
                position: fixed;
                top: ${topPosition}px;
                left: ${leftPosition}px;
                width: 280px;
                height: 240px;
                background: rgba(255, 255, 255, 0.98);
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 1000;
                opacity: 0;
                transform-origin: top left;
                transform: scale(0.95);
                animation: windowOpen 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            `;

            // Add connecting line to link
            const connector = document.createElement('div');
            connector.style.cssText = `
                position: absolute;
                left: -10px;
                top: 20px;
                width: 10px;
                height: 2px;
                background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1));
            `;
            previewContainer.appendChild(connector);

            // Add macOS-like window chrome
            const windowControls = document.createElement('div');
            windowControls.className = 'window-controls';
            windowControls.innerHTML = '<span></span>';
            windowControls.style.cssText = `
                position: absolute;
                top: 8px;
                left: 8px;
                display: flex;
                gap: 6px;
            `;

            const windowTitle = document.createElement('div');
            windowTitle.className = 'window-title';
            windowTitle.textContent = 'Meeting Notes';
            windowTitle.style.cssText = `
                position: absolute;
                top: 8px;
                left: 0;
                right: 0;
                text-align: center;
                color: #666;
                font-size: 12px;
                font-weight: 500;
            `;

            // Add notes content
            const content = document.createElement('div');
            content.className = 'notes-preview-content';
            content.style.cssText = `
                margin-top: 32px;
                padding: 15px;
                height: calc(100% - 32px);
                overflow-y: auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            content.innerHTML = `
                <div style="color: #333;">
                    <p><strong>Key Points:</strong></p>
                    <ul style="padding-left: 20px; margin: 10px 0;">
                        <li>NOMIX integration timeline</li>
                        <li>Solana transaction flow updates</li>
                        <li>Schema modifications required</li>
                        <li>Performance considerations</li>
                    </ul>
                    <p><strong>Action Items:</strong></p>
                    <ul style="padding-left: 20px; margin: 10px 0;">
                        <li>Update validation schema</li>
                        <li>Configure Vercel deployment</li>
                        <li>Review Jira tickets</li>
                    </ul>
                </div>
            `;

            previewContainer.appendChild(windowControls);
            previewContainer.appendChild(windowTitle);
            previewContainer.appendChild(content);
            document.body.appendChild(previewContainer);

            // Handle closing
            const closePreview = () => {
                previewContainer.style.animation = 'windowClose 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                setTimeout(() => {
                    previewContainer.remove();
                    resolve();
                }, 200);
            };

            // Close on clicking window controls
            windowControls.addEventListener('click', closePreview);

            // Close on clicking outside
            const handleOutsideClick = (e) => {
                if (!previewContainer.contains(e.target)) {
                    closePreview();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };

            // Add click listener after a small delay
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
            }, 100);

            // Auto-close after delay if user hasn't interacted
            const autoCloseTimeout = setTimeout(() => {
                if (document.body.contains(previewContainer)) {
                    closePreview();
                }
            }, 5000);

            // Simulate Joe's cursor clicking to close the window after 4 seconds
            setTimeout(async () => {
                const cursor = document.createElement('div');
                cursor.className = 'simulated-cursor';
                cursor.style.cssText = `
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 10001;
                    transform: translate(-50%, -50%);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.8);
                `;
                document.body.appendChild(cursor);

                // Start position (from Joe's side)
                const startX = window.innerWidth - 100;
                const startY = window.innerHeight - 200;

                // Get close button position
                const closeButtonRect = windowControls.getBoundingClientRect();
                const targetX = closeButtonRect.left + 12; // Target the red close button
                const targetY = closeButtonRect.top + 12;

                // Position cursor at start
                cursor.style.left = startX + 'px';
                cursor.style.top = startY + 'px';
                
                await this.sleep(500);

                // Move to close button
                cursor.style.left = targetX + 'px';
                cursor.style.top = targetY + 'px';
                
                await this.sleep(1000);

                // Click animation
                cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursor.style.background = 'rgba(33, 150, 243, 0.8)';
                
                await this.sleep(200);
                
                // Close the window
                closePreview();
                
                cursor.style.opacity = '0';
                await this.sleep(300);
                cursor.remove();
                resolve();
            }, 4000);
        });
    }

    async simulateTypingEffect(element, text) {
        element.textContent = '';
        element.classList.add('typing');
        
        for (const char of text) {
            element.textContent += char;
            await this.sleep(Math.random() * 30 + 20);
        }
        
        element.classList.remove('typing');
        element.classList.add('delivered');
    }

    async simulateJoeTypingAndSending(text) {
        // Show typing indicator in chat input
        this.chatInput.value = '';
        this.chatInput.focus();
        this.chatInput.classList.add('typing');
        
        // Add sending indicator
        const sendingIndicator = document.createElement('div');
        sendingIndicator.className = 'sending-indicator';
        sendingIndicator.textContent = 'Joe is typing';
        this.chatInput.parentElement.insertBefore(sendingIndicator, this.chatInput);
        sendingIndicator.classList.add('visible');
        
        // Simulate typing
        for (const char of text) {
            this.chatInput.value += char;
            await this.sleep(Math.random() * 50 + 30);
        }
        
        sendingIndicator.remove();
        this.chatInput.classList.remove('typing');
        
        await this.sleep(500);
        
        // Animate send button
        this.sendButton.classList.add('active');
        this.sendButton.style.transform = 'scale(0.95)';
        await this.sleep(100);
        this.sendButton.style.transform = '';
        this.sendButton.classList.remove('active');
        
        // Create and display message with animation
        const div = document.createElement('div');
        div.className = 'message joe';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = 'images/joe.jpg';
        avatar.alt = 'joe';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = text;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        const dateTime = new Date();
        const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
        timestamp.innerHTML = `${formattedDateTime} <span class="ip-address">${this.sessionIPs.joe}</span>`;
        
        contentWrapper.appendChild(content);
        contentWrapper.appendChild(timestamp);
        div.appendChild(avatar);
        div.appendChild(contentWrapper);
        this.messagesContainer.appendChild(div);
        
        // Clear input and scroll
        this.chatInput.value = '';
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        await this.sleep(2000);
    }

    // Add event listeners for the chat form
    initChatControls() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = this.chatInput.value.trim();
            if (message) {
                // Visual feedback for button click
                this.sendButton.classList.add('active');
                this.sendButton.style.background = '#e0e0e0';
                setTimeout(() => {
                    this.sendButton.style.background = '';
                    this.sendButton.classList.remove('active');
                }, 100);

                const div = document.createElement('div');
                div.className = 'message joe';
                
                const avatar = document.createElement('img');
                avatar.className = 'avatar';
                avatar.src = 'images/joe.jpg';
                avatar.alt = 'joe';
                
                const content = document.createElement('div');
                content.className = 'content';
                content.textContent = message;
                
                div.appendChild(avatar);
                div.appendChild(content);
                this.messagesContainer.appendChild(div);
                
                this.chatInput.value = '';
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        });

        // Add visual feedback for the send button on hover
        this.sendButton.addEventListener('mouseenter', () => {
            if (!this.sendButton.disabled) {
                this.sendButton.style.background = '#ebebeb';
            }
        });
        
        this.sendButton.addEventListener('mouseleave', () => {
            if (!this.sendButton.disabled) {
                this.sendButton.style.background = '';
            }
        });

        // Initialize cloud provider buttons
        document.querySelectorAll('.cloud-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = e.currentTarget.classList[1]; // aws, azure, gcp, or vercel
                this.selectedCloudProvider = provider;
                
                // Remove active state from all buttons
                document.querySelectorAll('.cloud-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active state to selected button
                e.currentTarget.classList.add('active');
                
                // Add status line for cloud provider selection
                this.addStatusLine(`[CLOUD] Selected provider: ${this.cloudProviders[provider].name}`, provider);
            });
        });

        // Initialize macro selection
        this.modelSelect.addEventListener('change', (e) => {
            const selectedMacro = e.target.value;
            this.addStatusLine(`[MACRO] Selected macro: ${this.macros[selectedMacro]}`, 'info');
        });
    }

    async simulateJiraClick() {
        const cursor = document.createElement('div');
        cursor.className = 'simulated-cursor';
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.8);
        `;
        document.body.appendChild(cursor);

        // Get link position
        const link = document.querySelector('.jira-link');
        if (!link) {
            cursor.remove();
            return;
        }

        const linkRect = link.getBoundingClientRect();
        
        // Start position (from Joe's side)
        const startX = window.innerWidth - 100;
        const startY = window.innerHeight - 200;

        // Position cursor at start
        cursor.style.left = startX + 'px';
        cursor.style.top = startY + 'px';
        
        await this.sleep(500);

        // Move to link
        cursor.style.left = (linkRect.left + linkRect.width / 2) + 'px';
        cursor.style.top = (linkRect.top + linkRect.height / 2) + 'px';
        
        await this.sleep(1000);

        // Click animation
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursor.style.background = 'rgba(0, 82, 204, 0.8)';
        link.style.color = '#0747A6';
        link.style.transform = 'scale(0.95)';
        
        await this.sleep(200);
        
        // Show Jira preview
        this.showJiraPreview();
        
        link.style.transform = '';
        cursor.style.opacity = '0';
        
        await this.sleep(300);
        cursor.remove();
    }

    async showJiraPreview() {
        // Remove any existing preview
        const existing = document.querySelector('.jira-preview-container');
        if (existing) existing.remove();

        // Create and add preview
        const container = document.createElement('div');
        container.innerHTML = jiraStyles + jiraPreviewHTML;
        document.body.appendChild(container);

        const preview = container.querySelector('.jira-preview-container');
        
        // Add click handler to close when clicking outside
        const handleOutsideClick = (e) => {
            if (!preview.contains(e.target)) {
                preview.style.animation = 'windowClose 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                setTimeout(() => container.remove(), 200);
                document.removeEventListener('click', handleOutsideClick);
            }
        };

        // Add click listener after a small delay
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);

        // Auto-close after delay if user hasn't interacted
        setTimeout(() => {
            if (document.body.contains(container)) {
                preview.style.animation = 'windowClose 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                setTimeout(() => container.remove(), 200);
            }
        }, 5000);
    }
}

// Add Jira preview HTML and styles
const jiraPreviewHTML = `
    <div class="jira-preview-container">
        <div class="window-controls"><span></span></div>
        <div class="window-title">Jira Issues - NOMIX Schema</div>
        <div class="jira-content">
            <div class="issue">
                <div class="issue-header">
                    <span class="issue-key">NOMIX-123</span>
                    <span class="priority high">🔥 High</span>
                </div>
                <h3>Update Solana Transaction Schema</h3>
                <p>Schema needs to be updated to accommodate new Solana transaction types and metadata fields.</p>
                <ul>
                    <li>Add support for SPL token transfers</li>
                    <li>Include program invocation context</li>
                    <li>Update signature verification process</li>
                </ul>
                <div class="issue-meta">
                    <span class="assignee">Assigned to: Joe Maristela</span>
                    <span class="status">Status: In Progress</span>
                </div>
            </div>
            <div class="issue">
                <div class="issue-header">
                    <span class="issue-key">NOMIX-124</span>
                    <span class="priority medium">⚡ Medium</span>
                </div>
                <h3>Implement Schema Validation</h3>
                <p>Create validation rules for new schema fields and implement error handling.</p>
                <div class="issue-meta">
                    <span class="assignee">Assigned to: Joe Maristela</span>
                    <span class="status">Status: To Do</span>
                </div>
            </div>
        </div>
    </div>
`;

const jiraStyles = `
<style>
    .jira-preview-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 480px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: windowOpen 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .window-controls {
        padding: 8px;
        border-bottom: 1px solid #eee;
    }
    .window-title {
        text-align: center;
        padding: 8px;
        font-size: 14px;
        color: #42526E;
        font-weight: 500;
    }
    .jira-content {
        padding: 16px;
        max-height: 70vh;
        overflow-y: auto;
    }
    .issue {
        border: 1px solid #DFE1E6;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 16px;
    }
    .issue-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }
    .issue-key {
        background: #DEEBFF;
        color: #0747A6;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 16px;
    }
    .issue-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }
    .issue-key {
        background: #DEEBFF;
        color: #0747A6;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 500;
    }
    .priority {
        margin-left: 8px;
        font-size: 12px;
    }
    .priority.high { color: #DE350B; }
    .priority.medium { color: #FF991F; }
    .issue h3 {
        margin: 0 0 8px;
        font-size: 16px;
        color: #172B4D;
    }
    .issue p {
        margin: 0 0 12px;
        color: #42526E;
        font-size: 14px;
        line-height: 1.4;
    }
    .issue ul {
        margin: 0 0 12px;
        padding-left: 24px;
        color: #42526E;
    }
    .issue-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #5E6C84;
        border-top: 1px solid #DFE1E6;
        padding-top: 12px;
        margin-top: 12px;
    }
    @keyframes windowOpen {
        from { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes windowClose {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
    }
</style>
`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!window.simulationInstance) {
        window.simulationInstance = new WebTerminalSimulation();
    }
});