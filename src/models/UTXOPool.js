import UTXO from './UTXO'

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos = utxos
  }

  // 添加 UTXO 交易
  addUTXO(publicKey, amount) {
    if (this.utxos[publicKey]) {
      this.utxos[publicKey].amount += amount
    } else {
      const utxo = new UTXO(publicKey, amount)
      this.utxos[publicKey] = utxo
    }
  }

  // 处理交易
  handleTransaction(transaction, feeReceiver) {
    if (
      !this.isValidTransaction(
        transaction.inputPublicKey,
        transaction.amount,
        transaction.fee,
      )
    )
      return
    const inputUTXO = this.utxos[transaction.inputPublicKey]
    inputUTXO.amount -= transaction.amount
    inputUTXO.amount -= transaction.fee
    if (inputUTXO.amount === 0) delete this.utxos[transaction.inputPublicKey]
    this.addUTXO(transaction.outputPublicKey, transaction.amount)
    this.addUTXO(feeReceiver, transaction.fee)
  }

  // 验证交易合法性
  isValidTransaction(inputPublicKey, amount) {
    const utxo = this.utxos[inputPublicKey]
    return utxo !== undefined && utxo.amount >= amount && amount > 0
  }

  clone() {
    return new UTXOPool(clone(this.utxos))
  }
}

export default UTXOPool
