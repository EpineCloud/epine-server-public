import { hexToByteArray, KeyPair } from '@tonconnect/protocol'
import nacl, { BoxKeyPair, SignKeyPair } from 'tweetnacl'
import crypto from 'crypto'

export class TonPublicKeyAuthentication {
    private readonly boxKeyPair: BoxKeyPair
    private readonly sessionCryptoKeyPair: KeyPair
    private readonly signKeyPair: SignKeyPair
    private readonly signatureNonceLength = 24 // same as SessionCrypto

    constructor(_sessionCryptoKeyPair: KeyPair) {
        this.sessionCryptoKeyPair = _sessionCryptoKeyPair
        this.boxKeyPair = this.convertToBoxKeyPair()
        this.signKeyPair = this.convertToSignKeyPair()
    }

    // **** private methods ****
    private convertToBoxKeyPair(): BoxKeyPair {
        return {
            publicKey: hexToByteArray(this.sessionCryptoKeyPair.publicKey),
            secretKey: hexToByteArray(this.sessionCryptoKeyPair.secretKey),
        }
    }

    private convertToSignKeyPair(): SignKeyPair {
        const seed = nacl.scalarMult(this.boxKeyPair.secretKey, new Uint8Array(32))
        return nacl.sign.keyPair.fromSeed(seed)
    }

    // **** public methods ****

    public generateNonce(): string {
        return crypto.randomBytes(Math.ceil(this.signatureNonceLength / 2))
          .toString('hex')
          .slice(0, this.signatureNonceLength)
    }

    public signMessage(message: string): Uint8Array {
        const messageUint8Array = new TextEncoder().encode(message)
        return nacl.sign(messageUint8Array, this.signKeyPair.secretKey)
    }

    public verifySignature(signature: Uint8Array): string {
        const verifiedMessageUint8 = nacl.sign.open(signature, this.signKeyPair.publicKey)

        if (!verifiedMessageUint8) {
          throw new Error('Signature verification failed: null message')
        }
        return new TextDecoder().decode(verifiedMessageUint8)
    }

    // **** public getters ****

    public getBoxKeyPair(): BoxKeyPair {
        return this.boxKeyPair
    }

    public getSignKeyPair(): SignKeyPair {
        return this.signKeyPair
    }

    public getSessionCryptoKeyPair(): KeyPair {
        return this.sessionCryptoKeyPair
    }
}
