import { Prompt, type PromptRef } from "@tui/component/prompt"
import { createMemo, Match, onMount, Show, Switch, type ParentProps } from "solid-js"
import { useTheme } from "@tui/context/theme"
import { useKeybind } from "../context/keybind"
import type { KeybindsConfig } from "@as-agent/sdk"
import { Logo } from "../component/logo"
import { Locale } from "@/util/locale"
import { useSync } from "../context/sync"
import { Toast } from "../ui/toast"
import { useArgs } from "../context/args"
import { createSignal, onCleanup } from "solid-js"
import { useRenderer } from "@opentui/solid"
import fs from "fs/promises"
import path from "path"

// TODO: what is the best way to do this?
let once = false

export function Home() {
  const sync = useSync()
  const { theme } = useTheme()
  const mcpError = createMemo(() => {
    return Object.values(sync.data.mcp).some((x) => x.status === "failed")
  })

  const Hint = (
    <Show when={Object.keys(sync.data.mcp).length > 0}>
      <box flexShrink={0} flexDirection="row" gap={1}>
        <text fg={theme.text}>
          <Switch>
            <Match when={mcpError()}>
              <span style={{ fg: theme.error }}>•</span> mcp errors{" "}
              <span style={{ fg: theme.textMuted }}>ctrl+x s</span>
            </Match>
            <Match when={true}>
              <span style={{ fg: theme.success }}>•</span>{" "}
              {Locale.pluralize(Object.values(sync.data.mcp).length, "{} mcp server", "{} mcp servers")}
            </Match>
          </Switch>
        </text>
      </box>
    </Show>
  )

  let prompt: PromptRef
  const args = useArgs()
  onMount(() => {
    if (once) return
    if (args.prompt) {
      prompt.set({ input: args.prompt, parts: [] })
      once = true
    }
  })

  return (
    <box flexGrow={1} justifyContent="center" alignItems="center" paddingLeft={2} paddingRight={2} gap={1}>
      <Logo />
      <box width={39}>
        <HelpRow keybind="command_list">Commands</HelpRow>
        <HelpRow keybind="session_list">List sessions</HelpRow>
        <HelpRow keybind="model_list">Switch model</HelpRow>
        <HelpRow keybind="agent_cycle">Switch agent</HelpRow>
      </box>
      <box width="100%" maxWidth={75} zIndex={1000} paddingTop={1}>
        <Prompt ref={(r) => (prompt = r)} hint={Hint} />
      </box>
      <MarkdownSection />
      <Toast />
    </box>
  )
}

function HelpRow(props: ParentProps<{ keybind: keyof KeybindsConfig }>) {
  const keybind = useKeybind()
  const { theme } = useTheme()
  return (
    <box flexDirection="row" justifyContent="space-between" width="100%">
      <text fg={theme.text}>{props.children}</text>
      <text fg={theme.primary}>{keybind.print(props.keybind)}</text>
    </box>
  )
}

function MarkdownSection() {
  const { theme } = useTheme()
  const [content, setContent] = createSignal("")
  const [show, setShow] = createSignal(false)
  const renderer = useRenderer()

  onMount(async () => {
    try {
      const agentsPath = path.join(process.cwd(), "AGENTS.md")
      const fileExists = await fs.access(agentsPath).then(() => true).catch(() => false)
      
      if (fileExists) {
        const data = await fs.readFile(agentsPath, "utf-8")
        setContent(data)
        setShow(true)
      }
    } catch (error) {
      // Silently fail if file doesn't exist or can't be read
    }
  })

  onCleanup(() => {
    setShow(false)
  })

  return (
    <Show when={show() && content()}>
      <box width="100%" maxWidth={75} marginTop={1}>
        <box 
          flexDirection="row" 
          justifyContent="space-between" 
          marginBottom={1}
          backgroundColor={theme.backgroundPanel}
          paddingLeft={1}
          paddingRight={1}
        >
          <text fg={theme.text} attributes={{ bold: true }}>Project Guide</text>
          <text fg={theme.textMuted}>ESC to close</text>
        </box>
        <box 
          backgroundColor={theme.backgroundPanel}
          borderStyle="round"
          borderColor={theme.border}
          height={12}
          width="100%"
          maxWidth={75}
        >
          <code
            filetype="markdown"
            drawUnstyledText={false}
            streaming={false}
            syntaxStyle={renderer.getPalette({
              size: 16,
            }).then((colors) => {
              if (!colors.palette[0]) return
              const bg = colors.defaultBackground ?? colors.palette[0]!
              const fg = colors.defaultForeground ?? colors.palette[7]!
              return {
                "comment": { fg: bg, italic: true },
                "keyword": { fg: fg, bold: true },
                "string": { fg: fg },
                "number": { fg: fg },
                "function": { fg: fg },
                "variable": { fg: fg },
                "type": { fg: fg, bold: true },
                "operator": { fg: fg },
                "punctuation": { fg: fg },
              }
            })}
            content={content()}
            conceal={[]}
            fg={theme.text}
          />
        </box>
      </box>
    </Show>
  )
}
