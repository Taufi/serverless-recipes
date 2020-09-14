import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { getUserId } from '../utils'
import { upDateRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId
  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const item = await upDateRecipe(updatedRecipe,recipeId, userId)
  logger.info('Recipe was updated', item)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        item
    })
  }
}
