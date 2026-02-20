# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/heroui-inc/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/vite-template/blob/main/LICENSE).
"# StreamX" 

## Deploy to GitHub Pages

1. Ensure `homepage` is set in `package.json` to your repo URL, for example:

```json
"homepage": "https://<your-username>.github.io/<repo-name>/"
```

2. For Vite, set `base` in `vite.config.ts` to `"./"` to use relative asset paths when publishing to GitHub Pages:

```ts
export default defineConfig({
	base: "./",
	// ...
})
```

3. If your app uses client-side routing, use `HashRouter` (from `react-router-dom`) to avoid 404s on refresh, or keep `BrowserRouter` and add a `404.html` that redirects to `index.html`.

4. Install `gh-pages` and add scripts to `package.json` (this project already includes them):

```json
"scripts": {
	"predeploy": "npm run build",
	"deploy": "gh-pages -d dist"
}
```

5. Deploy:

```bash
npm run deploy
```

6. Verify your site at the `homepage` URL. If you see missing assets, rebuild and ensure `base` is set to `"./"` or to the repo path (e.g. `/repo-name/`).

Notes:
- `HashRouter` provides simpler static hosting compatibility.
- Using relative `base` avoids absolute `/` asset 404s on GitHub Pages.
