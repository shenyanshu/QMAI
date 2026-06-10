import { describe, expect, it } from "vitest"
import { DataSourceRegistry, type DataSource, type ContextLoadContext } from "./context-data-source"
import { revisionFeedbackDataSource } from "./context-data-sources"

const context: ContextLoadContext = {
  projectPath: "E:/Novel",
  task: "生成大纲",
  config: {
    recentSummaryWindow: 8,
    searchTopK: 5,
    snapshotLookback: 3,
    revisionFeedbackWindowConfig: {},
  },
}

describe("DataSourceRegistry", () => {
  it("replaces undefined snapshot payloads with default values", async () => {
    const registry = new DataSourceRegistry()
    const snapshotsSource: DataSource<unknown> = {
      name: "snapshots",
      priority: 1,
      load: async () => undefined,
    }

    registry.register(snapshotsSource)
    const loaded = await registry.loadAll(context)

    expect(loaded.snapshots).toEqual({
      recentSummaries: [],
      previousChapterEnding: "",
      characterStates: "",
      foreshadowingSignals: [],
      timeline: "",
    })
  })

  it("replaces undefined scalar payloads with source defaults", async () => {
    const registry = new DataSourceRegistry()
    registry.register({
      name: "fallbackRecentSummaries",
      priority: 1,
      load: async () => undefined,
    })
    registry.register({
      name: "outline",
      priority: 2,
      load: async () => undefined,
    })

    const loaded = await registry.loadAll(context)

    expect(loaded.fallbackRecentSummaries).toEqual([])
    expect(loaded.outline).toBe("")
  })

  it("replaces missing revision feedback with object-shaped defaults", async () => {
    const registry = new DataSourceRegistry()
    registry.register({
      name: "revisionFeedback",
      priority: 1,
      load: async () => undefined,
    })

    const loaded = await registry.loadAll(context)

    expect(loaded.revisionFeedback).toEqual({
      mustFix: [],
      shouldImprove: [],
      carryToNextChapter: [],
    })
  })

  it("returns object-shaped revision feedback when outline generation has no chapter", async () => {
    await expect(revisionFeedbackDataSource.load(context)).resolves.toEqual({
      mustFix: [],
      shouldImprove: [],
      carryToNextChapter: [],
    })
  })
})
