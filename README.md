# AI Harness Lab

Static companion site for the Performics Labs article "The Deterministic Core:
Algorithms and Data Structures That Make Marketing Agents Fast, Safe, and
Scalable."

The app visualises article-specific examples for:

- Binary search
- BFS
- DFS
- Rabin-Karp
- Heap top-K
- Topological sort
- Bloom filter
- Circular buffer
- Dijkstra
- Union-Find

## Local preview

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Vercel

This is a dependency-free static site. Deploy the directory as-is. `vercel.json`
adds a fallback rewrite so direct links keep loading the app.
