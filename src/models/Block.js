import sha256 from 'crypto-js/sha256'
import UTXOPool from "./UTXOPool";
import { map } from "ramda";
import { transactionFromJSON } from "./Transaction";

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

  // 添加新的区块
  createChild(coinbaseBeneficiary) {
    return new Block({
      blockchain: this.blockchain,
      parentHash: this.hash,
      height: this.height + 1,
      coinbaseBeneficiary
    })
  }

  // 计算区块 Hash
  _calculateHash() {
    return sha256(this.nonce + this.parentHash + this.coinbaseBeneficiary).toString()
  }

  toJSON() {
    return {
      hash: this.hash,
      nonce: this.nonce,
      parentHash: this.parentHash,
      height: this.height,
      coinbaseBeneficiary: this.coinbaseBeneficiary,
      transactions: map(transaction => transaction.toJSON(), this.transactions)
    };
  }
}

export function blockFromJSON(blockchain, data) {
  return new Block({
    ...data,
    blockchain
  });
}

export default Block
