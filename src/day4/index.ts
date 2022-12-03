import { readFileSync } from 'fs';
import { join } from 'path';

class Board {
  private readonly rows: number[][];
  private readonly marked: { rowIndex: number; columnIndex: number }[] = [];

  constructor(rows: number[][]) {
    const totalItems = rows.reduce(
      (acc, current) => (acc += current.length),
      0
    );
    if (totalItems !== 25) {
      throw new Error('Invalid board.');
    }
    this.rows = rows;
  }

  mark(value: number): void {
    this.rows.forEach((row, rowIndex) => {
      row.forEach((number, columnIndex) => {
        if (number === value) {
          this.marked.push({ rowIndex, columnIndex });
        }
      });
    });
  }

  isWinner(): boolean {
    if (this.marked.length < 5) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      const fullRow = this.marked.filter((x) => x.rowIndex === i).length === 5;
      const fullColumn =
        this.marked.filter((x) => x.columnIndex === i).length === 5;
      if (fullRow || fullColumn) {
        return true;
      }
    }

    return false;
  }

  getScore(winningNumber: number): number {
    let score = 0;
    this.rows.forEach((row, rowIndex) => {
      row.forEach((number, columnIndex) => {
        const marked = this.marked.find(
          (x) => x.rowIndex === rowIndex && x.columnIndex === columnIndex
        );
        if (!marked) {
          score += number;
        }
      });
    });
    return score * winningNumber;
  }
}

const data = readFileSync(join(__dirname, 'input.txt'), {
  encoding: 'utf8',
  flag: 'r',
});

const items: string[] = data.split(/\n/).filter((line) => !!line.trim());

const [firstLine, ...rest] = items;
const numbers = firstLine.split(',').map((x) => parseInt(x, 10));

const boards: Board[] = [];
rest.reduce((acc, _, index) => {
  if ((index + 1) % 5 === 0) {
    acc.push(
      new Board(
        rest.slice(index - 4, index + 1).map((line) =>
          line
            .split(/\s/)
            .filter((x) => !!x.trim())
            .map((x) => parseInt(x, 10))
        )
      )
    );
  }
  return acc;
}, boards);

let winningBoards: { boardIndex: number; score: number }[] = [];
for (let number of numbers) {
  for (let [boardIndex, board] of boards.entries()) {
    board.mark(number);
    if (board.isWinner()) {
      if (!winningBoards.find((b) => b.boardIndex === boardIndex)) {
        winningBoards.push({ boardIndex, score: board.getScore(number) });
      }
      boards.slice(boardIndex, 1);
    }
  }
}

console.log(`The score for the first board is ${winningBoards.at(0)?.score}.`);
console.log(`The score for the last board is ${winningBoards.at(-1)?.score}.`);
