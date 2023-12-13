# ShadowRoot Styling

## Introduction `:host`

The `:host` CSS pseudo-class selects the shadow host of the shadow DOM containing the CSS it is used inside — in other words, this allows you to select a custom element from inside its shadow DOM.

> Note: This has no effect when used outside a shadow DOM.

## Step by step

### 1. Update `style.css`

```css
.container input {
  width: 800px;
}
/* diff */
:host {
  background-color: #bbb;
}
/* diff */
```

We can notice that is not taking any effect since is used **OUTSIDE** the Shadow DOM.

### 2. Update `index.html`

```html
<template id="searchbar-template">
  <style>
    .container {
      position: relative;
      padding: 0;
      margin: 0;
      border: 0;
      width: 150px;
      height: 30px;
    }

    .field {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }

    .icons-container {
      position: absolute;
      top: 5px;
      right: -10px;
      width: 30px;
      height: 30px;
    }

    .icon-search {
      position: relative;
      width: 50%;
      height: 50%;
      opacity: 1;
      border-radius: 50%;
      border: 3px solid #c7d0f8;
    }

    .icon-search:after {
      content: "";
      position: absolute;
      bottom: -9px;
      right: -2px;
      width: 4px;
      border-radius: 3px;
      transform: rotate(-45deg);
      height: 10px;
      background-color: #c7d0f8;
    }
    /* diff */
    :host_ {
      /* afecta a todas las etiquetas search-bar */
      background-color: #aaa;
    }

    :host_(#searchbar2) {
      /* afecta a todas la etiquetas search-bar que cumplan el selector indicado entre paréntesis */
      background-color: #bbb;
    }

    :host_ input {
      /* afecta a los inputs de dentro. Hubiera sido lo mismo poner solamente input sin :host */
      background-color: #ccc;
    }

    :host_(.ddd) input {
      /* afecta a los inputs de dentro si el host cumple el selector indicado */
      background-color: #ddd;
    }

    :host-context_(.dark-theme) input {
      /* afecta a los input de dentro si fuera existe algo con .dark-theme */
      color: #fff;
      background-color: #000;
    }
    /*diff*/
  </style>
  <input type="text" placeholder="Search..." class="field" />
  <div class="icons-container">
    <slot name="searchbar-icon-slot">
      <div class="icon-search"></div>
    </slot>
  </div>
</template>
```

```css
.container {
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;
  width: 150px;
  height: 30px;
}

.field {
  width: 100%;
  height: 100%;
  border-radius: 3px;
}

.icons-container {
  position: absolute;
  top: 5px;
  right: -10px;
  width: 30px;
  height: 30px;
}

.icon-search {
  position: relative;
  width: 50%;
  height: 50%;
  opacity: 1;
  border-radius: 50%;
  border: 3px solid #c7d0f8;
}

.icon-search:after {
  content: "";
  position: absolute;
  bottom: -9px;
  right: -2px;
  width: 4px;
  border-radius: 3px;
  transform: rotate(-45deg);
  height: 10px;
  background-color: #c7d0f8;
}

:host {
  /* afecta a todas las etiquetas search-bar */
  background-color: #aaa;
}

:host(#searchbar2) {
  /* afecta a todas la etiquetas search-bar que cumplan el selector indicado entre paréntesis */
  background-color: #bbb;
}

:host input {
  /* afecta a los inputs de dentro. Hubiera sido lo mismo poner solamente input sin :host */
  background-color: #ccc;
}

:host(.ddd) input {
  /* afecta a los inputs de dentro si el host cumple el selector indicado */
  background-color: #ddd;
}

:host-context(.dark-theme) input {
  /* afecta a los input de dentro si fuera existe algo con .dark-theme */
  color: #fff;
  background-color: #000;
}
```

## References

- https://stackoverflow.com/questions/50999753/host-selector-not-working-for-custom-element-having-shadow-dom