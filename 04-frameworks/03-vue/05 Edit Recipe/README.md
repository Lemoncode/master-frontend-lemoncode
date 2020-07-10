# 05 Edit Recipe

In this sample we are going to create a `edit recipe` page.

We will take a startup point sample _04 Recipe List_.

Summary steps:

- Create `API` methods.
- Create `pageContainer`.
- Update `page`.
- Create `common` components.
- Create `edit recipe` form.
- Add `form validations` with `lc-form-validation`.

# Steps to build it

## Prerequisites

You will need to have Node.js installed in your computer. In order to follow this step guides you will also need to take sample _04 Recipe List_ as a starting point.

## Steps

- `npm install` to install previous sample dependencies:

```
npm install
```

- Create `API` methods:

### ./src/rest-api/api/recipe/recipe.ts

```diff
import { Recipe } from '../../model';
import { mockRecipes } from './mockData';

+ let recipes = mockRecipes;

export const fetchRecipes = (): Promise<Recipe[]> => {
- return Promise.resolve(mockRecipes);
+ return Promise.resolve(recipes);
};

+ export const fetchRecipeById = (id: number): Promise<Recipe> => {
+   const recipe = recipes.find((r) => r.id === id);
+   return Promise.resolve(recipe as Recipe);
+ };

+ export const save = (recipe: Recipe): Promise<string> => {
+   const index = recipes.findIndex((r) => r.id === recipe.id);

+   return index >= 0 ?
+     saveRecipeByIndex(index, recipe) :
+     Promise.reject('Something was wrong saving recipe :(');
+ };

+ const saveRecipeByIndex = (index: number, recipe: Recipe): Promise<string> => {
+   recipes = [
+     ...recipes.slice(0, index),
+     recipe,
+     ...recipes.slice(index + 1),
+   ];

+   return Promise.resolve('Save recipe success');
+ };

```

- Add `viewModel` and `mappers`:

### ./src/pages/recipe/edit/viewModel.ts

```javascript
export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

export const createEmptyRecipe = (): Recipe => ({
  id: 0,
  name: '',
  description: '',
  ingredients: [],
});
```

### ./src/pages/recipe/edit/mappers.ts

```javascript
import * as model from '../../../rest-api/model';
import * as vm from './viewModel';

export const mapRecipeModelToVm = (recipe: model.Recipe): vm.Recipe => ({
  ...recipe,
});

export const mapRecipeVmToModel = (recipe: vm.Recipe): model.Recipe => ({
  ...recipe,
});
```

### ./src/pages/recipe/edit/formProps.ts

```javascript
import { PropOptions } from 'vue';
import { Recipe } from './viewModel';

export interface FormProps {
  recipe: PropOptions<Recipe>;
  onUpdateRecipe: PropOptions<(field: string, value: string) => void>;
  onSave: PropOptions<() => void>;
}
```

- Create `edit recipe` form:

### ./src/pages/recipe/edit/components/Form.vue

```vue
<template>
  <form>
    <v-container>
      <v-layout row>
        <v-text-field
          label="Name"
          :value="recipe.name"
          :rules="[() => true || 'Test error message']"
          @input="name => onUpdateRecipe('name', name)"
        />
      </v-layout>
      <v-layout row justify-end>
        <v-btn type="button" color="success" @click.prevent="onSave">Save</v-btn>
      </v-layout>
    </v-container>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormProps } from '../formProps';

export default Vue.extend({
  name: 'FormComponent',
  props: {
    recipe: {},
    onUpdateRecipe: {},
    onSave: {},
  } as FormProps,
});
</script>
```

### ./src/pages/recipe/edit/components/index.ts

```javascript
export { default as FormComponent } from './Form.vue';
```

- Update `page`:

### ./src/pages/recipe/edit/Page.vue

```diff
<template>
-  <h1>Edit Recipe Page {{ id }}</h1>
+  <form-component :recipe="recipe" :on-update-recipe="onUpdateRecipe" :on-save="onSave"/>
</template>

<script lang="ts">
import Vue from 'vue';
+ import { FormProps } from "./formProps";
+ import { FormComponent } from './components';

export default Vue.extend({
  name: 'RecipeEditPage',
+ components: { FormComponent },
  props: {
-   id: String,
- },
+   recipe: {},
+   onUpdateRecipe: {},
+   onSave: {},
+ } as FormProps,
});
</script>

```

