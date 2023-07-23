import { TvmTokens } from './TvmToken'
import { ChainType } from '../chains/types'


describe('Test NFT methods', () => {
    beforeEach(async () => {
        await new Promise(resolve => setTimeout(() => {
            expect(true).toBe(true)
            resolve('avoid rate limit...')
          }, 2000))
    })

    it('should get NFT item data', async () => {
        const tvmToken = new TvmTokens({
            chainType: ChainType.TVM,
            chainId: 1, // useless
        })
         // https://explorer.tonnft.tools/nft/EQC6KV4zs8TJtSZapOrRFmqSkxzpq-oSCoxekQRKElf4nC1I
        const response = await tvmToken.getNFTItemData('EQC6KV4zs8TJtSZapOrRFmqSkxzpq-oSCoxekQRKElf4nC1I')
        expect(response.collectionAddress).toBe('EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN')
        expect(response.ownerAddress).toBe('EQCHrl23ZVxzBrx7KpONsc_jIpA4ulA4dB195xLXlrS1dkC7')
    })

    it('should get NFT item metadata', async () => {
        const tvmToken = new TvmTokens({
            chainType: ChainType.TVM,
            chainId: 1, // useless
        })
             const nftItemData = await tvmToken.getNFTItemData('EQC6KV4zs8TJtSZapOrRFmqSkxzpq-oSCoxekQRKElf4nC1I')
             await new Promise(resolve => setTimeout(() => {
                expect(true).toBe(true)
                resolve('avoid rate limit...')
              }, 2000))

        // https://explorer.tonnft.tools/collection/EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN
        expect(nftItemData.contentBlock).not.toBeUndefined()
        if (nftItemData.contentBlock !== undefined && nftItemData.nftItemIndex !== undefined) {
            const response = await tvmToken.getNftMetadata('EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN', nftItemData.nftItemIndex, nftItemData.contentBlock)
            expect(response.contentUri).toBe('https://cloudflare-ipfs.com/ipfs/bafybeicynpxp7phhcwidi2ewigetk5iv2l4qil6koadlpktpjtlub7odsq')
        }
    })


    it('should get NFT item metadata', async () => {
        const tvmToken = new TvmTokens({
            chainType: ChainType.TVM,
            chainId: 1, // useless
        })
        // https://explorer.tonnft.tools/collection/EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN
        const response = await tvmToken.getNFTCollectionMetadata('EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN')

        expect(response.collectionContentUri).toBe('https://cloudflare-ipfs.com/ipfs/QmVq3SWscMKULUsFbHxXriMsiNPYjdU3RSsqzpQdJctJz8?filename=collection_meta.json')
    })
})
