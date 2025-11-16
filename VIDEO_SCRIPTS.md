# Ready-to-Use Video Scripts

## VIDEO 1: Platform Overview (60 seconds)

### Recording Instructions:
```
START FRONTEND:
cd /home/user/visualdatastructure/frontend
npm run dev

BROWSER SETUP:
- Open incognito window
- Go to localhost:5173
- Zoom: 100%
- Hide bookmarks bar
```

### Shot List:
```
[0-5s] Home Page Scroll
ACTION: Slowly scroll down homepage showing all 21 topics
TEXT: "I built a FREE platform for FAANG interviews"

[5-10s] Click Dynamic Programming
ACTION: Click on DP card
TEXT: "21 Topics. 96% Interview Coverage."

[10-20s] Show Interactive Viz
ACTION: Click "Fibonacci" → "Execute Step-by-Step" → Next 3 times
TEXT: "Interactive Visualizations ✅"

[20-30s] Show Code
ACTION: Scroll to code section
TEXT: "From Scratch + Production Code ✅"

[30-40s] Show Advanced Section
ACTION: Scroll to Advanced section
TEXT: "Production Insights ✅"

[40-50s] Back to Home
ACTION: Navigate to home, show learning path
TEXT: "150+ Interview Problems ✅"

[50-60s] CTA
ACTION: Show URL in browser bar
TEXT: "100% FREE. Link in Comments 👇"
```

### Text Overlays (add in CapCut):
- 0s: "FREE FAANG Interview Platform"
- 5s: "21 Topics"
- 10s: "Interactive Visualizations"
- 20s: "Step-by-Step Code"
- 30s: "Production Insights"
- 50s: "Link in Comments ↓"

### Voiceover Script:
```
"I spent months building a free platform that covers 96% of FAANG interviews.

It has interactive visualizations, step-by-step walkthroughs, and production insights you won't find anywhere else.

21 topics. 150 problems. Zero cost.

Link in the comments."
```

---

## VIDEO 2: Stack Visualization (30 seconds)

### Recording Instructions:
```
NAVIGATE TO: localhost:5173/stack

ACTIONS TO RECORD:
1. Show empty stack visualization
2. Push 10
3. Push 20
4. Push 30
5. Peek (highlight top)
6. Pop (show 30 removed)
7. Pop (show 20 removed)
```

### Shot List:
```
[0-3s] Introduction
ACTION: Show stack page, empty stack
TEXT: "What's a Stack? LIFO: Last In, First Out"

[3-10s] Push Operations
ACTION: Type "10" → Push → Type "20" → Push → Type "30" → Push
TEXT: "Push adds to top → O(1)"

[10-15s] Peek Operation
ACTION: Click Peek button
TEXT: "Peek views without removing → O(1)"

[15-25s] Pop Operations
ACTION: Pop → Pop
TEXT: "Pop removes from top → O(1)"

[25-30s] CTA
ACTION: Show stack with remaining elements
TEXT: "Master Stacks + 20 other topics FREE"
```

### Text Overlays:
- 0s: "Stack = Last In, First Out (LIFO)"
- 3s: "Push: O(1) ⚡"
- 10s: "Peek: O(1) ⚡"
- 15s: "Pop: O(1) ⚡"
- 25s: "Learn More - Link Below 👇"

### Voiceover Script:
```
"A Stack is simple: Last In, First Out.

Like a stack of plates. Add to the top. Remove from the top.

All operations are O of 1 - blazing fast.

Used everywhere: undo buttons, browser history, function calls.

Learn the rest for free."
```

---

## VIDEO 3: Two Pointers Magic (45 seconds)

### Recording Instructions:
```
NAVIGATE TO: localhost:5173/two-pointers

FOCUS ON: "Container With Most Water" problem
```

