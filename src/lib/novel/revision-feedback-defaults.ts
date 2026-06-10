import type { NovelRevisionFeedback } from "./revision-feedback"

export function createDefaultRevisionFeedback(): NovelRevisionFeedback {
  return {
    mustFix: [],
    shouldImprove: [],
    carryToNextChapter: [],
  }
}
