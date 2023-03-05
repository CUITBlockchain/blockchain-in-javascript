import sha256 from 'crypto-js/sha256'

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
}

export default Block
