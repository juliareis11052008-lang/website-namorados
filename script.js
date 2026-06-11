// ======================== TELA DE BLOQUEIO ========================
const lockScreen = document.getElementById('lockScreen');
const mainContent = document.getElementById('mainContent');
const unlockBtn = document.getElementById('unlockBtn');
const passwordInput = document.getElementById('passwordInput');
const lockMessage = document.getElementById('lockMessage');
const heartLock = document.getElementById('heartLock');

const correctPassword = "30/03/2025";

function showLockMessage(msg, isError = true) {
    lockMessage.textContent = msg;
    lockMessage.style.color = isError ? "#ff9999" : "#aaffaa";
    if(isError) {
        lockMessage.classList.add('shake');
        setTimeout(() => lockMessage.classList.remove('shake'), 500);
    }
}

function unlockSuccess() {
    heartLock.style.transform = "scale(1.2) rotate(5deg)";
    setTimeout(() => {
        heartLock.style.opacity = "0";
        setTimeout(() => {
            lockScreen.style.opacity = "0";
            setTimeout(() => {
                lockScreen.style.display = "none";
                mainContent.classList.remove('hidden');
                startHeartParticles();
                initChess();
                initRubikCube();
                typeWriterEffect();
            }, 400);
        }, 200);
    }, 300);
    showLockMessage("Bem vindo meu amor!", false);
}

unlockBtn.addEventListener('click', () => {
    const entered = passwordInput.value.trim();
    if(entered === correctPassword) {
        unlockSuccess();
    } else {
        showLockMessage("Senha incorreta ❤️‍🩹");
        passwordInput.value = "";
        passwordInput.focus();
    }
});
passwordInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') unlockBtn.click();
});

// ======================== PARTÍCULAS DE CORAÇÃO ========================
function startHeartParticles() {
    const container = document.getElementById('heartParticles');
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.innerHTML = ['❤️','💖','💗','💓','🌸','🌹'][Math.floor(Math.random()*6)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 6 + 4) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 9000);
    }, 800);
}

// ======================== EFEITO DE TÍTULO DIGITADO ========================
function typeWriterEffect() {
    const titleElement = document.querySelector('.romantic-header h1');
    if (!titleElement) return;
    const originalText = titleElement.innerText;
    titleElement.innerHTML = '';
    titleElement.style.borderRight = '2px solid #ff69b4';
    titleElement.style.display = 'inline-block';
    titleElement.style.whiteSpace = 'pre-wrap';
    let i = 0;
    function typeNext() {
        if (i < originalText.length) {
            let char = originalText[i];
            if (char === ' ') {
                titleElement.innerHTML += '&nbsp;';
            } else {
                titleElement.innerHTML += char;
            }
            i++;
            setTimeout(typeNext, 90);
        } else {
            titleElement.style.borderRight = 'none';
        }
    }
    typeNext();
}

// ======================== JOGO DE XADREZ ========================
let chessBoard = [];
let selectedRow = null, selectedCol = null;
let currentTurn = 'white'; // jogador
let gameOver = false;

const pieceSymbols = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

function initChessBoard() {
    chessBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['',  '',  '',  '',  '',  '',  '',  ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
}

function getPieceColor(piece) {
    if (piece === '') return null;
    return (piece === piece.toUpperCase()) ? 'white' : 'black';
}

function copyBoard(board) {
    return board.map(row => [...row]);
}

function findKing(color, board) {
    const target = (color === 'white') ? 'K' : 'k';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === target) return { row: i, col: j };
        }
    }
    return null;
}

function isSquareAttacked(row, col, board, friendlyColor) {
    const opponentColor = friendlyColor === 'white' ? 'black' : 'white';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece !== '' && getPieceColor(piece) === opponentColor) {
                if (isValidMoveWithoutSelfCheck(piece, i, j, row, col, board)) return true;
            }
        }
    }
    return false;
}

