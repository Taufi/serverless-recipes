export interface RecipeItem {
  userId: string
  recipeId: string
  createdAt: string
  name: string
  description: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
