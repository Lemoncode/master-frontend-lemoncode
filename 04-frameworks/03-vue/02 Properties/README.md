# 02 Properties

In this sample we are going to learn a basic concept, handling properties.

We will take a startup point sample _01 Hello VueJS_.

Summary steps:

- Update `App.vue` with and input element.
- Use `v-model` directive.
- Create our first component.
- Passing properties from `main.ts` to `hello.ts`.
- Other approach to work with properties.

# Steps to build it

## Prerequisites

You will need to have Node.js installed in your computer. In order to follow this step guides you will also need to take sample _01 Hello VueJS_ as a starting point.

## Steps

- `npm install` to install previous sample dependencies:

```
npm install
```

- Update `App.vue` with an input element:

### ./src/App.vue

```diff
<template>
-  <h1>{{message}}</h1>
+  <div>
+    <h1>{{message}}</h1>
+    <input
+      v-bind:value="message"
+      v-on:input="message = $event.target.value"
+    />
+  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: "Hello from App",
    };
  },
};
</script>

```

- We can use too the shorthands:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
    <input
-      v-bind:value="message"
+      :value="message"
-      v-on:input="message = $event.target.value"
+      @input="message = $event.target.value"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: "Hello from App",
    };
  },
};
</script>

```

- And finally, use method instead of inline function:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
    <input
      :value="message"
-      @input="message = $event.target.value"
+      @input="onChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: "Hello from App",
    };
  },
+ methods: {
+   onChange(event) {
+     this.message = event.target.value;
+   },
+ },
};
</script>

```

> Reference: [_Don't use arrow functions_](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks)

- Using syntactic sugar `v-model`:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
    <input
-       :value="message"
-       @input="onChange"
+       v-model="message"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: "Hello from App",
    };
  },
- methods: {
-   onChange(event) {
-     this.message = event.target.value;
-   },
- },
};
</script>

```

- Create a child component `Hello.vue`:

### ./src/Hello.vue

```vue
<template>
  <input v-model="message" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloComponent',
  props: {
    message: String,
  },
});
</script>
```

- Update `App.vue`:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
-    <input
-     v-model="message"
+    <hello-component
+     :message="message"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
+ import HelloComponent from './Hello.vue';

export default Vue.extend({
  name: 'App',
+ components: {
+   HelloComponent,
+ },
  data() {
    return {
      message: "Hello from App"
    };
  },
});
</script>

```

- Since we are using `v-model` in `HelloComponent` we are mutating `value` prop and it's forbidden. To solve this:

### ./src/Hello.vue

```diff
<template>
  <input
-   v-model="message"
+   :value="message"
+   @input="onChange"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloComponent',
  props: {
    message: String,
+   onChange: Function,
  },
});
</script>

```

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
    <hello-component
      :message="message"
+     :on-change="onChange"
    />
  </div>
</template>

<script>
import HelloComponent from './Hello.vue';

export default {
  name: 'App',
  components: {
    HelloComponent,
  },
  data() {
    return {
      message: "Hello from App"
    };
  },
+ methods: {
+   onChange(event) {
+     this.message = event.target.value;
+   },
+ },
};
</script>

```

- Other approach:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
    <hello-component
-       :message="message"
-       :on-change="onChange"
+       v-model="message"
    />
  </div>
</template>

<script>
import HelloComponent from './Hello.vue';

export default {
  name: 'App',
  components: {
    HelloComponent,
  },
  data() {
    return {
      message: "Hello from App"
    };
  },
- methods: {
-   onChange(event) {
-     this.message = event.target.value;
-   },
- },
};
</script>

```

### ./src/Hello.vue

```diff
<template>
  <input
-   :value="message"
+   :value="value"
    @input="onChange"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloComponent',
  props: {
-   message: String,
-   onChange: Function
+   value: String,
  },
+ methods: {
+   onChange(event) {
+     this.$emit('input', event.target.value);
+   },
+ },
});
</script>

```

> [`v-model` directive](https://vuejs.org/v2/api/#v-model)

> [Props types](https://vuejs.org/v2/guide/components.html#Prop-Validation)

- Execute the sample:

```
npm start
```

# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us.
