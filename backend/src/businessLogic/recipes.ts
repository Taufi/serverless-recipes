import * as uuid from 'uuid'

import { RecipeItem } from '../models/RecipeItem'

import { RecipeAccess } from '../dataLayer/recipesAccess'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest'

const recipeAccess = new RecipeAccess()

export async function getAllRecipes(userId: string): Promise<RecipeItem[]> {
    return recipeAccess.getAllRecipes(userId)
}

export async function createRecipe( createRecipeRequest: CreateRecipeRequest, userId: string): Promise<RecipeItem> {
    const recipeId = uuid.v4()

    return await recipeAccess.createRecipe({
        recipeId: recipeId,
        userId: userId,
        name: createRecipeRequest.name,
        description: createRecipeRequest.description,
        dueDate: createRecipeRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false
    })
}

export async function upDateRecipe(updateRecipeRequest: UpdateRecipeRequest, recipeId: string, userId: string): Promise<RecipeItem> {

    return await recipeAccess.updateRecipe({
        recipeId: recipeId,
        userId: userId,
        name: updateRecipeRequest.name,
        description: updateRecipeRequest.description,
        dueDate: updateRecipeRequest.dueDate,
        done: updateRecipeRequest.done
    })
}

export async function updateAttachmentUrl(recipeId: string, userId: string, attachmentUrl: string): Promise<RecipeItem> {
    return await recipeAccess.updateAttachmentUrl({
        recipeId: recipeId,
        userId: userId,
        attachmentUrl: attachmentUrl
    })
}


export async function deleteRecipe(recipeId: string, userId: string): Promise<RecipeItem> {

    return await recipeAccess.deleteRecipe({
        recipeId: recipeId,
        userId: userId
    })
}