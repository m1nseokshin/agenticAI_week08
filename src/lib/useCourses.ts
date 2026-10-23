import { useEffect, useState } from "react";
import { loadCourses, type LoadResult } from "./sheet";

export type CoursesState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; result: LoadResult };

export function useCourses(): CoursesState {
  const [state, setState] = useState<CoursesState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadCourses().then(
      (result) => !cancelled && setState({ status: "ready", result }),
      (error) =>
        !cancelled &&
        setState({ status: "error", message: error instanceof Error ? error.message : String(error) }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
