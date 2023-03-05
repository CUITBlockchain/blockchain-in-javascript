import sha256 from 'crypto-js/sha256'

const DIFFICULTY = 2;

// 区块
class Block {
  constructor(
    blockchain,
    parentHash,
    nonce = sha256(new Date().getTime().toString()).toString(),
  ) {
    this.blockchain = blockchain
    this.nonce = nonce
    this.parentHash = parentHash
    this.hash = sha256(this.nonce + this.parentHash).toString()
  }

  // 验证区块 hash
  isValid() {
    return (
      this.parentHash === 'root' ||
      (this.hash.substr(-DIFFICULTY) === '0'.repeat(DIFFICULTY) &&
        this.hash === sha256(this.nonce + this.parentHash).toString())
    )
  }

  // 设置 nonce 随机数
  setNonce(nonce) {
    this.nonce = nonce
    this._setHash()
  }

  // 设置 Hash
  _setHash() {
    this.hash = sha256(this.nonce + this.parentHash).toString()
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

export default Block
