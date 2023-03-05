import sha256 from 'crypto-js/sha256'

class Transaction {
  constructor(inputPublicKey, outputPublicKey, amount) {
    this.inputPublicKey = inputPublicKey
    this.outputPublicKey = outputPublicKey
    this.amount = amount
    this._setHash()
  }

  _setHash() {
    this.hash = this._calculateHash()
  }

  _calculateHash() {
    return sha256(
      this.inputPublicKey + this.outputPublicKey + this.amount,
    ).toString()
  }

  
  toJSON() {
    return {
      inputPublicKey: this.inputPublicKey,
      outputPublicKey: this.outputPublicKey,
      amount: this.amount,
      fee: this.fee,
      hash: this.hash,
      signature: this.signature,
    }
  }
}

export function transactionFromJSON(transaction) {
  return new Transaction(
    transaction.inputPublicKey,
    transaction.outputPublicKey,
    transaction.amount,
    transaction.fee,
    transaction.signature,
  )
}

export default Transaction
