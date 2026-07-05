<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Form + Server Action pattern

`useActionState` is **broken** with RHF — it can't handle `redirect()` from Server Actions because the wrapper swallows the redirect response, and calling `formAction` manually outside a transition triggers a React error.

**Correct pattern** — use `useTransition` + direct Server Action call + manual error state:

```tsx
const [serverError, setServerError] = useState<string | null>(null);
const [isPending, startTransition] = useTransition();

const form = useForm<Input>({ resolver: zodResolver(schema) });

const onSubmit = form.handleSubmit((data) => {
  setServerError(null);
  startTransition(async () => {
    const fd = new FormData();
    fd.set("field", data.field);
    const result = await serverAction(fd);
    if (result?.error) setServerError(result.error);
  });
});

// In JSX: <form onSubmit={onSubmit}> and <Button disabled={isPending}>
```

- `redirect()` in the Server Action navigates away naturally
- Errors come back as `{ error }` objects — set manually via `useState`
- Button uses `isPending` for loading state
