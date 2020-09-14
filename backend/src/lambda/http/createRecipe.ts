import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'
import { createRecipe } from '../../businessLogic/recipes'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newRecipe: CreateRecipeRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    
    const item = await createRecipe(newRecipe, userId)
    
    logger.info('Recipe was created', item)

  return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          item
      })
  }
}
