import { atom } from "jotai"
import { atomWithDefault } from "jotai/utils"

const isSSR = typeof window === "undefined"

export const appWindowAtom = atomWithDefault(async () =>
  isSSR ? null : (await import("@tauri-apps/api/window")).appWindow
)

export const maximizedAtom = atom(false)