function isValidMoveWithoutSelfCheck(piece, fromRow, fromCol, toRow, toCol, board) {
    const target = board[toRow][toCol];
    const color = getPieceColor(piece);
    if (color === null) return false;
    if (target !== '' && getPieceColor(target) === color) return false;

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const absRow = Math.abs(rowDiff);
    const absCol = Math.abs(colDiff);
    const pieceType = piece.toLowerCase();

    switch (pieceType) {
        case 'p':
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            if (colDiff === 0 && target === '' && rowDiff === direction) return true;
            if (colDiff === 0 && target === '' && fromRow === startRow && rowDiff === 2 * direction && board[fromRow + direction][fromCol] === '') return true;
            if (Math.abs(colDiff) === 1 && rowDiff === direction && target !== '' && getPieceColor(target) !== color) return true;
            return false;
        case 'n':
            return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
        case 'b':
            if (absRow !== absCol) return false;
            let stepRow = rowDiff > 0 ? 1 : -1;
            let stepCol = colDiff > 0 ? 1 : -1;
            for (let i = 1; i < absRow; i++) {
                if (board[fromRow + i * stepRow][fromCol + i * stepCol] !== '') return false;
            }
            return true;
        case 'r':
            if (fromRow !== toRow && fromCol !== toCol) return false;
            if (fromRow === toRow) {
                let step = colDiff > 0 ? 1 : -1;
                for (let c = fromCol + step; c !== toCol; c += step) {
                    if (board[toRow][c] !== '') return false;
                }
            } else {
                let step = rowDiff > 0 ? 1 : -1;
                for (let r = fromRow + step; r !== toRow; r += step) {
                    if (board[r][toCol] !== '') return false;
                }
            }
            return true;
        case 'q':
            return isValidMoveWithoutSelfCheck('r', fromRow, fromCol, toRow, toCol, board) ||
                   isValidMoveWithoutSelfCheck('b', fromRow, fromCol, toRow, toCol, board);
        case 'k':
            return absRow <= 1 && absCol <= 1;
        default:
            return false;
    }
}

function isValidMove(piece, fromRow, fromCol, toRow, toCol, board) {
    if (!isValidMoveWithoutSelfCheck(piece, fromRow, fromCol, toRow, toCol, board)) return false;
    const tempBoard = copyBoard(board);
    tempBoard[toRow][toCol] = piece;
    tempBoard[fromRow][fromCol] = '';
    const color = getPieceColor(piece);
    const kingPos = findKing(color, tempBoard);
    if (kingPos && isSquareAttacked(kingPos.row, kingPos.col, tempBoard, color)) return false;
    return true;
}