### Shot List:
```
[0-5s] Problem Introduction
ACTION: Show problem description
TEXT: "Find container holding most water"

[5-10s] Brute Force
ACTION: Scroll to brute force explanation
TEXT: "Brute Force: O(n²) ❌"

[10-30s] Two Pointers Solution
ACTION: Execute step-by-step (5-6 steps)
Show pointers moving, area calculated
TEXT: "Two Pointers: O(n) ✅"

[30-40s] Key Insight
ACTION: Highlight "move shorter line" logic
TEXT: "Move shorter line → wider can't be better"

[40-45s] CTA
TEXT: "Master this + 20 patterns - Link below"
```

### Text Overlays:
- 0s: "Container With Most Water"
- 5s: "Brute Force = O(n²) 🐌"
- 10s: "Two Pointers = O(n) ⚡"
- 25s: "Key: Move the shorter line!"
- 40s: "Free Course - Link in Comments 👇"

### Voiceover Script:
```
"This Two Pointers pattern solves 15% of array problems.

Container with most water. Brute force? O of n squared. Too slow.

Two pointers? O of n. Here's how:
Start at both ends. Calculate area. Move the shorter line inward.

Why? The wider container can only get smaller.

This pattern alone is worth learning.
```

---

## VIDEO 4: ArrayList vs LinkedList (30 seconds)

### Recording Instructions:
```
NAVIGATE TO: localhost:5173/linkedlist

SCROLL TO: Comparison table in Advanced section
```

### Shot List:
```
[0-5s] Hook
ACTION: Show comparison table
TEXT: "ArrayList is 8x FASTER than LinkedList"

[5-12s] Benchmark
ACTION: Highlight benchmark section
Show: ArrayList 2.1ms vs LinkedList 18.5ms
TEXT: "Real benchmark: 1M elements"

[12-20s] Why?
ACTION: Show CPU cache explanation
TEXT: "CPU loves contiguous memory (ArrayList)"

[20-25s] When LinkedList Wins
ACTION: Show "Insert at beginning" comparison
TEXT: "LinkedList wins: O(1) vs O(n) for head insert"

[25-30s] CTA
TEXT: "Learn the trade-offs - Free guide"
```

### Text Overlays:
- 0s: "ArrayList vs LinkedList"
- 5s: "ArrayList: 2.1ms ⚡"
- 6s: "LinkedList: 18.5ms 🐌"
- 12s: "8x FASTER!"
- 20s: "But LinkedList wins for head inserts"
- 25s: "Full comparison - Link below 👇"

---

## VIDEO 5: XOR Trick (15 seconds - QUICK WIN)

### Recording Instructions:
```
NAVIGATE TO: localhost:5173/bit-manipulation

FOCUS ON: "Single Number" problem
```

### Shot List:
```
[0-3s] Hook
ACTION: Show problem
TEXT: "Find single number among pairs"

[3-8s] The Trick
ACTION: Highlight XOR solution
Show: result ^= num
TEXT: "XOR Magic: pairs cancel! ⚡"

[8-12s] Why It Works
ACTION: Show explanation
a ^ a = 0, a ^ 0 = a
TEXT: "5 lines of code. O(1) space."

[12-15s] CTA
TEXT: "More tricks - Link below"
```

---

## BATCH RECORDING SESSION (Record 5 in 1 hour)

### Setup:
```bash
cd /home/user/visualdatastructure/frontend
npm run dev

# Open browser to localhost:5173
# Start OBS recording
```

### Recording Order:
```
1. Platform Overview (60s)
   - Home → DP → Viz → Code → Home
   - 3 takes, keep best

2. Stack Demo (30s)
   - Stack page → Push Push Push → Pop Pop
   - 2 takes

3. Two Pointers (45s)
   - Two Pointers page → Container problem → Execute
   - 2 takes

4. ArrayList vs LinkedList (30s)
   - LinkedList page → Scroll to comparison
   - 1 take (easy!)

5. XOR Trick (15s)
   - Bit Manipulation → Single Number
   - 1 take (super quick)
```

**Total Recording Time**: 30-40 minutes
**Total Editing Time**: 2-3 hours (first time, gets faster)
**Result**: 5 videos ready to post!

---

## MICRO VIDEOS (15-20 seconds each)

