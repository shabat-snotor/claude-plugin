# Unslop rules, full detail

The complete rule set for the `/unslop` edit pass. The always-on block in
`SKILL.md` carries a condensed version of these rules into every session; this
file is the authority when the two disagree, and the numbering matches.

## Rules

### Content

1. **Puffery.** "pivotal moment", "testament to", "evolving landscape",
   "setting the stage for", "indelible mark", "deeply rooted", "rich history".
   Cut it and state what happened.
2. **Name-dropping.** Listing outlets, companies, or people without saying what
   each one did or said. Pick one and say what it said.
3. **Superficial -ing tails.** "..., highlighting the importance of X",
   "..., ensuring Y", "reflecting", "showcasing", "fostering", "underscoring".
   Delete the tail or replace it with the actual evidence.
4. **Promotional language.** nestled, vibrant, breathtaking, groundbreaking,
   renowned, stunning, must-visit, world-class, cutting-edge, state-of-the-art,
   best-in-class, seamless, powerful, robust (as praise). Describe neutrally.
5. **Vague attributions.** "Experts believe", "Studies show", "Industry reports
   suggest", "Some critics argue", "It is widely known". Name the source or
   delete the claim. Never invent a source to fill the gap.
6. **Formulaic challenge arcs.** "Despite challenges, X continues to thrive",
   "Faced with X, the team rose to the occasion". Replace with what happened.
7. **Fake precision.** "roughly 10 to 15 percent", "several", "a number of",
   "numerous" where no measurement exists. Give the measurement or say there
   is none.
8. **Empty comparison framing.** "Unlike traditional approaches", "In today's
   fast-paced world", "In the ever-evolving landscape of". Start with the
   subject.

### Language

9. **AI vocabulary.** additionally, crucial, delve, dive into, elevate, empower,
   enduring, enhance, ensure (as filler), foster, garner, harness (as
   metaphor), holistic, interplay, intricate, journey (abstract), key (as
   filler adjective), landscape (abstract), leverage, multifaceted, navigate
   (abstract), nuanced, pivotal, realm, robust, seamless, showcase, streamline,
   tapestry, testament, underscore, unlock, unpack, utilize, vibrant, vital.
   Replace with the plain word or cut.
10. **Fancy ways to say "is" or "has".** "serves as", "stands as", "acts as",
    "represents", "boasts", "features", "offers". Say "is" or "has".
11. **Negation contrast.** "Not just X, but Y", "It's not about X, it's about
    Y", "This isn't X. It's Y." State Y.
12. **Rule of three.** Three adjectives, three examples, three bullets, three
    paragraphs, by reflex. Use the number the material has.
13. **Synonym cycling.** Rotating protagonist, main character, central figure,
    hero within a paragraph to avoid repeating a word. Repeat the word.
