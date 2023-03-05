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
    if (!block.isValid())
      return
    if (this.containsBlock(block))
      return

    // check that the parent is actually existent and the advertised height is correct
    const parent = this.blocks[block.parentHash];
    if (parent === undefined && parent.height + 1 !== block.height )
      return

    // Add coinbase coin to the pool of the parent
    const newUtxoPool = parent.utxoPool.clone();
    newUtxoPool.addUTXO(block.coinbaseBeneficiary, 12.5)
    block.utxoPool = newUtxoPool;

    this.blocks[block.hash] = block;
    rerender()
  }
}

export default Blockchain