- Create `PageContainer`:

### ./src/pages/recipe/edit/PageContainer.vue

```vue
<template>
  <recipe-edit-page :recipe="recipe" :on-update-recipe="onUpdateRecipe" :on-save="onSave" />
</template>

<script lang="ts">
import Vue from 'vue';
import { router } from '../../../router';
import { fetchRecipeById, save } from '../../../rest-api/api/recipe';
import { Recipe, createEmptyRecipe } from './viewModel';
import { mapRecipeModelToVm, mapRecipeVmToModel } from './mappers';
import RecipeEditPage from './Page.vue';

export default Vue.extend({
  name: 'RecipeEditPageContainer',
  components: { RecipeEditPage },
  props: { id: String },
  data() {
    return {
      recipe: createEmptyRecipe(),
    };
  },
  beforeMount() {
    const id = Number(this.id || 0);
    fetchRecipeById(id)
      .then(recipe => {
        this.recipe = mapRecipeModelToVm(recipe);
      })
      .catch(error => console.log(error));
  },
  methods: {
    onUpdateRecipe(field: string, value: string) {
      this.recipe = {
        ...this.recipe,
        [field]: value,
      };
    },
    onSave() {
      const recipe = mapRecipeVmToModel(this.recipe);
      save(recipe)
        .then(message => {
          console.log(message);
          this.$router.back();
        })
        .catch(error => console.log(error));
    },
  },
});
</script>
```

- Update `index`:

### ./src/pages/recipe/edit/index.ts

```diff
- export { default as RecipeEditPage } from './Page.vue';
+ export { default as RecipeEditPageContainer } from './PageContainer.vue';

```

- Update `router`:

### ./src/router.ts

```diff
import Router, { RouteConfig } from 'vue-router';
import { LoginPageContainer } from './pages/login';
import { RecipeListPageContainer } from './pages/recipe/list';
- import { RecipeEditPage } from './pages/recipe/edit';
+ import { RecipeEditPageContainer } from './pages/recipe/edit';

const routes: RouteConfig[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPageContainer },
  { path: '/recipe', component: RecipeListPageContainer },
- { path: '/recipe/:id', component: RecipeEditPage, props: true },
+ { path: '/recipe/:id', component: RecipeEditPageContainer, props: true },
];

export const router = new Router({
  routes
});

```

- Create `ingredients` row and list

### ./src/pages/recipe/edit/components/IngredientRow.vue

```vue
<template>
  <v-layout row align-center>
    <v-chip>
      {{ ingredient }}
      <v-icon right @click="() => onRemoveIngredient(ingredient)">close</v-icon>
    </v-chip>
  </v-layout>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';

export default Vue.extend({
  name: 'IngredientRowComponent',
  props: {
    ingredient: String,
    onRemoveIngredient: {} as PropOptions<(ingredient: string) => void>,
  },
});
</script>
```

### ./src/pages/recipe/edit/components/IngredientList.vue

```vue
<template>
  <v-layout row wrap>
    <template v-for="(ingredient, index) in ingredients">
      <ingredient-row-component
        :key="`${ingredient}_${index}`"
        :ingredient="ingredient"
        :on-remove-ingredient="onRemoveIngredient"
      />
    </template>
  </v-layout>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import IngredientRowComponent from './IngredientRow.vue';

export default Vue.extend({
  name: 'IngredientListComponent',
  components: { IngredientRowComponent },
  props: {
    ingredients: {} as PropOptions<string[]>,
    onRemoveIngredient: {} as PropOptions<(ingredient: string) => void>,
  },
});
</script>
```

- Update `edit recipe` form:

### ./src/pages/recipe/edit/components/Form.vue