14. **False ranges.** "from X to Y" where X and Y are not on a scale ("from
    authentication to analytics"). List the items.
15. **Signposting.** "First, ... Second, ... Finally, ...", "Here's the thing:",
    "Here's why:", "Let's break it down", "Let's dive in", "Think of it as",
    "Imagine", "Picture this". Delete the signpost and say the thing.
16. **Sentence-adverb openers.** Importantly, Notably, Interestingly, Crucially,
    Ultimately, Essentially, Basically, Fundamentally, At its core, In essence,
    That said, That being said, With that in mind, Moving forward, Going
    forward. Cut; the sentence works without them.
17. **Rhetorical questions as openers or transitions.** "Ever wondered
    why...?", "So what does this mean?", "Why does this matter?" Answer without
    asking.
18. **Stacked hedging.** "could potentially possibly", "it might arguably be
    the case that". One hedge at most, and only when the uncertainty is real:
    "probably", or "might" with the reason.
19. **Adverbs propping weak verbs.** "runs quickly" becomes "is fast" or the
    number; "significantly improves" becomes the measured difference. Cut very,
    really, quite, extremely, incredibly, highly.
20. **Filler phrases.** "In order to" becomes "to". "Due to the fact that"
    becomes "because". "In the event that" becomes "if". "At this point in
    time" becomes "now". "A large number of" becomes "many". "Whether or not"
    becomes "whether". Delete "It is important to note that", "It's worth
    noting that", "Note that", "Keep in mind that", "Needless to say", "As you
    may know".
21. **Prefer the plain word.** use, not utilize or leverage; help, not
    facilitate or assist; start, not commence; end, not terminate; try, not
    endeavor; find out, not ascertain; before, not prior to; after, not
    subsequent to; near, not in close proximity to; many, not numerous;
    enough, not sufficient; buy, not purchase; do, not implement (when you mean
    do).
22. **Abstract metaphor nouns.** substrate, wedge, vector, locus, vantage,
    nexus, primitive (as noun), harness (as metaphor), surface (as in "API
    surface"), bedrock, scaffolding (as metaphor), modality, paradigm,
    gold-plating, ratchet, evacuate (for moving code), endgame, north star,
    flywheel, moat, lens ("through the lens of"). Pick the concrete word:
    substrate becomes base; wedge in becomes add; vector becomes way or method;
    gold-plating becomes more than the job needs; evacuate becomes move out;
    endgame becomes the last phase.
23. **Say what it does, not how it feels.** "the database stays close at hand",
    "SQL you can read", "types that follow your schema" name a feeling. Name
    the mechanism or the number: "`.toSQL()` returns the exact string sent to
    the database", "a column rename fails the build". Ask what the sentence
    tells the reader to do or know, then write that. If it cannot be restated
    as an instruction, a fact, or a number, cut it. If it could appear
    unchanged in another project's text, it says nothing about this one; cut
    it.
24. **Active voice.** Catch "is/are/was/were + past participle" and name the
    actor: "queries are validated" becomes "the compiler validates queries".
    Passive is right only when the actor is unknown or does not matter ("the
    account was deleted in 2024").
25. **One idea per sentence.** If the reader has to backtrack, split it or drop
    the clause. Aim for a mix that averages around 20 words, not a ceiling. Do
    not join two sentences with a semicolon to look literate; start a new one.
26. **Anthropomorphism.** Software does not want, think, know, decide, or get
    confused. "The parser gets confused by" becomes "the parser rejects" or
    "the parser misreads". "The API expects" is a term of art and fine; "the
    API is happy" is not.
27. **Unclear antecedents.** "This", "it", "these", "that" opening a sentence
    with no noun attached. Attach the noun: "This causes" becomes "This retry
    causes".

### Style and formatting

28. **Dashes.** Never the em dash or the en dash, in any output, including code
    comments, commit messages, and tool inputs. They are the single most
    recognizable tell. Restructure instead: end the sentence, use a comma, or
    use a colon before a list or an example. When a dash is unavoidable, use
    the character named in Project settings and treat every use as suspect.
    Do not swap a dash for parentheses by reflex: that trades one tell for
    another.
29. **Colons as connectors.** Fine before a list or an example. Not as a
    mid-sentence hinge: "If you're coming from traditional automation: instead
    of registering handlers, you describe conditions" adds nothing with the
    colon. Drop the colon and the comparison framing and say the plain thing.
30. **Boldface.** Do not bold proper nouns, acronyms, or whole sentences. Bold a
    term being defined, a UI element name, or the first few words of a bullet
    in a list long enough to scan. Nothing else.
31. **Inline-header lists.** "**Performance:** Performance improved..." is a
    label that restates the line. Convert to prose. A bold lead-in that ends in
    a period, names the item, and is followed by new detail ("**Schema in
    TypeScript.** Tables live in one file.") is fine.
32. **Headings.** Sentence case. Descriptive: a heading says what the section
    does for the reader, not "Overview" or "Introduction". No emoji, no "&",
    no trailing punctuation. No heading in a reply under roughly 500 words;
    above that, at most three.
33. **Emoji and symbols.** None in headings, bullets, or as check marks. No
    arrows in prose; write "becomes", "then", or "returns".
34. **Quotes.** Straight quotes, not curly. Code font, not quotes, for code,
    values, and file names.
35. **Tables.** Only when the content has two or more dimensions the reader
    will compare across. Two facts do not need a table. Cells hold fragments,
    not sentences.
36. **Lists.** Bullets for parallel items, numbers only for sequence or
    ranking. Every item in the same grammatical shape. Introduce a list with a
    sentence or a fragment. No list of one, no nesting past two levels, and no
    bullets where the content is a line of argument that prose carries better.
37. **Code.** Fenced blocks with a language tag for anything the reader runs or
    copies. Code font inline for identifiers, file names, commands, and
    literal values. Never code font for emphasis. Prose does not go inside a
    code block, and a prose sentence carries at most one identifier.
38. **Horizontal rules and blockquotes.** No horizontal rules. Blockquotes only
    for quoting someone.

### Structure

39. **Restating the prompt.** Opening a reply by rephrasing the question
    ("You're asking how to..."). Start with the answer.
40. **Announcing the document.** "In this article, we'll explore", "This
    document describes", "Below is a summary of". Start with the content. A
    reference document opens with what the thing is and who it is for.
41. **The summary sandwich.** An introduction that previews the points, the
    points, then "In summary", "In conclusion", or "Key takeaways" repeating
    them. Write the points once. End when the content ends.
42. **Uniform paragraphs.** Every paragraph the same length, every section the
    same shape, every bullet the same word count. Let the material decide.
43. **Over-scaffolding.** Headings, bullets, and bold applied to a short answer.
    Under about 500 words, prose with at most one list.
44. **The closing offer.** "Let me know if you'd like me to...", "I hope this
    helps", "Feel free to...", "Happy to expand on any of these". Stop when
    done. Naming a real fork the reader must choose after finished work is
    fine; a reflexive offer is not.
45. **Front-loading.** In each paragraph and each sentence, the point comes
    first and the qualification after. "Because X, Y" only when the reader
    needs X to accept Y; otherwise "Y".

### Communication artifacts

46. **Chatbot phrases.** "Certainly!", "Of course!", "Great question!",
    "Absolutely!", "I'd be happy to", "Sure thing", "Found the smoking gun!",
    "Perfect!", "Done!", "Got it". Remove.
47. **Sycophancy.** "You're absolutely right", "Excellent point", "That's a
    great idea". Respond to the content. Agreement is shown by acting on it.
48. **Narrating the process.** "Let me check...", "Now I'll look at...", "I'll
    go ahead and", "I've successfully...", "First, I'll". Report the finding,
    not the looking, unless the process is the deliverable. A final report says
    what changed, what ran and its actual result, and what was skipped.
49. **Cutoff disclaimers.** "While specific details are limited", "As of my
    last update", "I don't have access to real-time". Find the fact or say
    plainly that you did not find it.
50. **Pseudo-transparency.** "To be honest", "I'll be transparent", "Full
    disclosure", "Frankly". Say the thing.
51. **Empty reassurance after a change.** "This ensures a smooth experience",
    "This allows for greater flexibility", "This makes the code more
    maintainable". Say what the change does. If you cannot name the concrete
    effect, the sentence goes.
52. **Generic conclusions.** "The future looks bright", "Only time will tell",
    "It will be interesting to see". State the plan, the fact, or the open
    question.

### Documentation (Google developer documentation style)

These apply to the documentation register and to the prose parts of the
code-adjacent register.

53. **Second person.** Address the reader as "you". Not "the user", "the
    developer", "one", and not "we" for the reader's actions. "We" is only the
    authors, and only in "we recommend".
54. **Present tense.** Describe behavior as it is: "the function returns", not
    "the function will return". "Will" only for something that happens later
    than another event in the same sentence.
55. **Imperative steps.** Procedures are numbered lists. Each step is one
    action in the imperative and ends where the reader can verify it. The
    condition comes before the instruction: "To save the file, press Ctrl+S",
    "If the build fails, run the linter", never the reverse. Say what the
    result looks like when it is not obvious.
56. **Requirements language.** "Must" for a requirement, "can" for ability or
    permission, "might" for possibility. Not "should" for a requirement, not
    "may" for anything (it is ambiguous between permission and possibility),
    not "could" when you mean "can".
57. **Word choice.** "for example", not "e.g."; "that is", not "i.e."; list the
    items or write "such as" instead of "etc."; "through" or "using", not
    "via"; "after", not "once"; "because", not "since" or "as" when causal;
    "although", not "while" when contrasting; "lets you", not "allows you to"
    or "enables you to"; "turn on" and "turn off", not "enable" and "disable"
    for a setting; "run", not "execute"; "want", not "desire"; "stop" or
    "cancel", not "abort" or "kill" outside a literal command name.
58. **Words that judge difficulty.** simply, just, easy, easily,
    straightforward, obviously, clearly, of course, quickly. They insult the
    reader who is stuck. Delete.
59. **Please.** Not in instructions. "Click Save", not "Please click Save".
60. **Timeless writing.** No currently, now, at the time of writing, new,
    newer, latest, recently, soon, in the future, does not yet, coming soon.
    Give the version or the date. Do not pre-announce unreleased features.
61. **Link text.** The link text names the destination: "see the
    authentication guide", never "click here", "here", "this link", or a bare
    URL in prose. Do not write "above" or "below" for a cross-reference; name
    the section.
62. **Define at first use.** Expand every acronym the first time it appears,
    with the short form in parentheses, then use the short form. Define a
    named pattern with one plain sentence and a concrete example, and prefer
    the plain description over the pattern name.
63. **Code and UI.** Code font for identifiers, file names, paths, commands,
    parameters, literal values, and HTTP methods. Bold for UI element names
    ("click **Save**"). Placeholders in code font with a descriptive name in
    capitals, defined right after the snippet.
64. **Numbers and dates.** Spell out zero through nine in prose, numerals from
    10 up, and numerals always with units, in tables, and for versions. Dates
    in an unambiguous form (2026-09-05 or September 5, 2026), never
    09/05/2026. Serial comma in every list of three or more.
65. **Contractions are fine.** "Don't", "isn't", "you're" read as a person; do
    not remove them for formality. Do not stack negatives: "not uncommon"
    becomes "common".
66. **No "and/or", no "(s)".** Pick one, or write "one or more".
67. **Global audience.** No idioms or metaphors tied to one culture or sport
    ("home run", "ballpark", "table stakes", "slam dunk"), no humor that
    depends on shared culture, no reference to a season or a local time of
    day as if the reader shares it.
68. **Inclusive language.** Singular "they", never "he or she". Allowlist and
    denylist, not whitelist and blacklist. Primary and replica, not master and
    slave. "Everyone", not "guys". "Quick check" or "confirmation check", not
    "sanity check". No figurative blind, crippled, crazy, insane, dumb, lame.
    "Person hours", not "man hours".
69. **One document, one audience.** Say who it is for in the first paragraph
    and keep to that reader's vocabulary. A section for a second audience gets
    its own heading and its own vocabulary. Never reference a document the
    reader cannot see without a one-sentence summary of what it says.

### Code-adjacent register

70. **Commit messages.** Imperative subject within the length in Project
    settings, no trailing period, no emoji, no subject that is only a ticket
    key, no prefix that repeats the change ("fix: fix"). The body says why, and
    what the change deliberately does not do, in sentences. Not "This commit",
    not past tense ("Updated X"), not a bullet per file. Attribution trailers
    per Project settings.
71. **Pull request descriptions.** First paragraph: what changed and why, in
    prose. Then how to test it, and what was left out on purpose. No "This PR
    introduces", no "Summary / Changes / Testing" template on a change that
    fits in three sentences, no restating the diff file by file, no
    generated-by footer unless Project settings ask for one.
72. **Code comments.** Only the non-obvious why: a workaround for an external
    bug, a planner quirk, an ordering constraint, an invariant the code cannot
    show. Never what the code does, never narration of the change, never a
    docblock restating the signature. A TODO names an owner or a ticket.
73. **Review comments.** Name the problem, say what breaks, propose the fix.
    Not "Have you considered...?" when you mean "Use X because Y". No opener
    praising the work, no closing thanks.
74. **Tickets and changelog entries.** Facts a reader can act on: what is
    broken or what changes, for whom, and how to see it. The ticket structure
    comes from the project's ticket skill (Project settings); the language
    rules here still apply to every sentence in it.

### Self-audit

Before delivering, read the text once as a stranger and answer:

- What would make a reader suspect a machine wrote this? Fix it.
- Is the first sentence the point?
- Could any sentence appear unchanged in a different project's text? Cut it.
- Does any sentence say how to feel instead of what is true or what to do?
- Did any edit change a fact, a number, or a commitment? Tell the author.
- Is every dash gone?
