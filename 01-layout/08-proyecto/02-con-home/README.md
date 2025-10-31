# Contact Page

Vamos a añadir los estilos necesarios para la página de contacto.

## 1. Añadimos el componente social-card

_css/components/social-card.css_

```css
@import '../utilities/mixins.css';
@import '../base/media.css';

.social-card {
  height: 100%;
  padding: var(--space-md);
  background-color: var(--card-accent);
  transition: all 0.3s ease;
  color: var(--text-contrast);

  @media (--small-viewport) {
    padding: var(--space-xl);
  }

  @mixin hover {
    border-color: var(--accent-color);
    transform: translateY(5px);
    box-shadow: var(--shadow-card);
    .social-card__icon {
      transform: scale(1.1);
    }
  }

  &__header {
    margin-bottom: var(--space-lg);
    display: flex;
    justify-content: space-between;
  }

  &__icon {
    font-size: var(--fs-lg);
    color: var(--card-accent);
    transition: all 0.3s ease;
    background-color: var(--text-contrast);
    padding: var(--space-sm);
  }

  &__title {
    color: inherit;
    font-size: var(--fs-lg);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  &__handle {
    font-weight: 600;
    font-size: var(--fs-md);
  }
}
```

Y lo importamos en pages/contact.css.

```css
@import '../components/social-card.css';
```

## 2. Estilos de la página de contacto

A continuacion, añadimos los estilos específicos para la página de contacto.
_css/pages/contact.css_

```css
@import '../base/media.css';

.contact {
  padding-top: var(--padding-section);
  padding-bottom: var(--padding-section);

  &__header {
    max-width: 52ch;
    margin-bottom: var(--space-big-1);

    @media (--small-viewport) {
      margin-bottom: var(--space-big-4);
    }
  }
  &__title {
    font-size: var(--fs-3xl);
    margin-bottom: var(--space-md);
    text-transform: uppercase;
    color: var(--text-90);
  }
  &__description {
    color: var(--text-90);
    font-size: var(--fs-md);
    line-height: 1.6;
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    margin-bottom: var(--space-big-2);
    @media (--large-viewport) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__link--twitter {
    --card-accent: var(--accent-color-one);
    --shadow-card: 0 4px 12px hsl(from var(--card-accent) h s l / 0.5);
  }

  &__link--instagram {
    --card-accent: var(--accent-color-two);
    --shadow-card: 0 4px 12px hsl(from var(--card-accent) h s l / 0.5);
  }

  &__link--linkedin {
    --card-accent: var(--accent-color-four);
    --shadow-card: 0 4px 12px hsl(from var(--card-accent) h s l / 0.5);
  }

  &__link--email {
    --card-accent: var(--accent-color-three);
    --shadow-card: 0 4px 12px hsl(from var(--card-accent) h s l / 0.5);
  }

  &__cta {
    width: 100%;
    display: inline-block;
    padding: var(--space-md);
    border: 3px solid var(--border-color);
    margin-bottom: var(--space-lg);
    @media (--small-viewport) {
      padding: var(--space-xl);
    }

    &-title {
      font-size: var(--fs-lg);
      margin-bottom: var(--space-md);
    }
  }
}
```

Y con esto ya tendríamos los estilos completos para la página de contacto, y completaríamos el proyecto.
