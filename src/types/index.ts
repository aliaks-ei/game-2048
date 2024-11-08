export interface Tile {
  id: string;
  value: number;
  col: number;
  row: number;
}

export interface Cell {
  tile?: Tile;
  tileToMerge?: Tile;
  col: number;
  row: number;
}
