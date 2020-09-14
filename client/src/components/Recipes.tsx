import dateFormat from 'dateformat'
import { History } from 'history'
// import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  // Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form,
  TextArea
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes, patchRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'

interface RecipesProps {
  auth: Auth
  history: History
}

interface RecipesState {
  recipes: Recipe[]
  newRecipeName: string
  newRecipeDecription: string
  loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<RecipesProps, RecipesState> {
  state: RecipesState = {
    recipes: [],
    newRecipeName: '',
    newRecipeDecription: '',
    loadingRecipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeName: event.target.value })
  }


  handleDescriptionChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ newRecipeDecription: event.currentTarget.value })
    console.log("How to cook:\n", this.state.newRecipeDecription)
  }

  onEditButtonClick = (recipeId: string) => {
    this.props.history.push(`/recipes/${recipeId}/edit`)
  }

  onRecipeCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
        name: this.state.newRecipeName,
        description: this.state.newRecipeDecription,
        dueDate
      })
      this.setState({
        recipes: [...this.state.recipes, newRecipe],
        newRecipeName: ''
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  // onRecipeCheck = async (pos: number) => {
  //   try {
  //     const recipe = this.state.recipes[pos]
  //     await patchRecipe(this.props.auth.getIdToken(), recipe.recipeId, {
  //       name: recipe.name,
  //       description: recipe.description,
  //       dueDate: recipe.dueDate,
  //       done: !recipe.done
  //     })
  //     this.setState({
  //       recipes: update(this.state.recipes, {
  //         [pos]: { done: { $set: !recipe.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Recipe deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipes,
        loadingRecipes: false
      })
    } catch (e) {
      alert(`Failed to fetch recipes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h2">Recipes</Header>

        {this.renderCreateRecipeInput()}
        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'pink',
              labelPosition: 'left',
              icon: 'add',
              content: 'New recipe',
              onClick: this.onRecipeCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Recipe title"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Form>
            <TextArea
              placeholder="Recipe decription"
              onChange={this.handleDescriptionChange}
            />
          </Form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Grid padded>
        {this.state.recipes.map((recipe, pos) => {
          return (
            <Grid.Row key={recipe.recipeId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onRecipeCheck(pos)}
                  checked={recipe.done}
                />
              </Grid.Column> */}
              <Grid.Column width={12} verticalAlign="middle">
                <h3>{recipe.name}</h3>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {recipe.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="pink"
                  onClick={() => this.onEditButtonClick(recipe.recipeId)}
                >
                  <Icon name="camera" />
                </Button>
              </Grid.Column>
              {/* <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRecipeDelete(recipe.recipeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column> */}
              <Grid.Column width={5}>
                {recipe.attachmentUrl && (
                  <Image src={recipe.attachmentUrl} size="medium" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={8}>
                {recipe.description}
              </Grid.Column>
              
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
