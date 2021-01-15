import { Recipe } from '../../model';

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Omelette',
    description: `
     1. For a basic omelette, crack the eggs into a mixing bowl with a pinch of sea salt and black pepper. Beat well with a fork.
     2. Heat a small knob of butter in a small frying pan on a low heat, and once melted and bubbling, add the eggs and move the pan around to spread them out evenly.
     3. When the omelette begins to cook and firm up, but still has a little raw egg on top, sprinkle over the cheese (if using).
     4. Using a spatula, ease around the edges of the omelette, then fold it over in half. When it starts to turn golden brown underneath, remove the pan from the heat and slide the omelette on to a plate.
    `,
    ingredients: ['2 eggs', 'cheese', 'salt', 'black pepper'],
  },
  {
    id: 2,
    name: 'Salad with tomatoes',
    description: `
     1. Combine salad, tomatoes, avocados, garlic and onion in a large bowl.
     2. Sprinkle with lemon juice, and season with salt and pepper.
     3. Garnish salad with thin lemon slices.
    `,
    ingredients: [
      'salad',
      '2 tomatoes',
      '2 avocados',
      '1 tooth garlic',
      '1 onion',
      'lemon juice',
      'salt',
      'pepper',
    ],
  },
  {
    id: 3,
    name: 'Spaghetti with tomato sauce',
    description: `
     1. Brown beef over medium heat. Drain off fat.
     2. In a large pot, combine beef, salt, oregano, pepper, garlic powder, onion flakes, diced tomatoes, tomato sauce, and mushrooms. Simmer at a low heat setting for 2 hours, stirring occasionally
     3. Cook pasta according to package directions. Drain. Serve sauce over spaghetti.
    `,
    ingredients: [
      'spaghetti',
      '1 beef',
      '1/4 teaspoon garlic powder',
      '1 onion',
      '3 tomatoes',
      '4 mushrooms',
      'oregano',
      'salt',
    ],
  },
];
