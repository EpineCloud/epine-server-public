import { SessionCrypto } from '@tonconnect/protocol'
import { TonPublicKeyAuthentication } from './tonPublicKeyAuthentication'

describe('Public key authentication', () => {
    for (let i = 0; i < 10; i++) {
        it('should generate a matching signature', () => {
            const sessionCrypto = new SessionCrypto()
            const tonPBAuthentication = new TonPublicKeyAuthentication(sessionCrypto.stringifyKeypair())
            const originalNonce = tonPBAuthentication.generateNonce()
            console.log('original nonce: ', originalNonce)

            const signedMessage = tonPBAuthentication.signMessage(originalNonce)
            const verifiedSignature = tonPBAuthentication.verifySignature(signedMessage)
            console.log(`verified signature output: ${originalNonce}`)

            expect(originalNonce).toBe(verifiedSignature)
        })
    }

    for (let i = 0; i < 10; i++) {
        it('should generate a different signature due to mismatching nonces', () => {
            const sessionCrypto = new SessionCrypto()
            const tonPBAuthentication = new TonPublicKeyAuthentication(sessionCrypto.stringifyKeypair())
            const originalNonce = tonPBAuthentication.generateNonce()
            console.log(`original nonce: ${originalNonce}`)

            const mismatchedNonce = tonPBAuthentication.generateNonce()
            const mismatchedSignedMessage = tonPBAuthentication.signMessage(mismatchedNonce)

            const verifiedSignature = tonPBAuthentication.verifySignature(mismatchedSignedMessage)
            console.log(`verified signature output: ${originalNonce}`)

            expect(originalNonce).not.toBe(verifiedSignature)
        })
     }
})
