// @flow

type base58 = string;

export class Transaction {
  type: number;
  id: string;
  timestamp: number;
  amount: number;
  sender: string;
  senderPublicKey: base58;
  recipient: base58;
  assetId: ?base58;
  feeAssetId: ?base58;
  fee: number;
  attachment: base58;
  signature: base58;
  height: number;

  // asset issuance
  quantity: ?number;
  decimals: ?number;
  reissuable: ?boolean;
  assetName: ?string;
  description: ?string;

  constructor(json: any) {
    this.type = json.type;
    this.id = json.id;
    this.amount = json.amount;
    this.timestamp = json.timestamp;
    this.sender = json.sender;
    this.senderPublicKey = json.senderPublicKey;
    this.recipient = json.recipient;
    this.assetId = json.assetId || null;
    this.feeAssetId = json.feeAssetId || null;
    this.fee = json.fee;
    this.attachment = json.attachment;
    this.signature = json.signature;
    this.height = json.height;
    this.quantity = json.quantity;
    this.decimals = json.decimals;
    this.reissuable = json.reissuable;
    this.assetName = json.name;
    this.description = json.description;
  }
}


export class Block {
  height: number;
  version: number;
  timestamp: number;
  generator: base58;
  fee: number;
  baseTarget: number;
  generationSignature: base58;
  transactions: Array<Transaction>;
  signature: base58;
  // parent block
  reference: base58;

  constructor(json: any) {
    this.height = json.height;
    this.version = json.version;
    this.generator = json.generator;
    this.fee = json.fee;
    this.timestamp = json.timestamp;

    // we still have these wrong names in json ;(
    this.baseTarget = json['nxt-consensus']['base-target'];
    this.generationSignature = json['nxt-consensus']['generation-signature'];

    // use height value from block because tx doesn't contain it
    this.transactions = json.transactions.map(tx =>
      new Transaction(Object.assign({}, tx, {height: json.height})));

    this.signature = json.signature;
    this.reference = json.reference;
  }
}

export class NodeStatus {
  historySynchronizationStatus: string;
  blockGeneratorStatus: string;

  constructor(json: any) {
    this.blockGeneratorStatus = json.blockGeneratorStatus;
    this.historySynchronizationStatus = json.historySynchronizationStatus;
  }
}

export class AssetBalance {
  assetId: base58;
  balance: number;
  totalQuantity: number;
  issueTransaction: Transaction;

  constructor(json: any) {
    this.assetId = json.assetId;
    this.balance = json.balance;
    this.totalQuantity = json.quantity;
    this.issueTransaction = new Transaction(json.issueTransaction);
  }
}


export class ErrorResponse {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}
