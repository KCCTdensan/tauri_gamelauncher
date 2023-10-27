import { useAtomValue, useSetAtom } from "jotai/react";
import { appWindowAtom, maximizedAtom } from "./atoms";
import { useEffect } from "react";

export function useAppWindow() {
  return useAtomValue(appWindowAtom)
}

export function useMaximized() {
  return useAtomValue(maximizedAtom)
}

export function useWindowEvent() {
  const setMaximized = useSetAtom(maximizedAtom)
  const appWindow = useAppWindow()
  useEffect(() => {
    if(!appWindow) return;
    appWindow.isMaximized().then(setMaximized)
    // unlisten
    const unlistens = Promise.all([
      appWindow.onResized(async () => {
        setMaximized(await appWindow.isMaximized())
      })
    ])
    return () => {
      unlistens.then(a => a.forEach(f => f()))
    }
  }, [appWindow, setMaximized])
}