```diff
<template>
  <form>
    <v-container>
      <v-layout row>
        <v-text-field
          label="Name"
          :value="recipe.name"
          :rules="[() => true || 'Test error message']"
          @input="(name) => onUpdateRecipe('name', name)"
        />
      </v-layout>
+     <v-layout column>
+       <v-text-field
+         label="Ingredients"
+         placeholder="Add ingredient"
+         append-icon="add"
+         :value="ingredient"
+         @input="onUpdateIngredient"
+         @click:append="() => onAddIngredient(ingredient)"
+       />
+       <ingredient-list-component
+         :ingredients="recipe.ingredients"
+         :on-remove-ingredient="onRemoveIngredient"
+       />
+     </v-layout>
      <v-layout row justify-end>
        <v-btn type="button" color="success" @click.prevent="onSave">Save</v-btn>
      </v-layout>
    </v-container>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { FormProps } from "../formProps";
+ import IngredientListComponent from "./IngredientList.vue";

export default Vue.extend({
  name: "FormComponent",
+ components: { IngredientListComponent },
  props: {
    recipe: {},
    onUpdateRecipe: {},
+   onAddIngredient: {},
+   onRemoveIngredient: {},
    onSave: {}
- } as FormProps
+ } as FormProps,
+ data() {
+   return {
+     ingredient: "",
+   };
+ },
+ methods: {
+   onUpdateIngredient(value) {
+     this.ingredient = value;
+   }
+ }
});
</script>

```

- Update `formProps`:

### ./src/pages/recipe/edit/formProps.ts

```diff
import { PropOptions } from 'vue';
import { Recipe } from './viewModel';

export interface FormProps {
  recipe: PropOptions<Recipe>;
  onUpdateRecipe: PropOptions<(field: string, value: string) => void>;
+ onAddIngredient: PropOptions<(ingredient: string) => void>;
+ onRemoveIngredient: PropOptions<(ingredient: string) => void>;
  onSave: PropOptions<() => void>;
}

```

- Update `Page`:

### ./src/pages/recipe/edit/Page.vue

```diff
<template>
- <form-component :recipe="recipe" :on-update-recipe="onUpdateRecipe" :on-save="onSave"/>
+ <form-component
+   :recipe="recipe"
+   :on-update-recipe="onUpdateRecipe"
+   :on-add-ingredient="onAddIngredient"
+   :on-remove-ingredient="onRemoveIngredient"
+   :on-save="onSave"
+ />
</template>

<script lang="ts">
import Vue from "vue";
import { FormProps } from "./formProps";
import { FormComponent } from "./components";

export default Vue.extend({
  name: "RecipeEditPage",
  components: { FormComponent },
  props: {
    recipe: {},
    onUpdateRecipe: {},
+   onAddIngredient: {},
+   onRemoveIngredient: {},
    onSave: {}
  } as FormProps
});
</script>

```

- Update `PageContainer`:

### ./src/pages/recipe/edit/Page.vue

```diff
<template>
- <recipe-edit-page :recipe="recipe" :on-update-recipe="onUpdateRecipe" :on-save="onSave"/>
+ <recipe-edit-page
+   :recipe="recipe"
+   :on-update-recipe="onUpdateRecipe"
+   :on-add-ingredient="onAddIngredient"
+   :on-remove-ingredient="onRemoveIngredient"
+   :on-save="onSave"
+ />
</template>

<script lang="ts">
...
  methods: {
    onUpdateRecipe(field: string, value: string) {
      this.recipe = {
        ...this.recipe,
        [field]: value
      };
    },
+   onAddIngredient(ingredient: string) {
+     this.recipe = {
+       ...this.recipe,
+       ingredients: [...this.recipe.ingredients, ingredient]
+     };
+   },
+   onRemoveIngredient(ingredient: string) {
+     this.recipe = {
+       ...this.recipe,
+       ingredients: this.recipe.ingredients.filter(i => {
+         return i !== ingredient;
+       })
+     };
+   },
...

```

- Update `edit recipe` form to add `description` field:

### ./src/pages/recipe/edit/components/Form.vue

```diff
<template>
  <form>
    <v-container>
      <v-layout row>
        <v-text-field
          label="Name"
          :value="recipe.name"
          :rules="[() => true || 'Test error message']"
          @input="(name) => onUpdateRecipe('name', name)"
        />
      </v-layout>
      <v-layout column>
        <v-text-field
          label="Ingredients"
          placeholder="Add ingredient"
          append-icon="add"
          :value="ingredient"
          @input="onUpdateIngredient"
          @click:append="() => onAddIngredient(ingredient)"
        />
        <ingredient-list-component
          :ingredients="recipe.ingredients"
          :on-remove-ingredient="onRemoveIngredient"
        />
      </v-layout>
+     <v-layout row>
+       <v-textarea
+         placeholder="Description...."
+         rows="10"
+         :value="recipe.description"
+         :no-resize="true"
+         @input="(value) => onUpdateRecipe('description', value)"
+       ></v-textarea>
      </v-layout>
      <v-layout row justify-end>
        <v-btn type="button" color="success" @click.prevent="onSave">Save</v-btn>
      </v-layout>
    </v-container>
  </form>
</template>
...

```

