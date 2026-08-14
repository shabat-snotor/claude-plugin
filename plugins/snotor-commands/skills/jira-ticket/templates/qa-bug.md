# QA bug format

For defects found in testing, or behaviour that contradicts a spec or another
ticket. A real example of the target shape is the reference bug ticket named
in the skill's Project settings.

Title rules (STRICT). Platform tag first, per the shared title rule, then the
title follows the What / Where / When structure:

- **What:** what is broken (the action, feature, or behaviour)
- **Where:** the location (page, module, screen, API endpoint, device context)
- **When:** the condition or trigger (scenario, state, or event)

Examples:
- "[FE](web) Login fails on Authentication page when valid credentials are submitted"
- "[BE] Error message appears in Checkout screen when payment is processed"

The title must be concise, fully descriptive, self-contained (understandable
without opening the ticket), and free of vague wording: "does not work",
"issue", or "bug" without context are rejected.

Description rules (STRICT). The four sections carry everything; any prose
outside them is 2-4 sentences maximum and must state the minimal context
needed to understand the defect and the clear condition under which it
occurs. Precise and fully informative within that constraint, nothing padded.

Section guidance:

- **Preconditions** - numbered. The environment, accounts, feature flags, and
  data state that must exist before the steps work. Name feature flags
  explicitly: flag-gated behaviour silently takes the flag-off branch when the
  flag is not set.
- **Steps to reproduce** - numbered. One concrete action per step, by a named
  actor, executable without reading code.
- **Actual results** - what happens, stated factually: the exact error message,
  the wrong label, the observable wrong state. Reference a screenshot or
  response body when one exists.
- **Expected results** - what should happen instead. Link the ticket or spec
  that defines the expected behaviour when one exists (HUD-3963 links the
  ticket that specified the button label).

Output skeleton:

## [Title]

### Preconditions

1. ...

### Steps to reproduce

1. ...

### Actual results

...

### Expected results

...
