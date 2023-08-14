// UI VARS

const resetBtn: HTMLButtonElement = document.querySelector(".reset-btn")!;
const boardElm: HTMLDivElement = document.querySelector(".board")!;
const playerElm: HTMLHeadingElement = document.querySelector(".player")!;
const historiesElm: HTMLDivElement = document.querySelector(".histories")!;

// LOGIC VARS

const KEYS: { BOARDS: string; STEP: string } = {
  BOARDS: "keys/boards",
  STEP: "keys/step",
};




//////////////////////////////////////
function setItem(key: string, value: string) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key: string, defaultValue: any) {
  return JSON.parse(localStorage.getItem(key)!);
}

function removeItem(key: string) {
  localStorage.removeItem(key);
}

function clear() {
  localStorage.clear();
}

/////

let boards: string[][] = getItem(KEYS.BOARDS, [new Array(9).fill(null)]);
let currentStep: number = getItem(KEYS.STEP, boards.length - 1);

let nextPlayer = currentStep % 2 === 0 ? "X" : "O";
let winner: null | undefined = null;

function getWinner(board: []) {
  const winnerCondensations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  function check(first: number, second: number) {
    if (first === null || second === null) return null;
    else return first === second;
  }
  for (let [a, b, c] of winnerCondensations) {
    if (check(board[a], board[b]) && check(board[b], board[c])) return board[a];
  }
}

// HANDLE FUNCTIONS
function handleCell(cellIdx: number) {
  if (winner) return;

  const nextBoard: string[] = [...boards[currentStep]];
  if (nextBoard[cellIdx]) return;

  currentStep++;

  nextBoard[cellIdx] = nextPlayer;

  if (currentStep < boards.length) boards.splice(currentStep, boards.length);
  boards.push(nextBoard);

  setItem(KEYS.BOARDS, boards);
  setItem(KEYS.STEP, currentStep);

  renderBoard(nextBoard);
  renderHistories();
}

function handleReset() {
  currentStep = 0;
  boards = [new Array(9).fill(null)];
  winner = null;
  nextPlayer = "X";
  clear();
  renderBoard(boards[currentStep]);
  renderHistories();
}

function handleHistory(stepIdx: any) {
  currentStep = stepIdx;
  setItem(KEYS.STEP, stepIdx);
  renderBoard(boards[currentStep]);
  renderHistories();
}

// UI FUNCTIONS
function renderBoard(board: string[]) {
  const cellElms = boardElm.children;

  for (let i = 0; i < cellElms.length; i++) {
    const cell = board[i];
    const cellElm: any = cellElms[i];
    cellElm.innerText = cell || "";
    cellElm.onclick = () => handleCell(i);
  }

  renderPlayer();
}

function renderHistories() {
  const historiesCount = boards.length;

  historiesElm.innerHTML = "";

  for (let i = 0; i < historiesCount; i++) {
    const historyBtn = document.createElement("button");
    const isCurrent = i === currentStep;
    let message = i === 0 ? "Go to game start" : `Go to move #${i}`;

    if (isCurrent) {
      historyBtn.disabled = true;
      historyBtn.classList.add("disabled");
      message += "(current)";
    }

    historyBtn.innerText = message;
    historyBtn.onclick = () => handleHistory(i);
    historiesElm.appendChild(historyBtn);
  }
}

function renderPlayer() {
  winner = getWinner(boards[currentStep]);

  const currentPlayer = currentStep % 2 === 0 ? "O" : "X";
  nextPlayer = currentStep % 2 === 0 ? "X" : "O";

  if (winner) playerElm.innerText = `Winner ${currentPlayer}`;
  else {
    playerElm.innerText = `Next Player: ${nextPlayer}`;
  }
}

// LOGIC FUNCTIONS

function startGame() {
  renderBoard(boards[currentStep]);
  renderHistories();
  resetBtn.addEventListener("click", handleReset);
}

function init() {
  startGame();
}

init();