- Create validation `constraints`:

### ./src/pages/recipe/edit/validations.ts

```javascript
import { ValidationConstraints, createFormValidation, Validators } from 'lc-form-validation';

const constraints: ValidationConstraints = {
  fields: {
    name: [{ validator: Validators.required }],
  },
};

export const validations = createFormValidation(constraints);
```

- Create custom `validator`:

### ./src/common/validations/hasItems.ts

```javascript
import { FieldValidationResult } from 'lc-form-validation';

const hasItems = (value: any[]): FieldValidationResult => {
  const isValid = value.length > 0;
  return {
    type: 'ARRAY_HAS_ITEMS',
    succeeded: isValid,
    errorMessage: isValid ? '' : 'Should has one or more ingredients',
  };
};

export { hasItems };
```

- Update `constraints`:

### ./src/pages/recipe/edit/validations.ts

```diff
import { ValidationConstraints, createFormValidation, Validators } from 'lc-form-validation';
+ import { hasItems } from '../../../common/validations/hasItems';

const constraints: ValidationConstraints = {
  fields: {
    name: [
      { validator: Validators.required }
    ],
+   ingredients: [{ validator: hasItems }],
  },
};

export const validations = createFormValidation(constraints);

```

- Create `recipe error` model:

### ./src/pages/recipe/edit/viewModel.ts

```diff
+ import { FieldValidationResult } from 'lc-form-validation';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
}

export const createEmptyRecipe = (): Recipe => ({
  id: 0,
  name: '',
  description: '',
  ingredients: [],
});

+ export interface RecipeError {
+   name: FieldValidationResult;
+   ingredients: FieldValidationResult;
+ };

+ export const createEmptyRecipeError = (): RecipeError => ({
+   name: {
+     key: 'name',
+     succeeded: true,
+     errorMessage: '',
+     type: '',
+   },
+   ingredients: {
+     key: 'ingredients',
+     succeeded: true,
+     errorMessage: '',
+     type: '',
+   },
+ });

```

- Update `pageContainer`:

### ./src/pages/recipe/edit/PageContainer.vue

```diff
<template>
  <recipe-edit-page
    :recipe="recipe"
+   :recipe-error="recipeError"
    :on-update-recipe="onUpdateRecipe"
    :on-add-ingredient="onAddIngredient"
    :on-remove-ingredient="onRemoveIngredient"
    :on-save="onSave"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { router } from "../../../router";
import { fetchRecipeById, save } from "../../../rest-api/api/recipe";
- import { Recipe, createEmptyRecipe } from './viewModel';
+ import {
+   Recipe,
+   createEmptyRecipe,
+   RecipeError,
+   createEmptyRecipeError
+ } from "./viewModel";
import { mapRecipeModelToVm, mapRecipeVmToModel } from "./mappers";
import RecipeEditPage from "./Page.vue";
+ import { validations } from './validations';

export default Vue.extend({
  name: "RecipeEditPageContainer",
  components: { RecipeEditPage },
  props: { id: String },
  data() {
    return {
      recipe: createEmptyRecipe(),
+     recipeError: createEmptyRecipeError(),
    };
  },
  beforeMount() {
    const id = Number(this.id || 0);
    fetchRecipeById(id)
      .then(recipe => {
        this.recipe = mapRecipeModelToVm(recipe);
      })
      .catch(error => console.log(error));
  },
  methods: {
    onUpdateRecipe(field: string, value: string) {
      this.recipe = {
        ...this.recipe,
        [field]: value
      };
+     this.validateRecipeField(field, value);
    },
    onAddIngredient(ingredient: string) {
      this.recipe = {
        ...this.recipe,
        ingredients: [...this.recipe.ingredients, ingredient]
      };
+     this.validateRecipeField('ingredients', this.recipe.ingredients);
    },
    onRemoveIngredient(ingredient: string) {
      this.recipe = {
        ...this.recipe,
        ingredients: this.recipe.ingredients.filter(i => {
          return i !== ingredient;
        })
      };
+     this.validateRecipeField('ingredients', this.recipe.ingredients);
    },
    onSave() {
+     validations.validateForm(this.recipe).then(result => {
+       if (result.succeeded) {
          const recipe = mapRecipeVmToModel(this.recipe);
          save(recipe)
            .then(message => {
              console.log(message);
              this.$router.back();
            })
            .catch(error => console.log(error));
+       } else {
+         this.recipeError = {
+           ...this.recipeError,
+           ...result.fieldErrors
+         };
+       }
      });
    },
+   validateRecipeField(field, value) {
+     validations.validateField(this.recipe, field, value)
+       .then(result => this.updateRecipeError(field, result));
+   },
+   updateRecipeError(field, result) {
+     this.recipeError = {
+       ...this.recipeError,
+       [field]: result,
+     };
+   },
  },
});
</script>

```

