export interface PostTransactionRequest {
  type: 'income' | 'expense';
  date: string;
  category: string;
  amount: number;
  memo?: string;
}

export interface PostTransactionResponse {
  id: string;
  message: string;
}
