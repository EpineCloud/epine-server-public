import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider } from 'ton-core'
import { NftItem } from './NFTItem'

// snippet from: https://github.com/ton-community/sandbox/blob/main/examples/contracts/NftCollection.ts

export interface NftCollectionData {
    nextItemIndex: number
    content: string
    owner: Address
}

export interface NftCollectionConfig {
    owner: Address
    nextItemIndex?: number
    content?: Cell
    itemCode?: Cell
    royaltyParams?: Cell
}

function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(config.nextItemIndex ?? 0, 64)
        .storeRef(config.content ?? beginCell().storeRef(new Cell()))
        .storeRef(config.itemCode ?? NftItem.code)
        .storeRef(config.royaltyParams ?? new Cell())
        .endCell()
}

export class NftCollection implements Contract {
    static readonly code = Cell.fromBase64('te6ccgECEwEAAf4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgPr0QY4BIrfAA6GmBgLjYSK3wfSAYAOmP6Z/2omh9IGmf6mpqGEEINJ6cqClAXUcUG6+CgOhBCFRlgFa4QAhkZYKoAueLEn0BCmW1CeWP5Z+A54tkwCB9gHAbKLnjgvlwyJLgAPGBEuABcYEZAmAB8YEvgsIH+XhAYHCAIBIAkKAGA1AtM/UxO78uGSUxO6AfoA1DAoEDRZ8AaOEgGkQ0PIUAXPFhPLP8zMzMntVJJfBeIApjVwA9QwjjeAQPSWb6UgjikGpCCBAPq+k/LBj96BAZMhoFMlu/L0AvoA1DAiVEsw8AYjupMCpALeBJJsIeKz5jAyUERDE8hQBc8WE8s/zMzMye1UACgB+kAwQUTIUAXPFhPLP8zMzMntVAIBIAsMAD1FrwBHAh8AV3gBjIywVYzxZQBPoCE8trEszMyXH7AIAC0AcjLP/gozxbJcCDIywET9AD0AMsAyYAAbPkAdMjLAhLKB8v/ydCACASAPEAAlvILfaiaH0gaZ/qamoYLehqGCxABDuLXTHtRND6QNM/1NTUMBAkXwTQ1DHUMNBxyMsHAc8WzMmAIBIBESAC+12v2omh9IGmf6mpqGDYg6GmH6Yf9IBhAALbT0faiaH0gaZ/qamoYCi+CeAI4APgCw')

    nextItemIndex = 0

    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftCollection(address)
    }

    static createFromConfig(config: NftCollectionConfig, code: Cell, workchain = 0) {
        const data = nftCollectionConfigToCell(config)
        const init = { code, data }
        const collection = new NftCollection(contractAddress(workchain, init), init)
        if (config.nextItemIndex !== undefined) {
            collection.nextItemIndex = config.nextItemIndex
        }
        return collection
    }

    async getCollectionData(provider: ContractProvider): Promise<NftCollectionData> {
        const { stack } = await provider.get('get_collection_data', [])
        return {
            nextItemIndex: stack.readNumber(),
            content: stack.readString(),
            owner: stack.readAddress(),
        }
    }

    // added by me to the original snippet
    async getNftItemMetadata(provider: ContractProvider, index: number, contentCell: Cell): Promise<{contentUri: string }> {
        const { stack } = await provider.get('get_nft_content', [{ type: 'int', value: BigInt(index) }, { type: 'cell', cell: contentCell }])

        return { contentUri: stack.readCell().beginParse().loadBuffer(93).toString() }
    }
}
