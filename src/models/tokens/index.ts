import { ChainType } from '../chains/types'

import { BaseTokens, TokensConfig } from './BaseTokens'
import { EvmTokens } from './EvmTokens'
import { TvmTokens } from './TvmToken'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TokensFactory {
  static create(config: TokensConfig): BaseTokens {
    switch (config.chainType) {
      case ChainType.EVM: {
        return new EvmTokens(config)
      }
      case ChainType.TVM: {
        return new TvmTokens(config)
      }
      default: {
        throw new Error('Unknown chainType')
      }
    }
  }
}
