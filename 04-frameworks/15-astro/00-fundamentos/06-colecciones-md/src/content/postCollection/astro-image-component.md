---
title: "Astro Image component - Complete Guide"
description: "Complete guide to Astro's Image component: automatic optimization, lazy loading, and best practices for web images."
image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"
---

Astro's Image component is a powerful tool for automatically optimizing images on your website, significantly improving performance and user experience.

Astro's Image component is a powerful tool for automatically optimizing images on your website, significantly improving performance and user experience.

## Main Features

- **Automatic optimization**: Converts images to modern formats like WebP and AVIF
- **Lazy loading**: Loads images only when needed
- **Responsive images**: Automatically generates multiple sizes
- **Type safety**: Path validation at compile time

## Basic Usage

```astro
---
import { Image } from "astro:assets";
import heroImage from "../assets/hero.jpg";
---

<Image
  src={heroImage}
  alt="Article hero image"
  width={800}
  height={400}
  format="webp"
/>
```

## Remote Images

For images that are not in your project:

```astro
<Image
  src="https://picsum.photos/800/400"
  alt="Remote image"
  width={800}
  height={400}
  inferSize
/>
```

## Advanced Optimizations

### Multiple Formats

```astro
<Image
  src={heroImage}
  alt="Hero"
  formats={["webp", "avif", "jpeg"]}
  fallbackFormat="jpeg"
/>
```

[Official Documentation](https://docs.astro.build/en/guides/images/)

### Responsive Design

```astro
<Image
  src={heroImage}
  alt="Hero"
  widths={[400, 800, 1200]}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
/>
```

## Best Practices

1. **Always include alt text** for accessibility
2. **Specify width and height** to avoid layout shift
3. **Use lazy loading** for images below the fold
4. **Optimize format** based on image content

## Performance Tips

- WebP for general photographs
- AVIF for maximum compression
- PNG for images with transparency
- SVG for icons and simple illustrations

Astro's Image component makes image optimization automatic and efficient, allowing you to focus on creating exceptional content.