### Did You Know #1: Java Stack is Legacy
```
[0-5s] TEXT: "NEVER use Stack<> in Java"
[5-10s] TEXT: "It's from 1996. Extends Vector. Synchronized = slow."
[10-15s] TEXT: "Use ArrayDeque<> instead ✅"
[15s] CTA: "Learn more - link below"
```

### Did You Know #2: O(1) vs O(n)
```
[0-5s] Show array of 1 million elements
[5-10s] TEXT: "Array access: Same time for [0] or [999999]"
[10-15s] TEXT: "That's O(1) - constant time ⚡"
[15s] CTA
```

### Did You Know #3: HashMap Magic
```
[0-5s] TEXT: "HashMap finds key in O(1)"
[5-10s] TEXT: "But how? Hash function → direct jump!"
[10-15s] Show hash function converting key to index
[15s] CTA
```

---

## TEXT OVERLAY TEMPLATES

### For CapCut - Copy/Paste Ready:

**Title Card:**
```
Font: Montserrat Bold
Size: 60
Color: #FFFFFF
Background: #000000 (50% opacity)
Animation: Fade In + Scale
Duration: 3s
```

**Step Labels:**
```
Font: Roboto Bold
Size: 40
Color: #FFFFFF
Background: #2563EB (blue)
Position: Bottom third
Animation: Pop
Duration: 2s
```

**Stats/Numbers:**
```
Font: Impact
Size: 80
Color: #10B981 (green) or #EF4444 (red)
Background: None
Animation: Scale + Bounce
Duration: 2s
```

**CTA:**
```
Font: Montserrat Bold
Size: 50
Color: #FFFFFF
Background: Gradient (#6366F1 to #8B5CF6)
Position: Center bottom
Animation: Slide up
Duration: 5s
```

---

## POSTING CHECKLIST

Before posting each video:

- [ ] Duration: 15-90 seconds
- [ ] Captions added (auto-generate + review)
- [ ] Text is readable on mobile (test on phone!)
- [ ] No personal info visible
- [ ] Call-to-action is clear
- [ ] LinkedIn-friendly: Square (1:1) or Landscape (16:9)
- [ ] Under 200MB file size
- [ ] First 3 seconds grab attention
- [ ] Saved as MP4, 1080p

---

## WEEKLY VIDEO PLAN

**Week 1:**
- Monday: Platform Overview (60s)
- Friday: Stack Demo (30s)

**Week 2:**
- Monday: Two Pointers (45s)
- Wednesday: ArrayList vs LinkedList (30s)
- Friday: XOR Trick (15s)

**Week 3:**
- Monday: Dynamic Programming (60s)
- Thursday: HashMap Deep Dive (45s)

**Week 4:**
- Monday: Graph BFS/DFS (60s)
- Friday: "Did You Know" series (3x 15s videos)

**Ongoing:**
- 2-3 videos per week
- Mix long (60s) and short (15-30s)
- Always include CTA

---

## PRODUCTION TIPS

### Lighting:
- Record during daytime (natural light)
- Or use desk lamp pointed at wall (soft light)
- Screen brightness: 80% (not too bright, not too dark)

### Audio:
- Quiet room
- Close windows
- Turn off fans/AC during recording
- Phone mic is fine for voiceover (use Voice Memos)

### Screen:
- Close all notifications
- Use incognito/private browser
- Zoom to 100% (not 110% or 90%)
- Clear, readable fonts

### Recording:
- Do 2-3 takes of each video
- Keep first take even if imperfect (you'll edit anyway)
- Don't worry about perfection
- Just capture the key moments

### Editing:
- Cut out pauses
- Speed up slow parts (1.2x-1.5x)
- Add text AFTER you have final cut
- Captions last (so you don't re-do them)

---

## MOTIVATION

Remember:
- **Video 1 will be imperfect** - that's okay!
- **You'll get faster** - editing takes 3 hours first time, 30 min by video 10
- **Simple videos perform best** - don't overthink it
- **Just start** - record ONE video this weekend

The platform you built is amazing.
The videos just need to show it.

You've got this! 🎬
