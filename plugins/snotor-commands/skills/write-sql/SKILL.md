---
name: write-sql
description: Write a verified read query for a human to run; never connect to a database
argument-hint: <the question to answer against live data>
disable-model-invocation: true
---

Write the SQL that answers this question, for me to run myself: $ARGUMENTS

You must not connect to any database, run any query, or use any database client.
The deliverable is the query text.

Before writing a single line of SQL:
1. Read the entity definition for every table involved and cite the file path
   with a line number for each column you reference.
2. Read the service code for any filtering that happens outside the database, so
   the query reflects what the application actually returns rather than what the
   schema allows.
3. Follow the raw-SQL conventions in the project instruction file, identifier
   quoting included.

Then give me: the query, one sentence on what each join and filter is for, what
the result should look like if the hypothesis is right, and what it will look
like if it is wrong.

If you could not verify a column or table name from the code, say so explicitly
instead of guessing it.
