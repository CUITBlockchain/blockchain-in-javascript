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
}

export default Block
