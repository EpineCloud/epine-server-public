import { Cell } from 'ton-core'
import { ChainId, ChainType } from '../chains/types'

export interface TokensConfig {
  chainType: ChainType
  chainId?: ChainId
}

export interface TokenBalance {
  address: string
  symbol: string
  balance: number
  native: boolean
}

export interface INFTData {
  collectionAddress: string | undefined
  ownerAddress: string | undefined
  nftItemIndex: number | undefined
  contentBlock: Cell | undefined
}

export interface INFTCollectionMetadata {
  ownerAddress: string | undefined
  collectionContentUri: string | undefined

}

export abstract class BaseTokens {
  constructor(readonly config: TokensConfig) {}

  abstract getAddressBalance(address: string): Promise<TokenBalance[]>

  abstract getNFTItemData(address: string): Promise<INFTData>

  abstract getNftMetadata(collectionAddress: string, nftItemIndex: number, contentBloc: Cell): Promise<{contentUri: string | undefined}>

  abstract getNFTCollectionMetadata(address: string): Promise<INFTCollectionMetadata>
}
