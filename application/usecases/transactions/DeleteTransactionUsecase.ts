import { TransactionRepo } from '@/domain/repositories/TransactionRepo';

export class DeleteTransactionUsecase {
  constructor(private readonly transactionRepo: TransactionRepo) {}

  async execute(transactionId: string | null): Promise<{ id: number } | []> {
    const deletedTransaction = await this.transactionRepo.DELETEtransaction(transactionId);
    return deletedTransaction;
  }
}
