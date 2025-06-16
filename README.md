# Manga App

**Manga App** is an online manga reading website that allows users to discover, search, and read their favorite manga series with a modern interface, fast loading speed, and smooth experience.

## Main Features

- View the list of newly updated manga
- Search manga by title or genre
- View manga details and chapter list
- Read manga with an interface optimized for both desktop and mobile
- [x] Apply **Upstash** for caching API responses
- [x] Integrate **Swagger** for API documentation

## API Endpoints

| Method   | Endpoint                        | Description                        |
|----------|---------------------------------|------------------------------------|
| `GET`    | `/api/manga`                    | Get the list of manga              |
| `GET`    | `/api/manga/:id`                | Get manga details                  |
| `GET`    | `/api/manga/:id/chapters`       | Get the list of chapters for manga |
| `GET`    | `/api/chapter/:id`              | Get chapter content                |
| `GET`    | `/api/search?q=keyword`         | Search manga by keyword            |

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploying on Vercel

You can easily deploy the app on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See more in the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
