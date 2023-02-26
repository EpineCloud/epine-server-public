import { fromNano } from 'ton-core'
import { TonClient, address as toAddress } from 'ton'

import { BaseTokens, TokensConfig, TokenBalance } from './BaseTokens'

export class TvmTokens extends BaseTokens {
  private readonly _client: TonClient

  constructor(readonly config: TokensConfig) {
    super(config)

    this._client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    })
  }

  async getAddressBalance(address: string): Promise<TokenBalance[]> {
    const balance = await this._client.getBalance(toAddress(address))
    return [
      {
        address: '',
        symbol: 'TON',
        balance: Number(fromNano(balance)),
        native: true,
      },
    ]
  }
}
