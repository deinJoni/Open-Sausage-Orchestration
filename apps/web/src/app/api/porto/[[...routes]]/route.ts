import { Route, Router } from 'porto/server'
import * as Contracts from '../contracts'

export const route = Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: process.env.MERCHANT_ADDRESS as `0x${string}`,
    key: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
    sponsor(request) {
      return request.calls.every((call) => call.to === Contracts.l2ResolverAddress)
    },
  }),
)

export const GET = route.fetch
export const OPTIONS = route.fetch
export const POST = route.fetch