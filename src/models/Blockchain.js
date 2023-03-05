import { maxBy, reduce, unfold, reverse, values, prop } from 'ramda'

// Blockchain
class Blockchain {
  // 构造函数
  constructor(name) {
    this.name = name;
    this.genesis = null;
    this.blocks = {};

    this.pendingTransactions = {};

  }

  longestChain() {
    const blocks = values(this.blocks)
    const maxByHeight = maxBy(prop('height'))
    const maxHeightBlock = reduce(maxByHeight, blocks[0], blocks)
    const getParent = (x) => {
      if (x === undefined) {
        return false
      }

      return [x, this.blocks[x.parentHash]]
    }
    return reverse(unfold(getParent, maxHeightBlock))
  }


  containsBlock(block) {
    return this.blocks[block.hash] !== undefined;
  }


  _addBlock(block) {
    // ...
    const newUtxoPool = parent.utxoPool.clone();
    block.utxoPool = newUtxoPool;

    // Add coinbase coin to the pool
    block.utxoPool.addUTXO(block.coinbaseBeneficiary, 12.5)

    // Reapply transactions to validate them
    const transactions = block.transactions
    block.transactions = {}
    let containsInvalidTransactions = false;

    Object.values(transactions).forEach(transaction => {
      if (block.isValidTransaction(transaction.inputPublicKey, transaction.amount)) {
        block.addTransaction(transaction.inputPublicKey, transaction.outputPublicKey, transaction.amount)
      } else {
        containsInvalidTransactions = true
      }
    })

    // If we found any invalid transactions, dont add the block
    if (containsInvalidTransactions)
      return
    // ...
  }
}

export default Blockchain
