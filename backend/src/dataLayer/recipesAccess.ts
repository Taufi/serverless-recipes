import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { RecipeItem } from '../models/RecipeItem'

import { createLogger } from '../utils/logger'

const logger = createLogger('auth')

export class RecipeAccess {
    
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly recipesTable = process.env.RECIPES_TABLE) {
        }

    async getAllRecipes(userid: string): Promise<RecipeItem[]> {
        logger.info('Get all recipe items')

        const result = await this.docClient.query({
            TableName: this.recipesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userid
            }
        }).promise()

        const items = result.Items
        return items as RecipeItem[]
    }

    async createRecipe(recipeItem: RecipeItem): Promise<RecipeItem> {
        logger.info('Create recipe item')
        await this.docClient.put({
            TableName: this.recipesTable,
            Item: recipeItem
        }).promise()

        return recipeItem
    }

    async updateRecipe(updatedRecipe: any): Promise<RecipeItem> {
        logger.info('Update recipe item')
        await this.docClient.update({
            TableName: this.recipesTable,
            Key: {
                userId: updatedRecipe.userId,
                recipeId: updatedRecipe.recipeId
            },
            ExpressionAttributeNames: {"#n": "name"},
            UpdateExpression: "set dueDate = :dueDate,  done = :done, #n = :name, description = :description",
            ExpressionAttributeValues:{
                ":name":updatedRecipe.name,
                ":description":updatedRecipe.description,
                ":dueDate":updatedRecipe.dueDate,
                ":done":updatedRecipe.done
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()

        return updatedRecipe
    }

    async updateAttachmentUrl(updatedRecipe: any): Promise<RecipeItem> {
        logger.info('Update attachment url')
        await this.docClient.update({
            TableName: this.recipesTable,
            Key: {
                userId: updatedRecipe.userId,
                recipeId: updatedRecipe.recipeId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
                ":attachmentUrl":updatedRecipe.attachmentUrl
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()

        return updatedRecipe
    }

    async deleteRecipe(deletedRecipe: any): Promise<RecipeItem> {
        logger.info('Delete recipe item')
        await this.docClient.delete({
            TableName: this.recipesTable,
            Key: {
                userId: deletedRecipe.userId,
                recipeId: deletedRecipe.recipeId
            }
        }).promise()

        return deletedRecipe
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Build new dynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new AWS.DynamoDB.DocumentClient()
}