function getAllValidMoves(color, board) {
    const moves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece !== '' && getPieceColor(piece) === color) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(piece, i, j, toRow, toCol, board)) {
                            moves.push({ from: { row: i, col: j }, to: { row: toRow, col: toCol } });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function isKingInCheck(color, board) {
    const kingPos = findKing(color, board);
    if (!kingPos) return false;
    return isSquareAttacked(kingPos.row, kingPos.col, board, color);
}

function makeMove(move, board) {
    const { from, to } = move;
    const piece = board[from.row][from.col];
    board[to.row][to.col] = piece;
    board[from.row][from.col] = '';
    return piece;
}

function getBestAIMove() {
    const moves = getAllValidMoves('black', chessBoard);
    if (moves.length === 0) return null;
    const captureMoves = moves.filter(m => {
        const target = chessBoard[m.to.row][m.to.col];
        return target !== '' && getPieceColor(target) === 'white';
    });
    if (captureMoves.length > 0) return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    return moves[Math.floor(Math.random() * moves.length)];
}

function aiMove() {
    if (gameOver) return;
    if (currentTurn !== 'black') return;
    const move = getBestAIMove();
    if (!move) {
        const inCheck = isKingInCheck('black', chessBoard);
        if (inCheck) {
            gameOver = true;
            document.getElementById('chessMessage').innerHTML = "🎉 Parabéns meu amor! Você venceu por xeque-mate! 🎉";
            startConfetti();
        } else {
            gameOver = true;
            document.getElementById('chessMessage').innerHTML = "🤝 Afogamento! O jogo empatou.";
        }
        return;
    }
    makeMove(move, chessBoard);
    renderChessboard();
    currentTurn = 'white';
    if (isKingInCheck('white', chessBoard)) {
        document.getElementById('chessMessage').innerHTML = "⚠️ Seu rei está em xeque! ⚠️";
    } else {
        document.getElementById('chessMessage').innerHTML = "";
    }
    checkGameEnd();
}

function checkGameEnd() {
    if (gameOver) return;
    const whiteMoves = getAllValidMoves('white', chessBoard);
    if (whiteMoves.length === 0) {
        const inCheck = isKingInCheck('white', chessBoard);
        if (inCheck) {
            gameOver = true;
            document.getElementById('chessMessage').innerHTML = "💔 Xeque-mate! A IA venceu... Tente novamente 💔";
        } else {
            gameOver = true;
            document.getElementById('chessMessage').innerHTML = "🤝 Afogamento! O jogo empatou.";
        }
        return;
    }
    if (!findKing('black', chessBoard)) {
        gameOver = true;
        document.getElementById('chessMessage').innerHTML = "🎉 Parabéns meu amor! Você capturou o rei! 🎉";
        startConfetti();
    }
}

function onSquareClick(row, col) {
    if (gameOver) return;
    if (currentTurn !== 'white') return;
    if (selectedRow === null) {
        const piece = chessBoard[row][col];
        if (piece !== '' && getPieceColor(piece) === 'white') {
            selectedRow = row;
            selectedCol = col;
            renderChessboard();
        }
        return;
    }
    const piece = chessBoard[selectedRow][selectedCol];
    if (isValidMove(piece, selectedRow, selectedCol, row, col, chessBoard)) {
        const captured = chessBoard[row][col];
        const move = { from: { row: selectedRow, col: selectedCol }, to: { row, col } };
        makeMove(move, chessBoard);
        renderChessboard();
        selectedRow = null;
        selectedCol = null;
        currentTurn = 'black';
        if (captured !== '') {
            document.getElementById('chessMessage').innerHTML = "✨ Parabéns meu amor! Boa captura! ✨";
            startConfetti();
            setTimeout(() => {
                if (document.getElementById('chessMessage').innerHTML.includes("Parabéns"))
                    document.getElementById('chessMessage').innerHTML = "";
            }, 2000);
        }
        if (isKingInCheck('black', chessBoard)) {
            document.getElementById('chessMessage').innerHTML = "🎯 Xeque no rei adversário! 🎯";
        }
        checkGameEnd();
        if (!gameOver && currentTurn === 'black') setTimeout(() => aiMove(), 400);
    } else {
        selectedRow = null;
        selectedCol = null;
        renderChessboard();
    }
}

function renderChessboard() {
    const chessDiv = document.getElementById('chessboard');
    if (!chessDiv) return;
    chessDiv.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = chessBoard[i][j];
            const symbol = piece ? pieceSymbols[piece] : '';
            const square = document.createElement('div');
            square.className = `chess-square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
            square.textContent = symbol;
            square.addEventListener('click', (function(row, col) {
                return function() { onSquareClick(row, col); };
            })(i, j));
            if (selectedRow === i && selectedCol === j) square.classList.add('selected');
            if (selectedRow !== null && selectedCol !== null) {
                const pieceSelected = chessBoard[selectedRow][selectedCol];
                if (pieceSelected && isValidMove(pieceSelected, selectedRow, selectedCol, i, j, chessBoard)) {
                    square.classList.add('possible-move');
                }
            }
            chessDiv.appendChild(square);
        }
    }
}

function initChess() {
    initChessBoard();
    selectedRow = null;
    selectedCol = null;
    currentTurn = 'white';
    gameOver = false;
    renderChessboard();
    document.getElementById('chessMessage').innerHTML = "";
}

// ======================== CUBO MÁGICO 3D ========================
let cubiesData = [];
let cubeSolved = false;
const colorMap = {
    'U': '#FFFFFF', 'D': '#FFF2CC', 'F': '#F9C7D3', 'B': '#D9B4FF', 'L': '#B5E3FF', 'R': '#C9E4C5'
};

function initRubikCube() {
    const container = document.getElementById('rubiksCube');
    if (!container) return;
    container.innerHTML = '';
    cubiesData = [];
    for(let x = -1; x <= 1; x++) {
        for(let y = -1; y <= 1; y++) {
            for(let z = -1; z <= 1; z++) {
                let cubie = {x,y,z, colors: {}};
                if(x === -1) cubie.colors.left = colorMap['L'];
                if(x === 1) cubie.colors.right = colorMap['R'];
                if(y === -1) cubie.colors.bottom = colorMap['D'];
                if(y === 1) cubie.colors.top = colorMap['U'];
                if(z === -1) cubie.colors.back = colorMap['B'];
                if(z === 1) cubie.colors.front = colorMap['F'];
                cubiesData.push(cubie);
            }
        }
    }
    renderCube();
    scrambleCube();
}

function renderCube() {
    const container = document.getElementById('rubiksCube');
    if (!container) return;
    container.innerHTML = '';
    for(let cubie of cubiesData) {
        const div = document.createElement('div');
        div.className = 'cubie';
        const posX = cubie.x * 100;
        const posY = cubie.y * 100;
        const posZ = cubie.z * 100;
        div.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;
        const faces = ['front','back','right','left','top','bottom'];
        for(let face of faces) {
            const faceDiv = document.createElement('div');
            faceDiv.className = `face ${face}`;
            let color = null;
            if(face === 'front' && cubie.colors.front) color = cubie.colors.front;
            if(face === 'back' && cubie.colors.back) color = cubie.colors.back;
            if(face === 'right' && cubie.colors.right) color = cubie.colors.right;
            if(face === 'left' && cubie.colors.left) color = cubie.colors.left;
            if(face === 'top' && cubie.colors.top) color = cubie.colors.top;
            if(face === 'bottom' && cubie.colors.bottom) color = cubie.colors.bottom;
            if(color) {
                faceDiv.style.backgroundColor = color;
                faceDiv.style.border = '1px solid rgba(0,0,0,0.2)';
            } else {
                faceDiv.style.backgroundColor = '#222';
                faceDiv.style.opacity = '0.5';
            }
            div.appendChild(faceDiv);
        }
        container.appendChild(div);
    }
}

function rotateFace(face, inverse = false) {
    if(cubeSolved) return;
    let affected = [];
    if(face === 'U') affected = cubiesData.filter(c=>c.y===1);
    else if(face === 'D') affected = cubiesData.filter(c=>c.y===-1);
    else if(face === 'F') affected = cubiesData.filter(c=>c.z===1);
    else if(face === 'B') affected = cubiesData.filter(c=>c.z===-1);
    else if(face === 'L') affected = cubiesData.filter(c=>c.x===-1);
    else if(face === 'R') affected = cubiesData.filter(c=>c.x===1);
    const angle = inverse ? -Math.PI/2 : Math.PI/2;
    for(let cubie of affected) {
        let nx=cubie.x, ny=cubie.y, nz=cubie.z;
        let oldColors = {...cubie.colors};
        if(face === 'U') { nx = Math.round(cubie.x*Math.cos(angle) - cubie.z*Math.sin(angle)); nz = Math.round(cubie.x*Math.sin(angle) + cubie.z*Math.cos(angle)); 
            cubie.colors = rotateColorMap(oldColors, 'U', inverse); }
        if(face === 'D') { nx = Math.round(cubie.x*Math.cos(-angle) - cubie.z*Math.sin(-angle)); nz = Math.round(cubie.x*Math.sin(-angle) + cubie.z*Math.cos(-angle));
            cubie.colors = rotateColorMap(oldColors, 'D', inverse); }
        if(face === 'F') { nx = Math.round(cubie.x*Math.cos(angle) - cubie.y*Math.sin(angle)); ny = Math.round(cubie.x*Math.sin(angle) + cubie.y*Math.cos(angle));
            cubie.colors = rotateColorMap(oldColors, 'F', inverse); }
        if(face === 'B') { nx = Math.round(cubie.x*Math.cos(-angle) - cubie.y*Math.sin(-angle)); ny = Math.round(cubie.x*Math.sin(-angle) + cubie.y*Math.cos(-angle));
            cubie.colors = rotateColorMap(oldColors, 'B', inverse); }
        if(face === 'L') { nz = Math.round(cubie.z*Math.cos(angle) - cubie.y*Math.sin(angle)); ny = Math.round(cubie.z*Math.sin(angle) + cubie.y*Math.cos(angle));
            cubie.colors = rotateColorMap(oldColors, 'L', inverse); }
        if(face === 'R') { nz = Math.round(cubie.z*Math.cos(-angle) - cubie.y*Math.sin(-angle)); ny = Math.round(cubie.z*Math.sin(-angle) + cubie.y*Math.cos(-angle));
            cubie.colors = rotateColorMap(oldColors, 'R', inverse); }
        cubie.x=nx; cubie.y=ny; cubie.z=nz;
    }
    renderCube();
    checkCubeSolved();
}

function rotateColorMap(colors, face, inv) {
    let newColors = {...colors};
    if(face==='U') { let temp = newColors.front; newColors.front = newColors.right; newColors.right = newColors.back; newColors.back = newColors.left; newColors.left = temp; }
    if(face==='D') { let temp = newColors.front; newColors.front = newColors.left; newColors.left = newColors.back; newColors.back = newColors.right; newColors.right = temp; }
    if(face==='F') { let temp = newColors.top; newColors.top = newColors.left; newColors.left = newColors.bottom; newColors.bottom = newColors.right; newColors.right = temp; }
    if(face==='B') { let temp = newColors.top; newColors.top = newColors.right; newColors.right = newColors.bottom; newColors.bottom = newColors.left; newColors.left = temp; }
    if(face==='L') { let temp = newColors.top; newColors.top = newColors.back; newColors.back = newColors.bottom; newColors.bottom = newColors.front; newColors.front = temp; }
    if(face==='R') { let temp = newColors.top; newColors.top = newColors.front; newColors.front = newColors.bottom; newColors.bottom = newColors.back; newColors.back = temp; }
    return newColors;
}

function checkCubeSolved() {
    const solved = cubiesData.every(cubie => {
        if(cubie.x===1 && (!cubie.colors.right || cubie.colors.right !== colorMap['R'])) return false;
        if(cubie.x===-1 && (!cubie.colors.left || cubie.colors.left !== colorMap['L'])) return false;
        if(cubie.y===1 && (!cubie.colors.top || cubie.colors.top !== colorMap['U'])) return false;
        if(cubie.y===-1 && (!cubie.colors.bottom || cubie.colors.bottom !== colorMap['D'])) return false;
        if(cubie.z===1 && (!cubie.colors.front || cubie.colors.front !== colorMap['F'])) return false;
        if(cubie.z===-1 && (!cubie.colors.back || cubie.colors.back !== colorMap['B'])) return false;
        return true;
    });
    if(solved && !cubeSolved) {
        cubeSolved = true;
        document.getElementById('cubeMessage').innerHTML = "🎉 Parabéns meu amor! Você montou o cubo! 🎉";
        startConfetti();
    } else if(!solved) {
        cubeSolved = false;
    }
}

function scrambleCube() {
    const moves = ['U',"U'",'D',"D'",'L',"L'",'R',"R'",'F',"F'",'B',"B'"];
    for(let i=0;i<50;i++) {
        let move = moves[Math.floor(Math.random()*moves.length)];
        let face = move[0];
        let inv = move.includes("'");
        rotateFace(face, inv);
    }
    cubeSolved = false;
    document.getElementById('cubeMessage').innerHTML = "";
}

function setupCubeControls() {
    document.querySelectorAll('[data-move]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let move = btn.dataset.move;
            let face = move[0];
            let inv = move.includes("'");
            rotateFace(face, inv);
        });
    });
    const scrambleBtn = document.getElementById('scrambleCube');
    if (scrambleBtn) scrambleBtn.addEventListener('click', () => { scrambleCube(); });
}

// ======================== CONFETES ========================
function startConfetti() {
    for(let i=0;i<80;i++) {
        let conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.left = Math.random() * 100 + '%';
        conf.style.animationDuration = (Math.random() * 2 + 1) + 's';
        conf.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        conf.style.width = (Math.random() * 8 + 4) + 'px';
        conf.style.height = (Math.random() * 12 + 8) + 'px';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 3000);
    }
}

// Inicialização dos controles do cubo (após carregar o DOM)
document.addEventListener('DOMContentLoaded', () => {
    setupCubeControls();
});