import express, { Application } from 'express'

import { TokensFactory } from './../models/tokens/index'

import { ChainId, ChainType } from '../models/chains/types'

const router = express.Router({ mergeParams: true })

router.get('/tokens/address/:address/balance', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    return res.sendStatus(400)
  }

  const { address } = req.params
  if (!address || typeof address !== 'string') {
    return res.sendStatus(400)
  }

  const {
    chainType = ChainType.EVM,
    chainId,
  } = req.query

  const Tokens = TokensFactory.create({
    chainType: chainType as ChainType,
    chainId: chainId as (ChainId | undefined),
  })

  const balance = await Tokens.getAddressBalance(address)

  res.status(200).send(balance)
})

router.get('/nft/address/:address/data', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    // TODO: add error to response
    return res.sendStatus(400)
  }
  const { address } = req.params
  if (!address || typeof address !== 'string') {
    // TODO: add error to response
    return res.sendStatus(400)
  }

  const {
    chainType = ChainType.TVM,
    chainId = 1,
  } = req.query

  const Tokens = TokensFactory.create({
    chainType: chainType as ChainType,
    chainId: chainId as (ChainId | undefined),
  })

  const balance = await Tokens.getNFTItemData(address)

  res.status(200).send(balance)
})

router.get('/nft/collection/:address/metadata', async (req, res, next) => {
  const { 'x-session-id': sessionId } = req.headers
  if (!sessionId || typeof sessionId !== 'string') {
    // TODO: add error to response
    return res.sendStatus(400)
  }

  const { address } = req.params
  if (!address || typeof address !== 'string') {
    // TODO: add error to response
    return res.sendStatus(400)
  }

  const {
    chainType = ChainType.TVM,
    chainId = 1,
  } = req.query

  const Tokens = TokensFactory.create({
    chainType: chainType as ChainType,
    chainId: chainId as (ChainId | undefined),
  })

  const balance = await Tokens.getNFTCollectionMetadata(address)

  res.status(200).send(balance)
})

export const bindRoutes = (app: Application, prefix: string) => {
  app.use(prefix, router)
}
