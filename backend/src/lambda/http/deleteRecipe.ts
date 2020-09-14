import 'source-map-support/register'
import { getUserId } from '../utils'
import { deleteRecipe } from '../../businessLogic/recipes'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId
  const userId = getUserId(event)

  const item = await deleteRecipe(recipeId, userId)
  logger.info('Recipe was deleted', item)
  
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
