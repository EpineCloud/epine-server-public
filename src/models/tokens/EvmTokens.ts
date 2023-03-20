import { JsonRpcProvider, formatEther } from 'ethers'
import { Cell } from 'ton-core'

import { ChainId } from '../chains/types'

import { BaseTokens, TokensConfig, TokenBalance, INFTData, INFTCollectionMetadata } from './BaseTokens'

export class EvmTokens extends BaseTokens {
  private readonly _provider: JsonRpcProvider

  constructor(readonly config: TokensConfig) {
    super(config)

    const RPC_URL: {[chainId in ChainId]: string} = {
      // Mainnets
      [ChainId.EVM_ETHEREUM]: 'https://rpc.ankr.com/eth',
      [ChainId.EVM_POLYGON]: 'https://rpc.ankr.com/polygon',

      // Testnets
      [ChainId.EVM_TESTNET_ZK_SYNC]: 'https://zksync2-testnet.zksync.dev',
    }

    this._provider = new JsonRpcProvider(RPC_URL[config.chainId ?? ChainId.EVM_ETHEREUM])
  }

  async getAddressBalance(address: string): Promise<TokenBalance[]> {
    const balance = await this._provider.getBalance(address)

    const NATIVE_SYMBOL: {[chainId in ChainId]: string} = {
      [ChainId.EVM_ETHEREUM]: 'ETH',
      [ChainId.EVM_POLYGON]: 'MATIC',
      [ChainId.EVM_TESTNET_ZK_SYNC]: 'ETH',
    }

    return [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: NATIVE_SYMBOL[this.config.chainId ?? ChainId.EVM_ETHEREUM],
        balance: Number(formatEther(balance)),
        native: true,
      },
    ]
  }

  // TO BE REFACTORED
  async getNFTItemData(address: string): Promise<INFTData> {
    return {
      collectionAddress: undefined,
      ownerAddress: undefined,
      contentBlock: undefined,
      nftItemIndex: undefined,
    }
  }

  // TO BE REFACTORED
  async getNftMetadata(collectionAddress: string, nftItemIndex: number, contentBloc: Cell): Promise<{contentUri: string | undefined}> {
    return {
      contentUri: undefined,
    }
  }

  // TO BE REFACTORED
  async getNFTCollectionMetadata(address: string): Promise<INFTCollectionMetadata> {
    return {
      ownerAddress: undefined,
      collectionContentUri: undefined,
    }
  }
}