- Update `formProps`:

### ./src/pages/recipe/edit/formProps

```diff
import { PropOptions } from 'vue';
- import { Recipe } from './viewModel';
+ import { Recipe, RecipeError } from './viewModel';

export interface FormProps {
  recipe: PropOptions<Recipe>;
+ recipeError: PropOptions<RecipeError>;
  onUpdateRecipe: PropOptions<(field: string, value: string) => void>;
  onAddIngredient: PropOptions<(ingredient: string) => void>;
  onRemoveIngredient: PropOptions<(ingredient: string) => void>;
  onSave: PropOptions<() => void>;
}

```

- Update `page`:

### ./src/pages/recipe/edit/Page.vue

```diff
<template>
  <form-component
    :recipe="recipe"
+   :recipe-error="recipeError"
    :on-update-recipe="onUpdateRecipe"
    :on-add-ingredient="onAddIngredient"
    :on-remove-ingredient="onRemoveIngredient"
    :on-save="onSave"
  />
</template>

....

export default Vue.extend({
  name: "RecipeEditPage",
  components: { FormComponent },
  props: {
    recipe: {},
+   recipeError: {},
    onUpdateRecipe: {},
    onAddIngredient: {},
    onRemoveIngredient: {},
    onSave: {}
  } as FormProps
});
</script>

```

- Update `form`:

### ./src/pages/recipe/edit/components/Form.vue

```diff
<template>
  <form>
    <v-container>
      <v-layout row>
        <v-text-field
          label="Name"
          :value="recipe.name"
-         :rules="[() => true || 'Test error message']"
+         :rules="[resultRecipeError]"
          @input="(name) => onUpdateRecipe('name', name)"
        />
      </v-layout>
      <v-layout column>
        <v-text-field
          label="Ingredients"
          placeholder="Add ingredient"
          append-icon="add"
          :value="ingredient"
          @input="onUpdateIngredient"
          @click:append="() => onAddIngredient(ingredient)"
        />
        <ingredient-list-component
          :ingredients="recipe.ingredients"
          :on-remove-ingredient="onRemoveIngredient"
        />
      </v-layout>
+     <v-alert
+       :value="!recipeError.ingredients.succeeded"
+       color="error"
+       outline
+     >{{recipeError.ingredients.errorMessage}}</v-alert>
      <v-layout row>
        <v-textarea
          placeholder="Description...."
          :value="recipe.description"
          @input="(value) => onUpdateRecipe('description', value)"
          rows="10"
          :no-resize="true"
        ></v-textarea>
      </v-layout>
      <v-layout row justify-end>
        <v-btn type="button" color="success" @click.prevent="onSave">Save</v-btn>
      </v-layout>
    </v-container>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { FormProps } from "../formProps";
import IngredientListComponent from "./IngredientList.vue";

export default Vue.extend({
  name: "FormComponent",
  components: { IngredientListComponent },
  props: {
    recipe: {},
+   recipeError: {},
    onUpdateRecipe: {},
    onAddIngredient: {},
    onRemoveIngredient: {},
    onSave: {}
  } as FormProps,
  data() {
    return {
      ingredient: ""
    };
  },
+  computed: {
+    resultRecipeError(): boolean | string {
+      return this.recipeError.name.succeeded || this.recipeError.name.errorMessage;
+    },
+  },
  methods: {
    onUpdateIngredient(value) {
      this.ingredient = value;
    }
  }
});
</script>

```

- Execute the sample:

```
npm start
```

# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us.
