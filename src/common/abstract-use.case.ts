import { IDatabaseContext } from './database-context.interface.js';
import { InTransaction } from './in-transaction.enum.js';

abstract class AbstractUseCase<TInputData = void, TOutputData = void> {
  protected _inputData: TInputData;
  protected _inTransaction: InTransaction;
  protected abstract _dbContext: IDatabaseContext | null;

  public async execute(
    inputData: TInputData,
    inTransaction: InTransaction = InTransaction.OFF,
  ): Promise<TOutputData> {
    this._inputData = inputData;
    this._inTransaction = inTransaction;

    let result: TOutputData;

    try {
      if (this._inTransaction === InTransaction.ON) {
        await this._dbContext.startTransaction();
      }

      result = await this.implementation(inputData);

      if (this._inTransaction === InTransaction.ON) {
        await this._dbContext.commitTransaction();
      }
    } catch (error) {
      if (this._inTransaction === InTransaction.ON) {
        await this._dbContext.rollbackTransaction();
      }
      throw error;
    }
    return result;
  }

  protected abstract implementation(
    inputData: TInputData,
  ): Promise<TOutputData> | TOutputData;
}

export default AbstractUseCase;
