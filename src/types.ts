export interface BorrowedTool {
  id: number;
  name: string;
  borrowed: number;
}

export interface ToolInfo extends BorrowedTool {
  stock: number;
}

export interface ToolData {
  name: string;
  stock: string;
}

export interface ToolEntity extends ToolData {
  id: number;
}

export interface Borrower {
  id: number;
  name: string;
  borrowCount: number;
}
