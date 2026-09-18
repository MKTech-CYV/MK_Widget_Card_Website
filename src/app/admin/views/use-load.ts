"use client";

import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "./format";

// Runs an async loader whenever `key` changes (or reload() is called) and
// exposes { data, error, loading }. State is only set from the promise
// callbacks, so the effect never triggers a synchronous re-render.
export function useLoad<T>(key: string, loader: () => Promise<T>) {
  const [state, setState] = useState<{
    id: string;
    data?: T;
    error?: string;
  }>({ id: "" });
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  });

  const id = `${key}:${tick}`;

  useEffect(() => {
    let cancelled = false;

    loaderRef
      .current()
      .then((data) => {
        if (!cancelled) {
          setState({ id, data });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ id, error: getErrorMessage(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = state.id !== id;

  return {
    data: loading ? undefined : state.data,
    error: loading ? undefined : state.error,
    loading,
    reload: () => setTick((value) => value + 1),
  };
}
