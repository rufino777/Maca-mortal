/**
 * MAÇÃ MORTAL - Motor Principal do Jogo com Lobby Futurista,
 * Perfil do Jogador, Ranking Global, Mapa de Fases e Loja de Skins.
 */

(function () {
    'use strict';

    const GRID_SIZE = 20;
    let CELL_SIZE = 28;

    // Catálogo de Roupas e Skins da Serpente
    const SKINS = {
        emerald: {
            id: 'emerald',
            name: 'Ciber Esmeralda',
            desc: 'Visual padrão com núcleo de plasma esmeralda e placas aerodinâmicas.',
            price: 0,
            head: '#00f59b',
            headSec: '#00a366',
            bodyStart: '#00f59b',
            bodyEnd: '#007a4d',
            glow: 'rgba(0, 245, 155, 0.65)',
            eyeColor: '#00e5ff',
            accessory: 'visor',
            icon: '🐍'
        },
        cyan: {
            id: 'cyan',
            name: 'Trovão Neon',
            desc: 'Escamas carregadas com relâmpago de alta voltagem e antenas de plasma.',
            price: 15,
            head: '#00e5ff',
            headSec: '#0077b6',
            bodyStart: '#48cae4',
            bodyEnd: '#023e8a',
            glow: 'rgba(0, 229, 255, 0.7)',
            eyeColor: '#ffd23f',
            accessory: 'lightning',
            icon: '⚡'
        },
        fire: {
            id: 'fire',
            name: 'Dragão de Lava',
            desc: 'Par de chifres pontiagudos de obsidiana flamejante e escamas de magma incandescente.',
            price: 30,
            head: '#ff2a5f',
            headSec: '#b00020',
            bodyStart: '#ff7b00',
            bodyEnd: '#8b0000',
            glow: 'rgba(255, 42, 95, 0.75)',
            eyeColor: '#ffff00',
            accessory: 'horns',
            icon: '🔥'
        },
        purple: {
            id: 'purple',
            name: 'Vazio Cósmico',
            desc: 'Aura interestelar púrpura com halo cósmico e brilho de poeira estelar.',
            price: 50,
            head: '#b34bfb',
            headSec: '#5a189a',
            bodyStart: '#9d4edd',
            bodyEnd: '#240046',
            glow: 'rgba(179, 75, 251, 0.75)',
            eyeColor: '#f72585',
            accessory: 'halo',
            icon: '🔮'
        },
        gold: {
            id: 'gold',
            name: 'Imperador Dourado',
            desc: 'Coroa de ouro puro esculpida com rubi imperial e escamas banhadas a ouro reluzente.',
            price: 80,
            head: '#ffd23f',
            headSec: '#c68a00',
            bodyStart: '#ffe680',
            bodyEnd: '#805b00',
            glow: 'rgba(255, 210, 63, 0.85)',
            eyeColor: '#ffffff',
            accessory: 'crown',
            icon: '👑'
        },
        reaper: {
            id: 'reaper',
            name: 'Ceifador Mortal',
            desc: 'Máscara sombria com olhos vermelhos brilhantes e aura espectral do submundo.',
            price: 120,
            head: '#1b1e2e',
            headSec: '#090b12',
            bodyStart: '#ff0055',
            bodyEnd: '#100008',
            glow: 'rgba(255, 0, 85, 0.9)',
            eyeColor: '#ff0033',
            accessory: 'skull',
            icon: '💀'
        }
    };

    // Tipos de Frutas
    const FRUIT_TYPES = {
        apple: { id: 'apple', name: 'Maçã Vermelha', points: 100, goalValue: 1, minLevel: 1, color: '#ff2a5f' },
        grape: { id: 'grape', name: 'Uva Cósmica', points: 180, goalValue: 1, minLevel: 2, color: '#a855f7' },
        orange: { id: 'orange', name: 'Laranja Solar', points: 240, goalValue: 1, minLevel: 3, color: '#f97316' },
        watermelon: { id: 'watermelon', name: 'Melancia Mortal', points: 400, goalValue: 2, minLevel: 4, color: '#22c55e' }
    };

    // Definição das Fases do Jogo
    const LEVEL_DEFINITIONS = [
        { level: 1, goal: 5, fruitIcon: '🍎', name: 'O Começo Mortal', desc: '5 Frutas para avançar' },
        { level: 2, goal: 7, fruitIcon: '🍇', name: 'Pomar Cósmico', desc: '7 Frutas Cósmicas' },
        { level: 3, goal: 9, fruitIcon: '🍊', name: 'Pomar Solar', desc: '9 Frutas Solares' },
        { level: 4, goal: 11, fruitIcon: '🍉', name: 'Banquete Suculento', desc: '11 Frutas com Melancia' },
        { level: 5, goal: 13, fruitIcon: '☠️', name: 'Invasão Mortal', desc: '13 Frutas • Mais Perigo' },
        { level: 6, goal: 15, fruitIcon: '⚡', name: 'Fúria Elétrica', desc: '15 Frutas • Alta Velocidade' },
        { level: 7, goal: 17, fruitIcon: '🔥', name: 'Caldeirão de Magma', desc: '17 Frutas • Maçãs Mortais Rápidas' },
        { level: 8, goal: 19, fruitIcon: '🔮', name: 'Vórtice do Vazio', desc: '19 Frutas • Desafio Extremo' },
        { level: 9, goal: 21, fruitIcon: '👑', name: 'Câmara Imperial', desc: '21 Frutas • Sobrevivência Pro' },
        { level: 10, goal: 25, fruitIcon: '💀', name: 'O Ceifador Final', desc: '25 Frutas • Lenda Suprema' }
    ];

    class Game {
        constructor() {
            // Telas Principais
            this.lobbyView = document.getElementById('lobbyView');
            this.gameView = document.getElementById('gameView');

            // Canvas da Partida
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.wrapper = document.getElementById('canvasWrapper');

            // Canvas da Vitrine da Minhoca no Lobby
            this.showcaseCanvas = document.getElementById('showcaseCanvas');
            this.showcaseCtx = this.showcaseCanvas ? this.showcaseCanvas.getContext('2d') : null;

            // Elementos HUD da Partida
            this.scoreEl = document.getElementById('scoreValue');
            this.highScoreEl = document.getElementById('highScoreValue');
            this.levelEl = document.getElementById('levelValue');
            this.levelProgressBar = document.getElementById('levelProgressBar');
            this.levelProgressText = document.getElementById('levelProgressText');
            this.gemsHeaderDisplay = document.getElementById('gemsCount');
            this.lobbyGemsDisplay = document.getElementById('lobbyGemsDisplay');
            this.heart = document.getElementById('heart1');
            this.alertBanner = document.getElementById('mortalAlertBanner');
            this.turboHudCard = document.getElementById('hudTurboCard');
            this.turboHudText = document.getElementById('hudTurboText');
            this.dpadTurboBtn = document.getElementById('dpadTurbo');

            // Modais
            this.shopModal = document.getElementById('shopModal');
            this.profileModal = document.getElementById('profileModal');
            this.rankingModal = document.getElementById('rankingModal');
            this.levelSelectModal = document.getElementById('levelSelectModal');
            this.helpModal = document.getElementById('helpModal');
            this.pauseScreen = document.getElementById('pauseScreen');
            this.gameOverScreen = document.getElementById('gameOverScreen');
            this.levelUpModal = document.getElementById('levelUpModal');

            // Perfil e Dados Persistentes
            this.highScore = parseInt(localStorage.getItem('maca_mortal_highscore') || '0', 10);
            this.highScoreEl.textContent = this.highScore.toLocaleString();

            this.gems = parseInt(localStorage.getItem('maca_mortal_gems') || '0', 10);
            this.unlockedSkins = JSON.parse(localStorage.getItem('maca_mortal_unlocked_skins') || '["emerald"]');
            this.selectedSkin = localStorage.getItem('maca_mortal_skin') || 'emerald';

            this.playerName = localStorage.getItem('maca_mortal_player_name') || 'Serpente Mestre';
            this.playerAvatar = localStorage.getItem('maca_mortal_player_avatar') || '🐍';
            this.highestLevel = parseInt(localStorage.getItem('maca_mortal_max_level') || '1', 10);
            this.totalFruits = parseInt(localStorage.getItem('maca_mortal_total_fruits') || '0', 10);

            // Estado da Partida
            this.isRunning = false;
            this.isPaused = false;
            this.score = 0;
            this.fruitsEaten = 0;
            this.lives = 1;
            this.combo = 1;
            this.lastFruitTime = 0;
            this.maxCombo = 1;

            // Fases
            this.level = 1;
            this.levelProgress = 0;
            this.levelGoal = 5;

            // Cobra
            const initX = Math.floor(GRID_SIZE / 2);
            const initY = Math.floor(GRID_SIZE / 2);
            this.snake = [
                { x: initX, y: initY, prevX: initX, prevY: initY },
                { x: initX - 1, y: initY, prevX: initX - 1, prevY: initY },
                { x: initX - 2, y: initY, prevX: initX - 2, prevY: initY }
            ];
            this.direction = { x: 1, y: 0 };
            this.inputQueue = [];
            this.baseSpeed = 85;
            this.speed = 85;
            this.isBoosting = false;
            this.lastTick = 0;
            this.shieldTimer = 0;

            // Frutas & Perigos
            this.currentFruit = { type: 'apple', points: 100, goalValue: 1, color: '#ff2a5f', x: initX + 4, y: initY, spawnTime: Date.now() };
            this.mortalApples = [];
            this.goldenApple = null;
            this.mortalSpawnCounter = 0;

            // Partículas
            this.particles = [];
            this.floatingTexts = [];
            this.screenShake = 0;
            this.trailParticles = [];

            // Touch
            this.touchStartX = 0;
            this.touchStartY = 0;

            this.initCanvasSize();
            this.setupEvents();
            this.updateProfileUI();
            this.updateGemsDisplay();
            this.renderLevelsGrid();
            this.renderShop();
            this.startLoop();
        }

        initCanvasSize() {
            const size = 560;
            this.canvas.width = size;
            this.canvas.height = size;
            CELL_SIZE = size / GRID_SIZE;
        }

        setupEvents() {
            window.addEventListener('resize', () => this.initCanvasSize());
            window.addEventListener('keydown', (e) => this.handleKeyDown(e));
            window.addEventListener('keyup', (e) => this.handleKeyUp(e));

            // Transição Lobby / Partida
            document.getElementById('btnPlayFromLobby').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.startMatchAtLevel(this.highestLevel);
            });

            document.getElementById('btnBackToLobby').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.returnToLobby();
            });

            document.getElementById('btnPauseToLobby').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.pauseScreen.classList.remove('active');
                this.returnToLobby();
            });

            document.getElementById('btnGameOverToLobby').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.gameOverScreen.classList.remove('active');
                this.returnToLobby();
            });

            document.getElementById('btnLevelUpToLobby').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.levelUpModal.classList.remove('active');
                this.returnToLobby();
            });

            // Abertura de Modais no Lobby
            document.getElementById('btnOpenShopFromLobby').addEventListener('click', () => this.openShop());
            document.getElementById('btnPedestalToShop').addEventListener('click', () => this.openShop());
            document.getElementById('btnGameShop').addEventListener('click', () => this.openShop());
            document.getElementById('btnCloseShop').addEventListener('click', () => this.closeShop());

            document.getElementById('btnOpenProfile').addEventListener('click', () => this.openProfile());
            document.getElementById('btnOpenProfileFromLobby').addEventListener('click', () => this.openProfile());
            document.getElementById('btnCloseProfile').addEventListener('click', () => this.closeProfile());

            document.getElementById('btnOpenRankingFromLobby').addEventListener('click', () => this.openRanking());
            document.getElementById('btnCloseRanking').addEventListener('click', () => this.closeRanking());

            document.getElementById('btnOpenLevelsFromLobby').addEventListener('click', () => this.openLevelSelect());
            document.getElementById('btnCloseLevelSelect').addEventListener('click', () => this.closeLevelSelect());

            // Sons e Ajuda
            const toggleAudio = () => {
                const isMuted = window.soundCtrl.toggleMute();
                const icon = isMuted ? '🔇' : '🔊';
                document.getElementById('soundIcon').textContent = icon;
                document.getElementById('lobbySoundIcon').textContent = icon;
                window.soundCtrl.playClick();
            };
            document.getElementById('btnSound').addEventListener('click', toggleAudio);
            document.getElementById('btnLobbySound').addEventListener('click', toggleAudio);

            const openHelp = () => {
                window.soundCtrl.playClick();
                this.helpModal.classList.add('open');
            };
            document.getElementById('btnLobbyHelp').addEventListener('click', openHelp);
            document.getElementById('btnCloseHelp').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.helpModal.classList.remove('open');
            });
            document.getElementById('btnHelpGotIt').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.helpModal.classList.remove('open');
            });

            // Controles de Jogo
            document.getElementById('btnPause').addEventListener('click', () => this.togglePause());
            document.getElementById('btnResume').addEventListener('click', () => this.togglePause());
            document.getElementById('btnRestartFromPause').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.pauseScreen.classList.remove('active');
                this.startMatchAtLevel(this.level);
            });
            document.getElementById('btnPlayAgain').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.startMatchAtLevel(this.level);
            });
            document.getElementById('btnNextLevel').addEventListener('click', () => {
                window.soundCtrl.playClick();
                this.nextLevel();
            });

            // Perfil - Seleção de Avatar
            document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.avatar-opt-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.playerAvatar = btn.dataset.avatar;
                    window.soundCtrl.playClick();
                });
            });

            // Perfil - Salvar Nome
            document.getElementById('btnSaveProfile').addEventListener('click', () => {
                const input = document.getElementById('playerNameInput');
                const newName = input.value.trim();
                if (newName) {
                    this.playerName = newName;
                    localStorage.setItem('maca_mortal_player_name', this.playerName);
                    localStorage.setItem('maca_mortal_player_avatar', this.playerAvatar);
                    window.soundCtrl.playBuy();
                    this.updateProfileUI();
                    this.closeProfile();
                }
            });

            // D-Pad Virtual (Touch)
            const dpadButtons = [
                { id: 'dpadUp', x: 0, y: -1 },
                { id: 'dpadDown', x: 0, y: 1 },
                { id: 'dpadLeft', x: -1, y: 0 },
                { id: 'dpadRight', x: 1, y: 0 }
            ];

            dpadButtons.forEach(({ id, x, y }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('pointerdown', (e) => {
                        e.preventDefault();
                        this.setDirection(x, y);
                    });
                }
            });

            // Botão Turbo Virtual (Touch)
            const turboBtn = document.getElementById('dpadTurbo');
            if (turboBtn) {
                const activateTurbo = (e) => {
                    e.preventDefault();
                    this.setTurbo(true);
                };
                const deactivateTurbo = (e) => {
                    e.preventDefault();
                    this.setTurbo(false);
                };
                turboBtn.addEventListener('pointerdown', activateTurbo);
                turboBtn.addEventListener('pointerup', deactivateTurbo);
                turboBtn.addEventListener('pointercancel', deactivateTurbo);
                turboBtn.addEventListener('pointerleave', deactivateTurbo);
            }

            // Gestos de Swipe
            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    this.touchStartX = e.touches[0].clientX;
                    this.touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            this.canvas.addEventListener('touchend', (e) => {
                if (!this.isRunning || this.isPaused) return;
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const dx = touchEndX - this.touchStartX;
                const dy = touchEndY - this.touchStartY;

                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                    this.setDirection(dx > 0 ? 1 : -1, 0);
                } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
                    this.setDirection(0, dy > 0 ? 1 : -1);
                }
            }, { passive: true });

            if (window.soundCtrl.muted) {
                document.getElementById('soundIcon').textContent = '🔇';
                document.getElementById('lobbySoundIcon').textContent = '🔇';
            }
        }

        // ==================== LOBBY & TRANSIÇÕES ====================

        returnToLobby() {
            this.isRunning = false;
            this.isPaused = false;
            this.gameView.classList.remove('active');
            this.lobbyView.classList.add('active');
            this.updateProfileUI();
            this.updateGemsDisplay();
        }

        startMatchAtLevel(targetLevel) {
            this.level = Math.max(1, targetLevel);
            const def = LEVEL_DEFINITIONS.find(l => l.level === this.level) || { goal: 5 + (this.level - 1) * 2 };
            this.levelGoal = def.goal;
            this.levelProgress = 0;

            this.lobbyView.classList.remove('active');
            this.gameView.classList.add('active');
            this.pauseScreen.classList.remove('active');
            this.gameOverScreen.classList.remove('active');
            this.levelUpModal.classList.remove('active');

            this.score = 0;
            this.fruitsEaten = 0;
            this.lives = 1;
            this.combo = 1;
            this.maxCombo = 1;
            this.baseSpeed = Math.max(48, 85 - (this.level - 1) * 4);
            this.speed = this.baseSpeed;
            this.isBoosting = false;
            this.updateTurboUI();
            this.direction = { x: 1, y: 0 };
            this.inputQueue = [];
            this.shieldTimer = 0;
            this.mortalSpawnCounter = 0;

            this.particles = [];
            this.floatingTexts = [];
            this.mortalApples = [];
            this.goldenApple = null;
            this.trailParticles = [];

            const startX = Math.floor(GRID_SIZE / 2);
            const startY = Math.floor(GRID_SIZE / 2);
            this.snake = [
                { x: startX, y: startY, prevX: startX, prevY: startY },
                { x: startX - 1, y: startY, prevX: startX - 1, prevY: startY },
                { x: startX - 2, y: startY, prevX: startX - 2, prevY: startY }
            ];

            this.spawnFruit();
            this.updateHUD();

            this.isRunning = true;
            this.isPaused = false;
            this.lastTick = performance.now();
            this.wrapper.classList.remove('mortal-active');
            this.alertBanner.classList.remove('visible');

            window.soundCtrl.playClick();
        }

        getHonorTitle(level) {
            if (level >= 10) return 'Ceifador Supremo 💀';
            if (level >= 7) return 'Predador Mortal 🔥';
            if (level >= 5) return 'Caçador Tóxico ⚡';
            if (level >= 3) return 'Serpente Veloz 🐍';
            return 'Recruta da Maçã 🍎';
        }

        updateProfileUI() {
            document.getElementById('lobbyNameDisplay').textContent = this.playerName;
            document.getElementById('lobbyAvatarDisplay').textContent = this.playerAvatar;

            const title = this.getHonorTitle(this.highestLevel);
            document.getElementById('lobbyTitleDisplay').textContent = `Fase ${this.highestLevel} • ${title}`;
            document.getElementById('lobbyPlaySubtitle').textContent = `Iniciar Fase ${this.highestLevel} ⚡`;
            document.getElementById('lobbyLevelsUnlocked').textContent = `Fases 1/${this.highestLevel} Liberadas`;

            // Showcase Skin
            const skin = SKINS[this.selectedSkin] || SKINS.emerald;
            document.getElementById('showcaseSkinName').textContent = skin.name;
            document.getElementById('showcaseSkinIcon').textContent = skin.icon;
        }

        updateGemsDisplay() {
            this.gemsHeaderDisplay.textContent = this.gems.toLocaleString();
            this.lobbyGemsDisplay.textContent = this.gems.toLocaleString();
            const shopBal = document.getElementById('shopGemsBalance');
            if (shopBal) shopBal.textContent = this.gems.toLocaleString();
            localStorage.setItem('maca_mortal_gems', this.gems);
        }

        // ==================== MODAL DE PERFIL ====================

        openProfile() {
            window.soundCtrl.playClick();
            document.getElementById('playerNameInput').value = this.playerName;
            document.getElementById('profileMaxLevel').textContent = `Fase ${this.highestLevel}`;
            document.getElementById('profileHighScore').textContent = `${this.highScore.toLocaleString()} pts`;
            document.getElementById('profileTotalFruits').textContent = this.totalFruits.toLocaleString();
            document.getElementById('profileGems').textContent = `💎 ${this.gems.toLocaleString()}`;
            document.getElementById('profileHonorTitle').textContent = this.getHonorTitle(this.highestLevel);

            // Marca avatar ativo
            document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
                if (btn.dataset.avatar === this.playerAvatar) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            this.profileModal.classList.add('open');
        }

        closeProfile() {
            window.soundCtrl.playClick();
            this.profileModal.classList.remove('open');
        }

        // ==================== MODAL DE RANKING ====================

        openRanking() {
            window.soundCtrl.playClick();
            this.renderLeaderboard();
            this.rankingModal.classList.add('open');
        }

        closeRanking() {
            window.soundCtrl.playClick();
            this.rankingModal.classList.remove('open');
        }

        renderLeaderboard() {
            const listEl = document.getElementById('leaderboardList');
            if (!listEl) return;
            listEl.innerHTML = '';

            // Competidores Virtuais + Jogador Real
            const rivals = [
                { name: 'ViperX', avatar: '👑', level: 14, score: 38200 },
                { name: 'ShadowFang', avatar: '💀', level: 11, score: 27500 },
                { name: 'ThunderStrike', avatar: '⚡', level: 9, score: 19800 },
                { name: 'Pyros', avatar: '🔥', level: 7, score: 13400 },
                { name: 'VoidWalker', avatar: '🔮', level: 5, score: 8900 },
                { name: 'DragonBreath', avatar: '🐲', level: 4, score: 6200 },
                { name: 'Venomous', avatar: '🐍', level: 2, score: 2800 },
                { name: 'SlitherKid', avatar: '🍏', level: 1, score: 950 }
            ];

            // Insere o jogador
            const allPlayers = [
                ...rivals,
                {
                    name: `${this.playerName} (Você)`,
                    avatar: this.playerAvatar,
                    level: this.highestLevel,
                    score: this.highScore,
                    isCurrentPlayer: true
                }
            ];

            // Ordena por maior fase alcançada decrescente, e por pontuação
            allPlayers.sort((a, b) => b.level - a.level || b.score - a.score);

            allPlayers.forEach((player, idx) => {
                const rankNum = idx + 1;
                let rankBadge = `${rankNum}º`;
                if (rankNum === 1) rankBadge = '🥇';
                else if (rankNum === 2) rankBadge = '🥈';
                else if (rankNum === 3) rankBadge = '🥉';

                const row = document.createElement('div');
                row.className = `leaderboard-row ${player.isCurrentPlayer ? 'player-row' : ''}`;
                row.innerHTML = `
                    <span class="rank-num">${rankBadge}</span>
                    <span class="rank-player">
                        <span>${player.avatar}</span>
                        <span>${player.name}</span>
                    </span>
                    <span class="rank-level">Fase ${player.level}</span>
                    <span class="rank-score">${player.score.toLocaleString()} pts</span>
                `;
                listEl.appendChild(row);
            });
        }

        // ==================== MODAL MAPA DE FASES ====================

        openLevelSelect() {
            window.soundCtrl.playClick();
            this.renderLevelsGrid();
            this.levelSelectModal.classList.add('open');
        }

        closeLevelSelect() {
            window.soundCtrl.playClick();
            this.levelSelectModal.classList.remove('open');
        }

        renderLevelsGrid() {
            const gridEl = document.getElementById('levelsGrid');
            if (!gridEl) return;
            gridEl.innerHTML = '';

            LEVEL_DEFINITIONS.forEach(def => {
                const isUnlocked = def.level <= this.highestLevel;
                const card = document.createElement('div');
                card.className = `level-node-card ${isUnlocked ? 'unlocked' : 'locked'}`;

                card.innerHTML = `
                    <div class="level-node-icon">${isUnlocked ? def.fruitIcon : '🔒'}</div>
                    <div class="level-node-title">Fase ${def.level}</div>
                    <div class="level-node-target">${def.desc}</div>
                    <button class="level-node-btn">${isUnlocked ? 'JOGAR' : 'Bloqueado'}</button>
                `;

                if (isUnlocked) {
                    card.addEventListener('click', () => {
                        this.closeLevelSelect();
                        this.startMatchAtLevel(def.level);
                    });
                }

                gridEl.appendChild(card);
            });
        }

        // ==================== MODAL DA LOJA ====================

        openShop() {
            window.soundCtrl.playClick();
            this.renderShop();
            this.shopModal.classList.add('open');
        }

        closeShop() {
            window.soundCtrl.playClick();
            this.shopModal.classList.remove('open');
            this.updateProfileUI();
        }

        renderShop() {
            const grid = document.getElementById('shopGrid');
            if (!grid) return;
            grid.innerHTML = '';

            Object.values(SKINS).forEach(skin => {
                const isUnlocked = this.unlockedSkins.includes(skin.id);
                const isEquipped = this.selectedSkin === skin.id;

                const item = document.createElement('div');
                item.className = `shop-item ${isEquipped ? 'equipped' : ''}`;

                let btnHtml = '';
                if (isEquipped) {
                    btnHtml = `<button class="btn-shop-action active-equipped" disabled>✓ Equipado</button>`;
                } else if (isUnlocked) {
                    btnHtml = `<button class="btn-shop-action equip" data-skin="${skin.id}">Equipar</button>`;
                } else {
                    btnHtml = `<button class="btn-shop-action buy" data-skin="${skin.id}" data-price="${skin.price}">
                        <span>Comprar</span>
                        <span>💎 ${skin.price}</span>
                    </button>`;
                }

                item.innerHTML = `
                    <div class="shop-item-header">
                        <div class="shop-item-preview" style="background: linear-gradient(135deg, ${skin.head}, ${skin.bodyEnd}); box-shadow: 0 0 12px ${skin.glow};">
                            <span>${skin.icon}</span>
                        </div>
                        <div class="shop-item-title-group">
                            <span class="shop-item-name">${skin.name}</span>
                            <span class="shop-item-price">${skin.price === 0 ? 'GRÁTIS' : `💎 ${skin.price} Gems`}</span>
                        </div>
                    </div>
                    <p class="shop-item-desc">${skin.desc}</p>
                    ${btnHtml}
                `;

                const equipBtn = item.querySelector('.btn-shop-action.equip');
                if (equipBtn) equipBtn.addEventListener('click', () => this.equipSkin(skin.id));

                const buyBtn = item.querySelector('.btn-shop-action.buy');
                if (buyBtn) buyBtn.addEventListener('click', () => this.buySkin(skin.id, skin.price));

                grid.appendChild(item);
            });

            this.updateGemsDisplay();
        }

        buySkin(skinId, price) {
            if (this.gems < price) {
                this.addFloatingText('💎 Gems Insuficientes!', this.canvas.width / 2 - 80, this.canvas.height / 2, '#ff2a5f');
                return;
            }

            this.gems -= price;
            this.unlockedSkins.push(skinId);
            this.selectedSkin = skinId;

            localStorage.setItem('maca_mortal_unlocked_skins', JSON.stringify(this.unlockedSkins));
            localStorage.setItem('maca_mortal_skin', this.selectedSkin);

            window.soundCtrl.playBuy();
            this.updateGemsDisplay();
            this.updateProfileUI();
            this.renderShop();
        }

        equipSkin(skinId) {
            if (!this.unlockedSkins.includes(skinId)) return;
            this.selectedSkin = skinId;
            localStorage.setItem('maca_mortal_skin', this.selectedSkin);

            window.soundCtrl.playClick();
            this.updateProfileUI();
            this.renderShop();
        }

        // ==================== CONTROLES DE DIREÇÃO ====================

        handleKeyDown(e) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (e.key === 'Shift' || e.code === 'KeyE' || e.code === 'KeyF') {
                this.setTurbo(true);
            }

            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    e.preventDefault();
                    this.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    e.preventDefault();
                    this.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    e.preventDefault();
                    this.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    e.preventDefault();
                    this.setDirection(1, 0);
                    break;
                case 'Space':
                case 'KeyP':
                    e.preventDefault();
                    if (this.isRunning) this.togglePause();
                    break;
                case 'KeyR':
                    if (this.isRunning || this.gameOverScreen.classList.contains('active')) {
                        this.startMatchAtLevel(this.level);
                    }
                    break;
            }
        }

        handleKeyUp(e) {
            if (e.key === 'Shift' || e.code === 'KeyE' || e.code === 'KeyF') {
                this.setTurbo(false);
            }
        }

        setTurbo(active) {
            if (this.isBoosting === active) return;
            this.isBoosting = active;
            if (active && this.isRunning && !this.isPaused) {
                window.soundCtrl.playTurbo();
            }
            this.updateTurboUI();
        }

        updateTurboUI() {
            if (this.turboHudCard) {
                if (this.isBoosting) {
                    this.turboHudCard.classList.add('active');
                    if (this.turboHudText) this.turboHudText.textContent = '⚡ 2.0x';
                } else {
                    this.turboHudCard.classList.remove('active');
                    if (this.turboHudText) this.turboHudText.textContent = '⚡ 1x';
                }
            }
            if (this.dpadTurboBtn) {
                if (this.isBoosting) this.dpadTurboBtn.classList.add('active');
                else this.dpadTurboBtn.classList.remove('active');
            }
        }

        getCurrentSpeed() {
            return this.isBoosting ? Math.max(26, Math.round(this.speed * 0.55)) : this.speed;
        }

        setDirection(x, y) {
            const lastMove = this.inputQueue.length > 0 
                ? this.inputQueue[this.inputQueue.length - 1] 
                : this.direction;

            if (lastMove.x + x === 0 && lastMove.y + y === 0) return;
            if (lastMove.x === x && lastMove.y === y) return;

            if (this.inputQueue.length < 2) {
                this.inputQueue.push({ x, y });
            }
        }

        togglePause() {
            if (!this.isRunning) return;
            this.isPaused = !this.isPaused;
            document.getElementById('pauseIcon').textContent = this.isPaused ? '▶️' : '⏸️';

            if (this.isPaused) {
                this.pauseScreen.classList.add('active');
            } else {
                this.pauseScreen.classList.remove('active');
                this.lastTick = performance.now();
            }
        }

        updateHUD() {
            this.scoreEl.textContent = this.score.toLocaleString();
            this.levelEl.textContent = `FASE ${this.level}`;
            this.levelProgressText.textContent = `${this.levelProgress} / ${this.levelGoal} Frutas`;

            const pct = Math.min(100, Math.floor((this.levelProgress / this.levelGoal) * 100));
            this.levelProgressBar.style.width = `${pct}%`;

            if (this.heart) {
                if (this.lives > 0) this.heart.classList.remove('lost');
                else this.heart.classList.add('lost');
            }

            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreEl.textContent = this.highScore.toLocaleString();
                localStorage.setItem('maca_mortal_highscore', this.highScore);
            }
        }

        // ==================== FASES & PROGRESSÃO ====================

        completeLevel() {
            this.isRunning = false;
            window.soundCtrl.playLevelUp();

            const gemsEarned = 8 + this.level * 3;
            this.gems += gemsEarned;
            this.updateGemsDisplay();

            // Desbloqueia a próxima fase no perfil
            if (this.level >= this.highestLevel && this.highestLevel < LEVEL_DEFINITIONS.length) {
                this.highestLevel = this.level + 1;
                localStorage.setItem('maca_mortal_max_level', this.highestLevel);
            }

            document.getElementById('levelUpTitle').textContent = `Fase ${this.level} Vencida!`;
            document.getElementById('levelUpDesc').textContent = `Excelente! Você atingiu a meta de frutas da Fase ${this.level}.`;
            document.getElementById('levelUpGemsEarned').textContent = `+${gemsEarned}`;

            // Partículas de celebração
            for (let i = 0; i < 40; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    size: 3 + Math.random() * 5,
                    color: ['#00e5ff', '#ffd23f', '#00f59b', '#b34bfb'][Math.floor(Math.random() * 4)],
                    alpha: 1,
                    decay: 0.015
                });
            }

            this.updateProfileUI();
            this.levelUpModal.classList.add('active');
        }

        nextLevel() {
            this.levelUpModal.classList.remove('active');
            this.startMatchAtLevel(this.level + 1);
        }

        // ==================== FRUTAS & PERIGOS ====================

        spawnFruit() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                };
            } while (this.isPositionOccupied(pos));

            const available = Object.values(FRUIT_TYPES).filter(f => this.level >= f.minLevel);
            const chosen = available[Math.floor(Math.random() * available.length)];

            this.currentFruit = {
                type: chosen.id,
                name: chosen.name,
                points: chosen.points,
                goalValue: chosen.goalValue,
                color: chosen.color,
                x: pos.x,
                y: pos.y,
                spawnTime: Date.now()
            };
        }

        spawnMortalApple() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                };
            } while (this.isPositionOccupied(pos));

            const mortalApple = {
                x: pos.x,
                y: pos.y,
                spawnTime: Date.now(),
                duration: Math.max(8000, 14000 - this.level * 400)
            };

            this.mortalApples.push(mortalApple);
            this.wrapper.classList.add('mortal-active');
            this.alertBanner.classList.add('visible');
            window.soundCtrl.playMortalSpawn();
            this.createExplosion(pos.x * CELL_SIZE + CELL_SIZE / 2, pos.y * CELL_SIZE + CELL_SIZE / 2, '#ff2a5f', 18);
            this.addFloatingText('☠️ MAÇÃ MORTAL!', pos.x * CELL_SIZE, pos.y * CELL_SIZE - 10, '#ff2a5f');
        }

        spawnGoldenApple() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE)
                };
            } while (this.isPositionOccupied(pos));

            this.goldenApple = {
                x: pos.x,
                y: pos.y,
                spawnTime: Date.now(),
                duration: 9000
            };

            this.createExplosion(pos.x * CELL_SIZE + CELL_SIZE / 2, pos.y * CELL_SIZE + CELL_SIZE / 2, '#ffd23f', 16);
            this.addFloatingText('⭐ MAÇÃ DOURADA!', pos.x * CELL_SIZE, pos.y * CELL_SIZE - 10, '#ffd23f');
        }

        isPositionOccupied(pos) {
            if (this.snake.some(segment => segment.x === pos.x && segment.y === pos.y)) return true;
            if (this.currentFruit && this.currentFruit.x === pos.x && this.currentFruit.y === pos.y) return true;
            if (this.mortalApples.some(apple => apple.x === pos.x && apple.y === pos.y)) return true;
            if (this.goldenApple && this.goldenApple.x === pos.x && this.goldenApple.y === pos.y) return true;
            return false;
        }

        // ==================== FÍSICA & COLISÕES ====================

        tick() {
            if (!this.isRunning || this.isPaused) return;

            if (this.inputQueue.length > 0) {
                this.direction = this.inputQueue.shift();
            }

            let newHead = {
                x: this.snake[0].x + this.direction.x,
                y: this.snake[0].y + this.direction.y
            };

            // 1. Colisão fatal com as bordas do mapa (Paredes)
            if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                this.triggerScreenShake(15);
                window.soundCtrl.playMortalHit();
                this.gameOver('Você colidiu com a parede!');
                return;
            }

            // 2. Colisão fatal com o próprio corpo
            if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                this.triggerScreenShake(15);
                window.soundCtrl.playMortalHit();
                this.gameOver('Você colidiu com seu próprio corpo!');
                return;
            }

            // 3. Colisão com Maçã Mortal
            for (let i = this.mortalApples.length - 1; i >= 0; i--) {
                const mortal = this.mortalApples[i];
                if (newHead.x === mortal.x && newHead.y === mortal.y) {
                    if (this.shieldTimer > 0) {
                        this.destroyMortalApple(i);
                    } else {
                        this.triggerScreenShake(18);
                        window.soundCtrl.playMortalHit();
                        this.gameOver('A Maçã Mortal te aniquilou instantaneamente!');
                        return;
                    }
                    break;
                }
            }

            // Registra a cauda anterior para interpolação da ponta
            const oldTail = { 
                x: this.snake[this.snake.length - 1].x, 
                y: this.snake[this.snake.length - 1].y 
            };

            this.snake.unshift(newHead);

            // Rastro
            const skin = SKINS[this.selectedSkin] || SKINS.emerald;
            this.trailParticles.push({
                x: newHead.x * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 6,
                y: newHead.y * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 6,
                color: skin.head,
                size: 2.5,
                alpha: 0.8
            });

            // Comeu fruta normal
            let grew = false;
            if (this.currentFruit && newHead.x === this.currentFruit.x && newHead.y === this.currentFruit.y) {
                this.eatFruit();
                grew = true;
            }

            // Comeu maçã dourada
            if (this.goldenApple && newHead.x === this.goldenApple.x && newHead.y === this.goldenApple.y) {
                this.eatGoldenApple();
                grew = true;
            }

            if (!grew) {
                this.snake.pop();
            }

            // Atualiza coordenadas de início (prevX, prevY) de cada segmento para interpolação contínua (60/120fps LERP)
            for (let i = 0; i < this.snake.length; i++) {
                if (i < this.snake.length - 1) {
                    this.snake[i].prevX = this.snake[i + 1].x;
                    this.snake[i].prevY = this.snake[i + 1].y;
                } else {
                    this.snake[i].prevX = oldTail.x;
                    this.snake[i].prevY = oldTail.y;
                }
            }

            const now = Date.now();
            if (this.goldenApple && now - this.goldenApple.spawnTime > this.goldenApple.duration) {
                this.goldenApple = null;
            }

            for (let i = this.mortalApples.length - 1; i >= 0; i--) {
                if (now - this.mortalApples[i].spawnTime > this.mortalApples[i].duration) {
                    this.createExplosion(
                        this.mortalApples[i].x * CELL_SIZE + CELL_SIZE / 2,
                        this.mortalApples[i].y * CELL_SIZE + CELL_SIZE / 2,
                        '#8a2be2',
                        8
                    );
                    this.mortalApples.splice(i, 1);
                }
            }

            if (this.mortalApples.length === 0) {
                this.wrapper.classList.remove('mortal-active');
                this.alertBanner.classList.remove('visible');
            }

            if (this.combo > 1 && now - this.lastFruitTime > 3500) {
                this.combo = 1;
                this.updateHUD();
            }
        }

        eatFruit() {
            this.fruitsEaten++;
            this.totalFruits++;
            localStorage.setItem('maca_mortal_total_fruits', this.totalFruits);
            this.mortalSpawnCounter++;

            const now = Date.now();
            if (now - this.lastFruitTime < 3500) {
                this.combo = Math.min(this.combo + 1, 5);
            } else {
                this.combo = 1;
            }
            this.lastFruitTime = now;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            const fruitPoints = (this.currentFruit.points || 100) * this.combo;
            this.score += fruitPoints;
            window.soundCtrl.playEat();

            const px = this.currentFruit.x * CELL_SIZE + CELL_SIZE / 2;
            const py = this.currentFruit.y * CELL_SIZE + CELL_SIZE / 2;
            this.createExplosion(px, py, this.currentFruit.color || '#ff2a5f', 12);
            this.addFloatingText(`+${fruitPoints}`, px, py, this.currentFruit.color || '#00f59b');

            this.levelProgress += (this.currentFruit.goalValue || 1);
            this.updateHUD();

            if (this.levelProgress >= this.levelGoal) {
                this.completeLevel();
                return;
            }

            this.spawnFruit();

            if (this.fruitsEaten % 5 === 0 && Math.random() < 0.4 && !this.goldenApple) {
                this.spawnGoldenApple();
            }

            const spawnThreshold = Math.max(2, 4 - Math.floor(this.level / 3));
            const maxMortalCount = Math.min(3, 1 + Math.floor(this.level / 3));

            if (this.mortalSpawnCounter >= spawnThreshold && this.mortalApples.length < maxMortalCount) {
                this.mortalSpawnCounter = 0;
                this.spawnMortalApple();
            }
        }

        eatGoldenApple() {
            const earned = 500 * this.combo;
            this.score += earned;
            this.shieldTimer = 7000;
            window.soundCtrl.playGoldenEat();

            const px = this.goldenApple.x * CELL_SIZE + CELL_SIZE / 2;
            const py = this.goldenApple.y * CELL_SIZE + CELL_SIZE / 2;
            this.createExplosion(px, py, '#ffd23f', 24);
            this.addFloatingText(`+${earned} ESCUDO ATIVO!`, px, py, '#ffd23f');

            this.goldenApple = null;
            this.updateHUD();
        }

        destroyMortalApple(index) {
            const mortal = this.mortalApples[index];
            const px = mortal.x * CELL_SIZE + CELL_SIZE / 2;
            const py = mortal.y * CELL_SIZE + CELL_SIZE / 2;

            this.score += 1000;
            this.createExplosion(px, py, '#ff2a5f', 32);
            this.triggerScreenShake(8);
            this.addFloatingText('☠️ MAÇÃ DESTRUÍDA! +1000', px, py, '#ff2a5f');

            window.soundCtrl.playGoldenEat();
            this.mortalApples.splice(index, 1);
            this.updateHUD();
        }

        triggerScreenShake(intensity) {
            this.screenShake = intensity;
        }

        gameOver(reason) {
            this.isRunning = false;
            this.lives = 0;
            this.updateHUD();
            window.soundCtrl.playGameOver();

            const head = this.snake[0];
            if (head) {
                const px = head.x * CELL_SIZE + CELL_SIZE / 2;
                const py = head.y * CELL_SIZE + CELL_SIZE / 2;
                this.createExplosion(px, py, '#ff2a5f', 32);
                this.addFloatingText('☠️ DERROTA!', px, py, '#ff2a5f');
            }

            document.getElementById('gameOverReason').textContent = reason || 'Sua serpente pereceu.';
            document.getElementById('finalLevelReached').textContent = `FASE ${this.level}`;
            document.getElementById('finalScore').textContent = this.score.toLocaleString();
            document.getElementById('bestScoreRecord').textContent = this.highScore.toLocaleString();
            document.getElementById('finalApplesCount').textContent = this.fruitsEaten;
            document.getElementById('finalGemsEarned').textContent = `💎 ${this.gems.toLocaleString()}`;

            setTimeout(() => {
                this.gameOverScreen.classList.add('active');
            }, 600);
        }

        createExplosion(x, y, color, count = 12) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 1.5 + Math.random() * 4.5;
                this.particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    size: 2 + Math.random() * 4,
                    color,
                    alpha: 1,
                    decay: 0.025 + Math.random() * 0.03
                });
            }
        }

        addFloatingText(text, x, y, color) {
            this.floatingTexts.push({
                text,
                x: Math.max(20, Math.min(x, this.canvas.width - 120)),
                y,
                color,
                alpha: 1,
                vy: -1.2
            });
        }

        // ==================== VITRINE DO LOBBY (HERO SHOWCASE) ====================

        renderShowcase(time) {
            if (!this.showcaseCtx) return;
            const ctx = this.showcaseCtx;
            const w = this.showcaseCanvas.width;
            const h = this.showcaseCanvas.height;
            const cx = w / 2;
            const cy = h / 2;

            ctx.clearRect(0, 0, w, h);

            const skin = SKINS[this.selectedSkin] || SKINS.emerald;

            // Anel holográfico de base
            ctx.save();
            ctx.strokeStyle = skin.glow;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = skin.head;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(cx, cy, 95, 0, Math.PI * 2);
            ctx.stroke();

            // Anel pontilhado giratório
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(time / 1500);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.setLineDash([6, 8]);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Mini serpente deslizando em círculo gracioso
            const segCount = 9;
            const radius = 55;
            const baseAngle = time / 600;

            for (let i = segCount - 1; i >= 0; i--) {
                const angle = baseAngle - i * 0.28;
                const sx = cx + Math.cos(angle) * radius;
                const sy = cy + Math.sin(angle) * radius;
                const segRadius = i === 0 ? 11 : Math.max(4, 9 - i * 0.6);

                ctx.save();
                ctx.shadowColor = skin.glow;
                ctx.shadowBlur = 8;

                const grad = ctx.createRadialGradient(sx - 2, sy - 2, 1, sx, sy, segRadius);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.3, i === 0 ? skin.head : skin.bodyStart);
                grad.addColorStop(1, skin.bodyEnd);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(sx, sy, segRadius, 0, Math.PI * 2);
                ctx.fill();

                // Detalhes da cabeça
                if (i === 0) {
                    // Olhos
                    const headDirAngle = angle + Math.PI / 2;
                    const ex = sx + Math.cos(headDirAngle) * 3;
                    const ey = sy + Math.sin(headDirAngle) * 3;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#05070d';
                    ctx.beginPath();
                    ctx.arc(ex + 0.8, ey, 1.2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            ctx.restore();
        }

        // ==================== RENDERIZAÇÃO DA PARTIDA ====================

        render(deltaTime) {
            this.ctx.save();

            if (this.screenShake > 0) {
                const offsetX = (Math.random() - 0.5) * this.screenShake;
                const offsetY = (Math.random() - 0.5) * this.screenShake;
                this.ctx.translate(offsetX, offsetY);
                this.screenShake *= 0.88;
                if (this.screenShake < 0.2) this.screenShake = 0;
            }

            this.ctx.fillStyle = '#090b12';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawGrid();

            if (this.currentFruit) this.drawFruit(this.currentFruit);
            this.mortalApples.forEach(mortal => this.drawMortalApple(mortal));
            if (this.goldenApple) this.drawGoldenApple(this.goldenApple);

            this.drawSnake();

            this.updateAndDrawParticles();
            this.updateAndDrawFloatingTexts();

            this.ctx.restore();
        }

        drawGrid() {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            this.ctx.lineWidth = 1;
            for (let i = 0; i <= GRID_SIZE; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * CELL_SIZE, 0);
                this.ctx.lineTo(i * CELL_SIZE, this.canvas.height);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(0, i * CELL_SIZE);
                this.ctx.lineTo(this.canvas.width, i * CELL_SIZE);
                this.ctx.stroke();
            }

            // Borda letal
            this.ctx.save();
            const borderAlpha = 0.4 + Math.sin(Date.now() / 250) * 0.2;
            this.ctx.strokeStyle = `rgba(255, 42, 95, ${borderAlpha})`;
            this.ctx.lineWidth = 3;
            this.ctx.shadowColor = '#ff2a5f';
            this.ctx.shadowBlur = 10;
            this.ctx.strokeRect(1.5, 1.5, this.canvas.width - 3, this.canvas.height - 3);
            this.ctx.restore();
        }

        drawFruit(fruit) {
            const cx = fruit.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = fruit.y * CELL_SIZE + CELL_SIZE / 2;
            const radius = (CELL_SIZE / 2) - 3;
            const pulse = Math.sin(Date.now() / 180) * 1.5;

            this.ctx.save();

            switch (fruit.type) {
                case 'grape': {
                    this.ctx.shadowColor = '#a855f7';
                    this.ctx.shadowBlur = 12;
                    const grapes = [
                        { dx: -3, dy: -4 }, { dx: 3, dy: -4 },
                        { dx: -4, dy: 1 }, { dx: 0, dy: 2 }, { dx: 4, dy: 1 },
                        { dx: 0, dy: 7 }
                    ];
                    grapes.forEach(g => {
                        const grad = this.ctx.createRadialGradient(cx + g.dx - 1, cy + g.dy - 1, 1, cx + g.dx, cy + g.dy, 4.5);
                        grad.addColorStop(0, '#e9d5ff');
                        grad.addColorStop(0.5, '#c084fc');
                        grad.addColorStop(1, '#6b21a8');
                        this.ctx.fillStyle = grad;
                        this.ctx.beginPath();
                        this.ctx.arc(cx + g.dx, cy + g.dy, 4.5, 0, Math.PI * 2);
                        this.ctx.fill();
                    });
                    break;
                }
                case 'orange': {
                    this.ctx.shadowColor = '#f97316';
                    this.ctx.shadowBlur = 12;
                    const grad = this.ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, radius + pulse);
                    grad.addColorStop(0, '#fed7aa');
                    grad.addColorStop(0.5, '#fb923c');
                    grad.addColorStop(1, '#c2410c');
                    this.ctx.fillStyle = grad;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, radius + pulse, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#22c55e';
                    this.ctx.beginPath();
                    this.ctx.ellipse(cx + 4, cy - radius - 1, 4, 2, Math.PI / 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                }
                case 'watermelon': {
                    this.ctx.shadowColor = '#22c55e';
                    this.ctx.shadowBlur = 12;
                    this.ctx.fillStyle = '#15803d';
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, radius + pulse, 0, Math.PI);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#ef4444';
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, radius + pulse - 2.5, 0, Math.PI);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#000';
                    [-4, 0, 4].forEach(sx => {
                        this.ctx.beginPath();
                        this.ctx.arc(cx + sx, cy + 4, 1.2, 0, Math.PI * 2);
                        this.ctx.fill();
                    });
                    break;
                }
                default: {
                    this.ctx.shadowColor = 'rgba(255, 42, 95, 0.6)';
                    this.ctx.shadowBlur = 10;
                    const grad = this.ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, radius + pulse);
                    grad.addColorStop(0, '#ff6e8f');
                    grad.addColorStop(0.7, '#ff2a5f');
                    grad.addColorStop(1, '#c70039');
                    this.ctx.fillStyle = grad;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, radius + pulse, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = '#4ade80';
                    this.ctx.beginPath();
                    this.ctx.ellipse(cx + 4, cy - radius - 1, 3.5, 2, Math.PI / 4, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = '#854d0e';
                    this.ctx.lineWidth = 1.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(cx, cy - radius + 2);
                    this.ctx.quadraticCurveTo(cx - 1, cy - radius - 4, cx + 1, cy - radius - 5);
                    this.ctx.stroke();
                    break;
                }
            }

            this.ctx.restore();
        }

        drawMortalApple(apple) {
            const cx = apple.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = apple.y * CELL_SIZE + CELL_SIZE / 2;
            const radius = (CELL_SIZE / 2) - 2;
            const now = Date.now();
            const pulse = Math.sin(now / 120) * 2.5;

            this.ctx.save();
            this.ctx.shadowColor = '#ff0055';
            this.ctx.shadowBlur = 18;

            const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, radius + pulse);
            grad.addColorStop(0, '#38041c');
            grad.addColorStop(0.5, '#780126');
            grad.addColorStop(0.85, '#ff0044');
            grad.addColorStop(1, '#1a0008');

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius + pulse, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = `rgba(255, 42, 95, ${0.4 + Math.sin(now / 150) * 0.3})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius + 6 + pulse, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('☠️', cx, cy);

            this.ctx.restore();
        }

        drawGoldenApple(apple) {
            const cx = apple.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = apple.y * CELL_SIZE + CELL_SIZE / 2;
            const radius = (CELL_SIZE / 2) - 3;
            const now = Date.now();
            const pulse = Math.sin(now / 140) * 2;

            this.ctx.save();
            this.ctx.shadowColor = '#ffd23f';
            this.ctx.shadowBlur = 16;

            const grad = this.ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, radius + pulse);
            grad.addColorStop(0, '#fff4cc');
            grad.addColorStop(0.6, '#ffd23f');
            grad.addColorStop(1, '#f59e0b');

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius + pulse, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('⭐', cx, cy);

            this.ctx.restore();
        }

        drawSnake() {
            if (this.snake.length === 0) return;

            const skin = SKINS[this.selectedSkin] || SKINS.emerald;
            const hasShield = this.shieldTimer > 0;
            const now = performance.now();
            const currentSpeed = this.getCurrentSpeed();
            const progress = Math.min(1, Math.max(0, (now - this.lastTick) / currentSpeed));

            // Função de interpolação contínua (sub-pixel LERP) para 60/120/144 FPS ultra liso
            const getSegmentPos = (seg) => {
                const px = seg.prevX !== undefined ? seg.prevX : seg.x;
                const py = seg.prevY !== undefined ? seg.prevY : seg.y;
                const ix = px + (seg.x - px) * progress;
                const iy = py + (seg.y - py) * progress;
                return {
                    cx: ix * CELL_SIZE + CELL_SIZE / 2,
                    cy: iy * CELL_SIZE + CELL_SIZE / 2
                };
            };

            this.ctx.save();

            // Rastro
            for (let i = this.trailParticles.length - 1; i >= 0; i--) {
                const tp = this.trailParticles[i];
                tp.alpha -= 0.04;
                if (tp.alpha <= 0) {
                    this.trailParticles.splice(i, 1);
                    continue;
                }
                this.ctx.save();
                this.ctx.globalAlpha = tp.alpha;
                this.ctx.fillStyle = tp.color;
                this.ctx.beginPath();
                this.ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            // Partículas extras de turbo saindo da cauda
            if (this.isBoosting && this.snake.length > 0) {
                const tailPos = getSegmentPos(this.snake[this.snake.length - 1]);
                this.trailParticles.push({
                    x: tailPos.cx + (Math.random() - 0.5) * 8,
                    y: tailPos.cy + (Math.random() - 0.5) * 8,
                    color: Math.random() < 0.5 ? '#00e5ff' : '#ff0055',
                    size: 3.5,
                    alpha: 0.95
                });
            }

            // Espinha dorsal suave
            if (this.snake.length > 2) {
                this.ctx.save();
                this.ctx.strokeStyle = skin.glow;
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = skin.head;
                this.ctx.shadowBlur = 8;
                this.ctx.beginPath();
                this.snake.forEach((seg, idx) => {
                    const pos = getSegmentPos(seg);
                    if (idx === 0) this.ctx.moveTo(pos.cx, pos.cy);
                    else this.ctx.lineTo(pos.cx, pos.cy);
                });
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Segmentos com luz 3D interpolados
            for (let i = this.snake.length - 1; i >= 1; i--) {
                const seg = this.snake[i];
                const pos = getSegmentPos(seg);
                const cx = pos.cx;
                const cy = pos.cy;
                const ratio = i / this.snake.length;

                let radius = (CELL_SIZE / 2) - 1.5;
                if (i >= this.snake.length - 3) {
                    const tailIndex = this.snake.length - 1 - i;
                    radius -= (3 - tailIndex) * 2.2;
                }
                radius = Math.max(radius, 4);

                this.ctx.save();
                this.ctx.shadowColor = skin.glow;
                this.ctx.shadowBlur = 6;

                const grad = this.ctx.createRadialGradient(
                    cx - radius * 0.35, cy - radius * 0.35, radius * 0.15,
                    cx, cy, radius
                );
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.2, ratio < 0.5 ? skin.bodyStart : skin.head);
                grad.addColorStop(1, skin.bodyEnd);

                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
                this.ctx.lineWidth = 1.2;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 1.2);
                this.ctx.stroke();

                this.ctx.restore();
            }

            // Cabeça interpolada
            const head = this.snake[0];
            const headPos = getSegmentPos(head);
            const hx = headPos.cx;
            const hy = headPos.cy;
            const headRadius = (CELL_SIZE / 2) + 0.5;

            const dirX = this.direction.x;
            const dirY = this.direction.y;
            const angle = Math.atan2(dirY, dirX);

            this.ctx.save();
            this.ctx.translate(hx, hy);
            this.ctx.rotate(angle);

            // Escudo
            if (hasShield) {
                this.ctx.save();
                this.ctx.strokeStyle = `rgba(255, 210, 63, ${0.7 + Math.sin(now / 90) * 0.3})`;
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = '#ffd23f';
                this.ctx.shadowBlur = 18;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, headRadius + 7, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Língua bifurcada
            const tongueFlick = Math.sin(now / 110);
            if (tongueFlick > 0.3) {
                this.ctx.save();
                this.ctx.strokeStyle = '#ff0055';
                this.ctx.lineWidth = 2;
                const tongueLen = 12 + tongueFlick * 5;
                this.ctx.beginPath();
                this.ctx.moveTo(headRadius, 0);
                this.ctx.lineTo(headRadius + tongueLen, 0);
                this.ctx.lineTo(headRadius + tongueLen + 3, -3);
                this.ctx.moveTo(headRadius + tongueLen, 0);
                this.ctx.lineTo(headRadius + tongueLen + 3, 3);
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Cabeça aerodinâmica
            this.ctx.shadowColor = hasShield ? '#ffd23f' : skin.glow;
            this.ctx.shadowBlur = hasShield ? 20 : 12;

            const headGrad = this.ctx.createRadialGradient(-3, -3, 2, 0, 0, headRadius);
            headGrad.addColorStop(0, '#ffffff');
            headGrad.addColorStop(0.25, hasShield ? '#ffd23f' : skin.head);
            headGrad.addColorStop(1, hasShield ? '#d97706' : skin.headSec);

            this.ctx.fillStyle = headGrad;
            this.ctx.beginPath();
            this.ctx.ellipse(2, 0, headRadius + 2, headRadius - 1, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Olhos
            const isBlinking = Math.floor(now / 3500) % 20 === 0 && Math.sin(now / 100) > 0.5;
            const drawEye = (ey) => {
                const ex = 4;
                if (isBlinking) {
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(ex - 3, ey);
                    this.ctx.lineTo(ex + 3, ey);
                    this.ctx.stroke();
                } else {
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.beginPath();
                    this.ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.fillStyle = skin.eyeColor || '#00e5ff';
                    this.ctx.beginPath();
                    this.ctx.arc(ex + 0.8, ey, 2.2, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.fillStyle = '#05070d';
                    this.ctx.beginPath();
                    this.ctx.ellipse(ex + 1, ey, 0.9, 2.1, 0, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.fillStyle = '#fff';
                    this.ctx.beginPath();
                    this.ctx.arc(ex + 1.2, ey - 0.8, 0.7, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            };

            this.ctx.shadowBlur = 0;
            drawEye(-5.5);
            drawEye(5.5);

            // Acessórios
            switch (skin.accessory) {
                case 'crown': {
                    this.ctx.save();
                    this.ctx.fillStyle = '#ffd23f';
                    this.ctx.strokeStyle = '#c68a00';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-6, -7);
                    this.ctx.lineTo(-4, -13);
                    this.ctx.lineTo(-1, -8);
                    this.ctx.lineTo(2, -14);
                    this.ctx.lineTo(5, -8);
                    this.ctx.lineTo(8, -13);
                    this.ctx.lineTo(10, -7);
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.fillStyle = '#ff0055';
                    this.ctx.beginPath();
                    this.ctx.arc(2, -8, 1.8, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                    break;
                }
                case 'horns': {
                    this.ctx.save();
                    this.ctx.fillStyle = '#ff2a5f';
                    this.ctx.shadowColor = '#ff2a5f';
                    this.ctx.shadowBlur = 8;
                    [-6, 6].forEach(hy => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(-2, hy);
                        this.ctx.quadraticCurveTo(-10, hy * 1.6, -14, hy * 2.2);
                        this.ctx.quadraticCurveTo(-6, hy * 1.3, 0, hy * 0.9);
                        this.ctx.fill();
                    });
                    this.ctx.restore();
                    break;
                }
                case 'lightning': {
                    this.ctx.save();
                    this.ctx.strokeStyle = '#00e5ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.shadowColor = '#00e5ff';
                    this.ctx.shadowBlur = 10;
                    [-7, 7].forEach(hy => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(-3, hy * 0.8);
                        this.ctx.lineTo(-8, hy * 1.4);
                        this.ctx.lineTo(-5, hy * 1.8);
                        this.ctx.lineTo(-12, hy * 2.5);
                        this.ctx.stroke();
                    });
                    this.ctx.restore();
                    break;
                }
                case 'halo': {
                    this.ctx.save();
                    this.ctx.strokeStyle = 'rgba(179, 75, 251, 0.85)';
                    this.ctx.lineWidth = 2;
                    this.ctx.shadowColor = '#b34bfb';
                    this.ctx.shadowBlur = 12;
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, headRadius + 5, headRadius + 2, 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.restore();
                    break;
                }
                case 'skull': {
                    this.ctx.save();
                    this.ctx.strokeStyle = '#ff0055';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.shadowColor = '#ff0055';
                    this.ctx.shadowBlur = 8;
                    this.ctx.beginPath();
                    this.ctx.arc(1, 0, 4, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.restore();
                    break;
                }
                case 'visor':
                default: {
                    this.ctx.save();
                    this.ctx.fillStyle = 'rgba(0, 245, 155, 0.4)';
                    this.ctx.strokeStyle = '#00f59b';
                    if (this.ctx.roundRect) {
                        this.ctx.roundRect(1, -6, 5, 12, 2);
                    } else {
                        this.ctx.rect(1, -6, 5, 12);
                    }
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.restore();
                    break;
                }
            }

            this.ctx.restore();
            this.ctx.restore();
        }

        updateAndDrawParticles() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = p.color;
                this.ctx.shadowColor = p.color;
                this.ctx.shadowBlur = 6;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }

        updateAndDrawFloatingTexts() {
            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const ft = this.floatingTexts[i];
                ft.y += ft.vy;
                ft.alpha -= 0.02;

                if (ft.alpha <= 0) {
                    this.floatingTexts.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = ft.alpha;
                this.ctx.fillStyle = ft.color;
                this.ctx.font = 'bold 13px Orbitron, sans-serif';
                this.ctx.shadowColor = ft.color;
                this.ctx.shadowBlur = 8;
                this.ctx.fillText(ft.text, ft.x, ft.y);
                this.ctx.restore();
            }
        }

        startLoop() {
            let lastTime = performance.now();

            const frame = (now) => {
                const delta = now - lastTime;
                lastTime = now;

                // Animação da vitrine no Lobby
                if (this.lobbyView.classList.contains('active')) {
                    this.renderShowcase(now);
                }

                // Loop da partida
                if (this.isRunning && !this.isPaused) {
                    if (this.shieldTimer > 0) {
                        this.shieldTimer -= delta;
                    }

                    const currentSpeed = this.getCurrentSpeed();
                    if (now - this.lastTick >= currentSpeed) {
                        this.tick();
                        this.lastTick = now;
                    }

                    this.render(delta);
                }

                requestAnimationFrame(frame);
            };

            requestAnimationFrame(frame);
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        window.gameInstance = new Game();
    });
})();
