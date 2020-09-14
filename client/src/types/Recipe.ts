export interface Recipe {
  recipeId: string
  description: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
