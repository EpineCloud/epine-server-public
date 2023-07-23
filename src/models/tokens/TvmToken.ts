import { fromNano, Address, Cell } from 'ton-core'
import { TonClient } from 'ton'


import { BaseTokens, TokensConfig, TokenBalance, INFTData, INFTCollectionMetadata } from './BaseTokens'
import { NftItem } from './TVMContracts/NFTItem'
import { NftCollection } from './TVMContracts/NFtCollection'


export class TvmTokens extends BaseTokens {
  private readonly _client: TonClient

  constructor(readonly config: TokensConfig) {
    super(config)

    this._client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    })
  }

  async getAddressBalance(address: string): Promise<TokenBalance[]> {
    const balance = await this._client.getBalance(Address.parseFriendly(address).address)
    return [
      {
        address: '',
        symbol: 'TON',
        balance: Number(fromNano(balance)),
        native: true,
      },
    ]
  }

  async getNFTItemData(address: string): Promise<INFTData> {
    const nftItem = this._client.open(new NftItem(Address.parseFriendly(address).address))
    const data = await nftItem.getData()
    return {
      collectionAddress: data.collection ? data.collection.toString() : undefined,
      ownerAddress: data.owner ? data.owner.toString() : undefined,
      contentBlock: data.content ? data.content : undefined,
      nftItemIndex: data.index ? data.index : undefined,

    }
  }

  async getNftMetadata(collectionAddress: string, nftItemIndex: number, contentBloc: Cell): Promise<{contentUri: string | undefined}> {
    const nftCollection = this._client.open(new NftCollection(Address.parseFriendly(collectionAddress).address))
    const data = await nftCollection.getNftItemMetadata(nftItemIndex, contentBloc)
    return {
      contentUri: data.contentUri ? data.contentUri.includes('\x01') ? data.contentUri.split('\x01')[1] : data.contentUri : undefined,
    }
  }

  async getNFTCollectionMetadata(nftCollectionAddress: string): Promise<INFTCollectionMetadata> {
    const nftCollection = this._client.open(new NftCollection(Address.parseFriendly(nftCollectionAddress).address))
    const data = await nftCollection.getCollectionData()
    return {
      ownerAddress: data.owner ? data.owner.toString() : undefined,
      collectionContentUri: data.content ? data.content.includes('\x01') ? data.content.split('\x01')[1] : data.content : undefined,
    }
  }
}
