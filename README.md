# Turing Machine Simulator

This project is a web-based Turing Machine simulator. It provides a visual representation of a Turing machine, allowing users to define rules and observe the machine's computation on an input string.

## Features

*   Visual representation of the tape and read/write head.
*   User-definable machine rules.
*   Step-by-step and continuous run modes.
*   Displays current state and step count.

## How to Use

Use the simulator as if you are programming and observing a real Turing Machine.

1. Define transition rules in Machine Rules using this format per line:
`currentState,readSymbol,nextState,writeSymbol,move`

2. Example rule:
`q0,1,q1,0,R`
Meaning: if the machine is in state `q0` and reads `1`, it writes `0`, moves Right, and changes to `q1`.

3. Enter the initial tape content in Input String.

4. Click Initialize to place the machine at the first symbol, set state to `q0`, and load your rules.

5. Use Step to execute one transition cycle at a time (best for learning).

6. Use Run to let the machine continue automatically until it halts.

7. Use Reset to clear tape, rules, and status and start over.

## How It Works (Turing Machine POV)

A Turing Machine in this simulator has three core parts:

1. Tape:
The tape is the machine memory. Each cell stores one symbol.

2. Head:
The read/write head points to one cell at a time, reads it, writes to it, and moves Left or Right.

3. State Control:
The current state tells the machine which rule table row to use.

During each computation step, the simulator follows this exact sequence:

1. Read the symbol under the head.

2. Find a matching rule using `(currentState, readSymbol)`.

3. Write the new symbol from that rule.

4. Move the head (`L`, `R`, or stay if your rule set uses `S`).

5. Update to the rule's `nextState`.

The machine halts when no rule matches the current `(state, symbol)` pair. At that point, the tape content is the output of the computation.

## Example: Exact Sequence

Do this exact sequence:

Click Reset once.

Put rules:
```text
q0,1,q0,1,R
q0,B,qH,1,S
```

Put input:
```text
111
```

Click Initialize.

Click Run.

You should get final tape as 1111.

## Example: Replace All 1 with 0

Do this exact sequence:

Click Reset once.

Put rules:
```text
q0,1,q0,0,R
q0,B,qH,B,S
```

Put input:
```text
11111
```

Click Initialize.

Click Run.

You should get final tape as 00000.

## Example: Scan to End (No Change)

Do this exact sequence:

Click Reset once.

Put rules:
```text
q0,0,q0,0,R
q0,1,q0,1,R
q0,B,qH,B,S
```

Put input:
```text
101001
```

Click Initialize.

Click Run.

You should get final tape as 101001.
