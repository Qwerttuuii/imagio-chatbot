import { useEffect, useState } from "react";

/** Throws if a Supabase call returned an error, otherwise returns its data. */
export function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/**
 * Loads data when the page opens (and again when `deps` change or every `intervalMs`).
 * Old data stays on screen while new data loads.
 */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[], intervalMs?: number) {
  const [state, setState] = useState<{ data: T | null; error: string | null }>({ data: null, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setState({ data, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState((s) => ({ ...s, error: e instanceof Error ? e.message : "Something went wrong" }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return {
    data: state.data,
    error: state.error,
    loading: state.data === null && state.error === null,
    reload: () => setTick((t) => t + 1),
  };
}