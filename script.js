// ======================== TELA DE BLOQUEIO ========================
document.addEventListener('DOMContentLoaded', function() {
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
                    adjustCubeLayout();
                    typeWriterEffect();
                }, 400);
            }, 200);
        }, 300);
        showLockMessage("Bem vindo meu amor!", false);
    }

    unlockBtn.addEventListener('click', () => {
        const entered = passwordInput.value.trim();
        if(entered === correctPassword) unlockSuccess();
        else {
            showLockMessage("Senha incorreta ❤️‍🩹");
            passwordInput.value = "";
            passwordInput.focus();
        }
    });
    passwordInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') unlockBtn.click();
    });

    // ======================== PARTÍCULAS ========================
    function startHeartParticles() {
        const container = document.getElementById('heartParticles');
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');
            heart.innerHTML = ['❤️','💖','💗','💓','🌸','🌹'][Math.floor(Math.random()*6)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
            heart.style.animationDuration = (Math.random() * 6 + 4) + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 9000);
        }, 800);
    }

    // ======================== EFEITO DE DIGITAÇÃO ========================
    function typeWriterEffect() {
        const title = document.querySelector('.romantic-header h1');
        if (!title) return;
        const original = title.innerText;
        title.innerHTML = '';
        title.style.borderRight = '2px solid #ff69b4';
        let i = 0;
        function type() {
            if (i < original.length) {
                let ch = original[i];
                title.innerHTML += ch === ' ' ? '&nbsp;' : ch;
                i++;
                setTimeout(type, 90);
            } else title.style.borderRight = 'none';
        }
        type();
    }

    // ======================== JOGO DE XADREZ ========================
    let chessBoard, selectedRow, selectedCol, currentTurn, gameOver;
    const pieceSymbols = {
        'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
        'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙'
    };

    function initChessBoard() {
        chessBoard = [
            ['r','n','b','q','k','b','n','r'],
            ['p','p','p','p','p','p','p','p'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['P','P','P','P','P','P','P','P'],
            ['R','N','B','Q','K','B','N','R']
        ];
    }

    function getPieceColor(piece) {
        if(!piece) return null;
        return piece === piece.toUpperCase() ? 'white' : 'black';
    }

    function copyBoard(board) { return board.map(r => [...r]); }

    function findKing(color, board) {
        const target = color === 'white' ? 'K' : 'k';
        for(let i=0;i<8;i++) for(let j=0;j<8;j++) if(board[i][j] === target) return {row:i, col:j};
        return null;
    }

    function isValidMoveWithoutSelfCheck(piece, fromRow, fromCol, toRow, toCol, board) {
        const target = board[toRow][toCol];
        const color = getPieceColor(piece);
        if(!color) return false;
        if(target && getPieceColor(target) === color) return false;
        const dr = toRow - fromRow, dc = toCol - fromCol;
        const absDR = Math.abs(dr), absDC = Math.abs(dc);
        const type = piece.toLowerCase();
        switch(type) {
            case 'p':
                const dir = color === 'white' ? -1 : 1;
                const startRow = color === 'white' ? 6 : 1;
                if(dc===0 && !target && dr===dir) return true;
                if(dc===0 && !target && fromRow===startRow && dr===2*dir && board[fromRow+dir][fromCol]==='') return true;
                if(Math.abs(dc)===1 && dr===dir && target && getPieceColor(target)!==color) return true;
                return false;
            case 'n': return (absDR===2 && absDC===1) || (absDR===1 && absDC===2);
            case 'b':
                if(absDR !== absDC) return false;
                let stepR = dr>0?1:-1, stepC = dc>0?1:-1;
                for(let i=1; i<absDR; i++) if(board[fromRow+i*stepR][fromCol+i*stepC] !== '') return false;
                return true;
            case 'r':
                if(fromRow !== toRow && fromCol !== toCol) return false;
                if(fromRow === toRow) {
                    let step = dc>0?1:-1;
                    for(let c=fromCol+step; c!==toCol; c+=step) if(board[toRow][c] !== '') return false;
                } else {
                    let step = dr>0?1:-1;
                    for(let r=fromRow+step; r!==toRow; r+=step) if(board[r][toCol] !== '') return false;
                }
                return true;
            case 'q':
                return isValidMoveWithoutSelfCheck('r', fromRow, fromCol, toRow, toCol, board) ||
                       isValidMoveWithoutSelfCheck('b', fromRow, fromCol, toRow, toCol, board);
            case 'k': return absDR<=1 && absDC<=1;
            default: return false;
        }
    }

    function isSquareAttacked(row, col, board, friendlyColor) {
        const opp = friendlyColor === 'white' ? 'black' : 'white';
        for(let i=0;i<8;i++) for(let j=0;j<8;j++) {
            const p = board[i][j];
            if(p && getPieceColor(p) === opp && isValidMoveWithoutSelfCheck(p, i, j, row, col, board)) return true;
        }
        return false;
    }

    function isValidMove(piece, fromRow, fromCol, toRow, toCol, board) {
        if(!isValidMoveWithoutSelfCheck(piece, fromRow, fromCol, toRow, toCol, board)) return false;
        const temp = copyBoard(board);
        temp[toRow][toCol] = piece;
        temp[fromRow][fromCol] = '';
        const kingPos = findKing(getPieceColor(piece), temp);
        return !(kingPos && isSquareAttacked(kingPos.row, kingPos.col, temp, getPieceColor(piece)));
    }

    function getAllValidMoves(color, board) {
        const moves = [];
        for(let i=0;i<8;i++) for(let j=0;j<8;j++) {
            const p = board[i][j];
            if(p && getPieceColor(p) === color) {
                for(let ti=0;ti<8;ti++) for(let tj=0;tj<8;tj++) {
                    if(isValidMove(p, i, j, ti, tj, board)) moves.push({from:{row:i,col:j}, to:{row:ti,col:tj}});
                }
            }
        }
        return moves;
    }

    function makeMove(move, board) {
        const {from,to} = move;
        const piece = board[from.row][from.col];
        board[to.row][to.col] = piece;
        board[from.row][from.col] = '';
        return piece;
    }

    function getBestAIMove() {
        const moves = getAllValidMoves('black', chessBoard);
        if(!moves.length) return null;
        const captures = moves.filter(m => chessBoard[m.to.row][m.to.col] && getPieceColor(chessBoard[m.to.row][m.to.col]) === 'white');
        if(captures.length) return captures[Math.floor(Math.random()*captures.length)];
        return moves[Math.floor(Math.random()*moves.length)];
    }

    function checkGameEnd() {
        const whiteMoves = getAllValidMoves('white', chessBoard);
        if(whiteMoves.length === 0) {
            if(isKingInCheck('white', chessBoard)) {
                gameOver = true;
                document.getElementById('chessMessage').innerHTML = "💔 Xeque-mate! A IA venceu...";
            } else {
                gameOver = true;
                document.getElementById('chessMessage').innerHTML = "🤝 Afogamento! Empate.";
            }
            return;
        }
        if(!findKing('black', chessBoard)) {
            gameOver = true;
            document.getElementById('chessMessage').innerHTML = "🎉 Parabéns meu amor! Você capturou o rei! 🎉";
            startConfetti();
        }
    }

    function isKingInCheck(color, board) {
        const kp = findKing(color, board);
        return kp && isSquareAttacked(kp.row, kp.col, board, color);
    }

    function aiMove() {
        if(gameOver || currentTurn !== 'black') return;
        const move = getBestAIMove();
        if(!move) {
            if(isKingInCheck('black', chessBoard)) {
                gameOver = true;
                document.getElementById('chessMessage').innerHTML = "🎉 Parabéns! Xeque-mate! Você venceu! 🎉";
                startConfetti();
            } else {
                gameOver = true;
                document.getElementById('chessMessage').innerHTML = "🤝 Afogamento! Empate.";
            }
            return;
        }
        makeMove(move, chessBoard);
        renderChessboard();
        currentTurn = 'white';
        if(isKingInCheck('white', chessBoard)) document.getElementById('chessMessage').innerHTML = "⚠️ Seu rei está em xeque! ⚠️";
        else document.getElementById('chessMessage').innerHTML = "";
        checkGameEnd();
    }

    function onSquareClick(row, col) {
        if(gameOver || currentTurn !== 'white') return;
        if(selectedRow === null) {
            const piece = chessBoard[row][col];
            if(piece && getPieceColor(piece) === 'white') { selectedRow = row; selectedCol = col; renderChessboard(); }
            return;
        }
        const piece = chessBoard[selectedRow][selectedCol];
        if(isValidMove(piece, selectedRow, selectedCol, row, col, chessBoard)) {
            const captured = chessBoard[row][col];
            makeMove({from:{row:selectedRow,col:selectedCol}, to:{row,col}}, chessBoard);
            selectedRow = null; selectedCol = null;
            renderChessboard();
            currentTurn = 'black';
            if(captured) {
                document.getElementById('chessMessage').innerHTML = "✨ Parabéns! Boa captura! ✨";
                startConfetti();
                setTimeout(() => { if(document.getElementById('chessMessage').innerHTML.includes("Parabéns")) document.getElementById('chessMessage').innerHTML = ""; }, 2000);
            }
            if(isKingInCheck('black', chessBoard)) document.getElementById('chessMessage').innerHTML = "🎯 Xeque no rei adversário! 🎯";
            checkGameEnd();
            if(!gameOver && currentTurn === 'black') setTimeout(() => aiMove(), 400);
        } else { selectedRow = null; selectedCol = null; renderChessboard(); }
    }

    function renderChessboard() {
        const div = document.getElementById('chessboard');
        if(!div) return;
        div.innerHTML = '';
        for(let i=0;i<8;i++) for(let j=0;j<8;j++) {
            const piece = chessBoard[i][j];
            const sq = document.createElement('div');
            sq.className = `chess-square ${(i+j)%2===0 ? 'light' : 'dark'}`;
            sq.textContent = piece ? pieceSymbols[piece] : '';
            sq.addEventListener('click', (() => onSquareClick(i,j)));
            if(selectedRow===i && selectedCol===j) sq.classList.add('selected');
            if(selectedRow!==null && selectedCol!==null) {
                const p = chessBoard[selectedRow][selectedCol];
                if(p && isValidMove(p, selectedRow, selectedCol, i, j, chessBoard)) sq.classList.add('possible-move');
            }
            div.appendChild(sq);
        }
    }

    function initChess() {
        initChessBoard();
        selectedRow = null; selectedCol = null;
        currentTurn = 'white'; gameOver = false;
        renderChessboard();
        document.getElementById('chessMessage').innerHTML = "";
    }

    // ======================== CUBO MÁGICO CORRIGIDO (tamanhos fixos, sem cortes) ========================
    let cubiesData = [], cubeSolved = false;
    const colorMap = {'U':'#FFFFFF','D':'#FFF2CC','F':'#F9C7D3','B':'#D9B4FF','L':'#B5E3FF','R':'#C9E4C5'};

    function initRubikCube() {
        const container = document.getElementById('rubiksCube');
        if(!container) return;
        cubiesData = [];
        for(let x=-1; x<=1; x++) for(let y=-1; y<=1; y++) for(let z=-1; z<=1; z++) {
            let cubie = {x,y,z, colors:{}};
            if(x===-1) cubie.colors.left = colorMap.L;
            if(x===1) cubie.colors.right = colorMap.R;
            if(y===-1) cubie.colors.bottom = colorMap.D;
            if(y===1) cubie.colors.top = colorMap.U;
            if(z===-1) cubie.colors.back = colorMap.B;
            if(z===1) cubie.colors.front = colorMap.F;
            cubiesData.push(cubie);
        }
        renderCube();
        scrambleCube();
    }

    function renderCube() {
        const container = document.getElementById('rubiksCube');
        if(!container) return;
        // Obtém o tamanho do cubo a partir do CSS (já responsivo)
        const cubeSize = container.offsetWidth;
        const cubieSize = cubeSize / 3;
        container.innerHTML = '';
        for(let cubie of cubiesData) {
            const div = document.createElement('div');
            div.className = 'cubie';
            const px = cubie.x * cubieSize;
            const py = cubie.y * cubieSize;
            const pz = cubie.z * cubieSize;
            div.style.transform = `translate3d(${px}px, ${py}px, ${pz}px)`;
            div.style.width = `${cubieSize}px`;
            div.style.height = `${cubieSize}px`;
            const faces = ['front','back','right','left','top','bottom'];
            for(let face of faces) {
                const faceDiv = document.createElement('div');
                faceDiv.className = `face ${face}`;
                let col = null;
                if(face==='front' && cubie.colors.front) col = cubie.colors.front;
                if(face==='back' && cubie.colors.back) col = cubie.colors.back;
                if(face==='right' && cubie.colors.right) col = cubie.colors.right;
                if(face==='left' && cubie.colors.left) col = cubie.colors.left;
                if(face==='top' && cubie.colors.top) col = cubie.colors.top;
                if(face==='bottom' && cubie.colors.bottom) col = cubie.colors.bottom;
                if(col) faceDiv.style.backgroundColor = col;
                else { faceDiv.style.backgroundColor = '#222'; faceDiv.style.opacity = '0.5'; }
                faceDiv.style.width = '100%';
                faceDiv.style.height = '100%';
                div.appendChild(faceDiv);
            }
            container.appendChild(div);
        }
    }

    function rotateFace(face, inverse=false) {
        if(cubeSolved) return;
        let affected = [];
        if(face==='U') affected = cubiesData.filter(c=>c.y===1);
        else if(face==='D') affected = cubiesData.filter(c=>c.y===-1);
        else if(face==='F') affected = cubiesData.filter(c=>c.z===1);
        else if(face==='B') affected = cubiesData.filter(c=>c.z===-1);
        else if(face==='L') affected = cubiesData.filter(c=>c.x===-1);
        else if(face==='R') affected = cubiesData.filter(c=>c.x===1);
        const angle = inverse ? -Math.PI/2 : Math.PI/2;
        for(let cubie of affected) {
            let nx=cubie.x, ny=cubie.y, nz=cubie.z;
            let old = {...cubie.colors};
            if(face==='U') { nx = Math.round(cubie.x*Math.cos(angle)-cubie.z*Math.sin(angle)); nz = Math.round(cubie.x*Math.sin(angle)+cubie.z*Math.cos(angle)); cubie.colors = rotateColorMap(old,'U',inverse); }
            if(face==='D') { nx = Math.round(cubie.x*Math.cos(-angle)-cubie.z*Math.sin(-angle)); nz = Math.round(cubie.x*Math.sin(-angle)+cubie.z*Math.cos(-angle)); cubie.colors = rotateColorMap(old,'D',inverse); }
            if(face==='F') { nx = Math.round(cubie.x*Math.cos(angle)-cubie.y*Math.sin(angle)); ny = Math.round(cubie.x*Math.sin(angle)+cubie.y*Math.cos(angle)); cubie.colors = rotateColorMap(old,'F',inverse); }
            if(face==='B') { nx = Math.round(cubie.x*Math.cos(-angle)-cubie.y*Math.sin(-angle)); ny = Math.round(cubie.x*Math.sin(-angle)+cubie.y*Math.cos(-angle)); cubie.colors = rotateColorMap(old,'B',inverse); }
            if(face==='L') { nz = Math.round(cubie.z*Math.cos(angle)-cubie.y*Math.sin(angle)); ny = Math.round(cubie.z*Math.sin(angle)+cubie.y*Math.cos(angle)); cubie.colors = rotateColorMap(old,'L',inverse); }
            if(face==='R') { nz = Math.round(cubie.z*Math.cos(-angle)-cubie.y*Math.sin(-angle)); ny = Math.round(cubie.z*Math.sin(-angle)+cubie.y*Math.cos(-angle)); cubie.colors = rotateColorMap(old,'R',inverse); }
            cubie.x=nx; cubie.y=ny; cubie.z=nz;
        }
        renderCube();
        checkCubeSolved();
    }

    function rotateColorMap(colors, face, inv) {
        let newC = {...colors};
        if(face==='U') { let t=newC.front; newC.front=newC.right; newC.right=newC.back; newC.back=newC.left; newC.left=t; }
        if(face==='D') { let t=newC.front; newC.front=newC.left; newC.left=newC.back; newC.back=newC.right; newC.right=t; }
        if(face==='F') { let t=newC.top; newC.top=newC.left; newC.left=newC.bottom; newC.bottom=newC.right; newC.right=t; }
        if(face==='B') { let t=newC.top; newC.top=newC.right; newC.right=newC.bottom; newC.bottom=newC.left; newC.left=t; }
        if(face==='L') { let t=newC.top; newC.top=newC.back; newC.back=newC.bottom; newC.bottom=newC.front; newC.front=t; }
        if(face==='R') { let t=newC.top; newC.top=newC.front; newC.front=newC.bottom; newC.bottom=newC.back; newC.back=t; }
        return newC;
    }

    function checkCubeSolved() {
        const solved = cubiesData.every(cubie => {
            if(cubie.x===1 && (!cubie.colors.right || cubie.colors.right !== colorMap.R)) return false;
            if(cubie.x===-1 && (!cubie.colors.left || cubie.colors.left !== colorMap.L)) return false;
            if(cubie.y===1 && (!cubie.colors.top || cubie.colors.top !== colorMap.U)) return false;
            if(cubie.y===-1 && (!cubie.colors.bottom || cubie.colors.bottom !== colorMap.D)) return false;
            if(cubie.z===1 && (!cubie.colors.front || cubie.colors.front !== colorMap.F)) return false;
            if(cubie.z===-1 && (!cubie.colors.back || cubie.colors.back !== colorMap.B)) return false;
            return true;
        });
        if(solved && !cubeSolved) {
            cubeSolved = true;
            document.getElementById('cubeMessage').innerHTML = "🎉 Parabéns meu amor! Você montou o cubo! 🎉";
            startConfetti();
        } else if(!solved) cubeSolved = false;
    }

    function scrambleCube() {
        const moves = ['U',"U'",'D',"D'",'L',"L'",'R',"R'",'F',"F'",'B',"B'"];
        for(let i=0;i<50;i++) {
            let m = moves[Math.floor(Math.random()*moves.length)];
            rotateFace(m[0], m.includes("'"));
        }
        cubeSolved = false;
        document.getElementById('cubeMessage').innerHTML = "";
    }

    function setupCubeControls() {
        document.querySelectorAll('[data-move]').forEach(btn => {
            btn.addEventListener('click', () => {
                let move = btn.dataset.move;
                rotateFace(move[0], move.includes("'"));
            });
        });
        document.getElementById('scrambleCube').addEventListener('click', () => scrambleCube());
    }

    function adjustCubeLayout() {
        const wrapper = document.querySelector('.cube-wrapper');
        if(wrapper && !document.getElementById('cubeInstruction')) {
            wrapper.style.marginTop = '1rem';
            const inst = document.createElement('div');
            inst.id = 'cubeInstruction';
            inst.className = 'cube-instruction';
            inst.innerHTML = '💡 Instrução: Clique nos botões (U, D, L, R, F, B) para girar as faces. Use o apóstrofo (\') para sentido inverso. Embaralhe e tente montar todas as faces com cores sólidas!';
            wrapper.parentNode.insertBefore(inst, wrapper.nextSibling);
        }
    }

    function handleResize() {
        const container = document.getElementById('rubiksCube');
        if(container && cubiesData.length) renderCube();
    }
    window.addEventListener('resize', () => setTimeout(handleResize, 100));

    // ======================== CONFETES ========================
    function startConfetti() {
        for(let i=0;i<80;i++) {
            let c = document.createElement('div');
            c.classList.add('confetti');
            c.style.left = Math.random() * 100 + '%';
            c.style.animationDuration = (Math.random() * 2 + 1) + 's';
            c.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 60%)`;
            c.style.width = (Math.random()*8+4)+'px';
            c.style.height = (Math.random()*12+8)+'px';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 3000);
        }
    }

    setupCubeControls();
});