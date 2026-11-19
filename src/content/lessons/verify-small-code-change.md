---
id: "verify-small-code-change"
title: "Verify a small code change with an agent"
shortTitle: "Verify a small code change"
description: "Give an agent a bounded repair, check the changed behaviour, and record the evidence before accepting the change."
trackId: "ai-engineering"
kind: "principle"
publicationStatus: "published"
format: "Reusable guide"
readingMinutes: 5
updatedAt: "2026-11-10"
objectives:
  - "Describe the repair and the behaviour it must preserve."
  - "Compare what happens before and after the change using a check you trust."
  - "Record what passed and what remains unverified."
publicationIds:
  - "code-agent-playbook"
introduction: "Imagine an internal package installer accepts an empty package identifier. You ask a coding agent to fix it. Before you accept the change, you need evidence that the installer now rejects empty input and still accepts a valid package."
sectionIds:
  - define-the-change
  - check-before-and-after
  - record-the-result
  - run-the-skills-example
---

## Give the agent one change and a clear boundary

Describe the problem in terms you can check. Here, an identifier is the name the installer uses to look up a package. The installer should reject an empty name before it tries to find or install anything.

<aside class="lesson-note">

### An example request

Reject an empty package identifier before lookup. Keep the existing behaviour for valid identifiers. Reproduce the failure, make the smallest change, and show the files changed, the checks you ran, and anything you could not verify. Leave the decision to merge with the reviewer.

</aside>

## Check the broken input and a working input

Run the checks on the original version to establish what happens today. In this example, empty input reaches the package lookup. Use a fake lookup that records whether it was called, so you can check where validation happens without touching a real package service. Repeat the same checks on the proposed change.

| Input | What the check should show after the change |
| --- | --- |
| Empty identifier | The installer reports an invalid identifier and makes no lookup call. |
| Valid identifier | The installer looks up the requested package and returns the expected result. |

Read the diff, the list of what changed. Check that the agent left the valid path intact. Rerun the checks yourself or use a trusted automated runner. If the agent changed the tests, inspect the new expectations and confirm the empty-input check fails on the original code for the expected reason. A green run is useful only if it still checks the behaviour you care about.

## Give the reviewer evidence they can use

Record the version checked, the command and its observed result, and the limits of the run. For example, a local check with a fake lookup can prove that the installer skips lookup for empty input. It leaves compatibility with a live package service unverified. If a required check could not run, record what blocked it and keep the review open.

These checks help you decide whether to accept this one change. To evaluate the agent itself, repeat the exercise across different tasks and failure conditions. The Code Agent’s Playbook in Related reading shows how to design that wider evaluation.

## Run the versioned Skills example locally

The Code Maintenance plugin’s first-use example turns this request into a plan. It runs locally with Node.js 22 and needs only two files from release 0.2.0. Save the download as 0.2.0.tar.gz in a new folder and open a terminal there. [Download Code Maintenance Plugin 0.2.0 from Skills](https://skills.ai-knowledge-hub.org/artifacts/engineering/code-maintenance-plugin/0.2.0.tar.gz)

```Shell title="Extract the example and run the helper"
tar -xzf 0.2.0.tar.gz scripts/first_use.mjs examples/first-use-input.json
node scripts/first_use.mjs examples/first-use-input.json
```

The output includes the proposed check, go test ./internal/installer, and sets merge\_authorized to false. The helper prints a plan. To verify a repair, run the proposed check in the installer repository against the candidate change and record what happened. [See the package and installation options in Skills](https://skills.ai-knowledge-hub.org/plugins/engineering/code-maintenance-plugin)
