import Waves from '../src/index'
import { get, fromPairs } from 'lodash'

const client = () => {
  const rpc = new Waves(Waves.TestNetParameters())
  rpc.currentClient = rpc.client('http://127.0.0.1:6869')
  return rpc
}

const waves = client()

const wavesTestAccount = {
  address: '3Msvvmc2knqVqSgX2A59vDnEkLWKFYdD3p5',
  keys: {
    publicKey: "GbGEY3XVc2ohdv6hQBukVKSTQyqP8rjQ8Kigkj6bL57S",
    privateKey: "FYLXp1ecxQ6WCPD4axTotHU9RVfPCBLfSeKx1XSCyvdT"
  }
}

describe('Waves test', () => {
  let account
  let txID
  it('get account balance',async() => {
    if(wavesTestAccount) {
      const balance = await waves.currentClient.getBalance(wavesTestAccount.address)
      console.log(balance)
    }
  })
  it('get info', async () => {
    console.log(waves.name)
    console.log(await waves.currentClient.getNodeVersion())
    //console.log(await waves.currentClient.getNodeStatus())
    console.log(await waves._networkParams)
  })

  it('create new', async() => {
    const WalletId = "seed"
    console.log(`Started Waves: createNew for generated id "${WalletId}"`)
    account = await waves.createAccount(WalletId)
    console.log(
      `Created Waves wallet account "${WalletId}" and received associated address "${account.address}"`,
    )
    console.log({ uuid: WalletId, address: account.address, pubKey: Waves.Base58.encode(account.keys.publicKey),privateKey: Waves.Base58.encode(account.keys.privateKey)})
  })

  it('get account balance',async() => {
    if(account) {
      const balance = await waves.currentClient.getBalance(account.address)
      console.log(balance)
    }
  })

  it('send WAVES to new account',async () => {
    const senderPublicKey = wavesTestAccount.keys.publicKey
    const amount = 1

    const height = await waves.currentClient.getHeight()
    console.log("height: " + height)
    const block = await waves.currentClient.getBlockAt(height)
    const fee = block.fee;

    const recipient = account.address
    const timestamp = new Date().getTime()

    console.log("tx data: ")
    const tx = waves.createAssetTransfer(senderPublicKey,
      recipient,
      null,
      amount * 100000 * 100,
      null,
      100000,
      timestamp,
      null)
    console.log(tx)
    console.log("tx sing: ")
    const signTransaction = Waves.signTransaction(tx,Waves.Base58.decode(wavesTestAccount.keys.privateKey))
    console.log(signTransaction)
    console.log("tx assert: ")
    const assetTx = Waves.HttpApi.AssetTransferTransaction.fromSigned(signTransaction);
    console.log(assetTx)
    console.log("tx res: ")
    let result
    try {
      result = await waves.currentClient.publishAssetTransfer(assetTx)
    } catch(e){
      result = e;
      console.log(result)
    }

    //console.log(result)
    //txID = Waves.Base58.encode(result.id)
  })

  it('get transaction info',async () => {
    if(!txID){
      return
    }
    console.log(`Started XRP: getTransactionInfo for "${txID}"`)

    const txInfo = await waves.currentClient.getTransaction(txID)
//
    //if(txInfo.outcome.result !== 'tesSUCCESS') {
    //    console.log(`Transaction ${txID} seems to have failed`)
    //    return
    //}
    console.log("tx: " + txInfo)
  })

})
