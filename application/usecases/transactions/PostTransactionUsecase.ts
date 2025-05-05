import { TransactionRepo } from '@/domain/repositories/TransactionRepo';
import { PostTransactionRequest, PostTransactionResponse } from './dto/TransactionsDto';

export class PostTransactionUseCase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(userId: string, props: PostTransactionRequest): Promise<PostTransactionResponse> {
    const { type, date, category, amount, memo } = props;

    const isExpense = type === 'expense';

    const transaction = await this.transactionRepo.POSTtransaction({
      userId,
      categoryId: category,
      date,
      amount,
      memo,
      isExpense,
    });

    if (!transaction || Array.isArray(transaction)) {
      throw new Error('Transaction creation failed');
    }

    return {
      id: transaction.id.toString(),
      message: 'Transaction created successfully',
    };
  }
}
