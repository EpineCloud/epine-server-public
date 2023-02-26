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

export abstract class BaseTokens {
  constructor(readonly config: TokensConfig) {}

  abstract getAddressBalance(address: string): Promise<TokenBalance[]>
}
