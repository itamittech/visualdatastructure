# Video Recording Guide: Dynamic Programming in 60 Seconds

## Pre-Production

### 1. Test Your Setup
```bash
cd /home/user/visualdatastructure/frontend
npm run dev
```

Open browser to: http://localhost:5173

### 2. Clean Browser Window
- Close unnecessary tabs
- Hide bookmarks bar (Cmd+Shift+B / Ctrl+Shift+B)
- Zoom to 100%
- Use Incognito/Private mode (clean, no extensions)

### 3. Prepare Navigation Path
Practice this flow 3 times before recording:
1. Home page → Click "Dynamic Programming"
2. Read theory section (don't record all, just show it)
3. Click on "Fibonacci" problem
4. Click "Execute Step-by-Step"
5. Step through 5-6 steps slowly
6. Show the DP table filling
7. Scroll to code implementation
8. Scroll to complexity comparison

---

## Recording Setup

### Using OBS Studio (Recommended - Free & Professional)

#### Installation:
```bash
# Mac
brew install --cask obs

# Or download from: https://obsproject.com/
```

#### OBS Configuration:
1. **Scene Setup**:
   - Click "+" under Sources
   - Add "Display Capture" (entire screen) OR
   - Add "Window Capture" (just browser)

2. **Canvas Settings**:
   - Settings → Video
   - Base Resolution: 1920x1080
   - Output Resolution: 1920x1080
   - FPS: 30 (or 60 for smoother)

3. **Recording Settings**:
   - Settings → Output
   - Recording Format: MP4
   - Encoder: H264
   - Quality: High

4. **Audio**:
   - Mute Desktop Audio (we'll add voiceover later)
   - OR record voiceover live if you're comfortable

#### Start Recording:
- Click "Start Recording" (or hotkey: Cmd+Shift+R)
- Record your navigation
- Click "Stop Recording"
- Files save to: ~/Videos (Mac) or Videos folder (Windows)

---

### Using Loom (Easier, Free Tier)

1. Install Loom Chrome Extension
2. Click Loom icon → "Screen + Camera" or "Screen Only"
3. Select window or full screen
4. Hit "Start Recording"
5. Navigate through your app
6. Click "Finish" when done
7. Download video (Free tier has watermark)

---

## Recording Script - DP Video

### Scene 1: Home Page (5 seconds)
**Action**:
- Show homepage scrolling down slowly
- Highlight "Dynamic Programming" card

**Text Overlay** (add in editing):
"Dynamic Programming made simple in 60 seconds"

### Scene 2: DP Page - Theory (5 seconds)
**Action**:
- Quick scroll through theory section
- Don't read everything, just show it exists

**Text Overlay**:
"The Problem: Fibonacci recursive is O(2ⁿ)"

### Scene 3: Fibonacci Problem (10 seconds)
**Action**:
- Click on "Fibonacci" tab
- Show the problem description
- Click "Execute Step-by-Step" button

**Text Overlay**:
"Watch it solve step-by-step ⚡"

### Scene 4: Step-Through Execution (20 seconds)
**Action**:
- Click "Next Step" 5-6 times slowly (2-3 seconds each)
- Let viewers see the DP array filling
- Highlight values being reused

**Text Overlay** (appears as values fill):
"Step 1: fib(0) = 0"
"Step 2: fib(1) = 1"
"Step 3: fib(2) = fib(1) + fib(0) = 1"
"Reusing saved results! 💡"

### Scene 5: Complexity Comparison (10 seconds)
**Action**:
- Scroll to show code
- Highlight the complexity analysis section

**Text Overlay**:
"O(2ⁿ) → O(n) transformation"
"fib(40): 100M calls → 40 operations"

### Scene 6: Call to Action (10 seconds)
**Action**:
- Scroll back to top
- Show "Try it yourself" interactive controls
- Show URL in browser bar

**Text Overlay**:
"100% FREE - No ads, no paywall"
"Link in comments 👇"
"visualdatastructure.com"

---

## Post-Production (Editing)

### Using CapCut (Free, Easy)

#### 1. Import Video
- Download CapCut (https://www.capcut.com/)
- Create New Project
- Import your OBS recording

#### 2. Trim to 60 Seconds
- Cut out pauses, mistakes
- Speed up slow parts (1.2x-1.5x)
- Keep most important: step-by-step execution

#### 3. Add Text Overlays
CapCut → Text → Add Text

**Title Style** (0-5s):
- "Dynamic Programming in 60 Seconds"
- Font: Bold, 48pt
- Position: Top center
- Animation: Fade in

**Step Labels** (15-35s):
- Add text for each step shown
- Font: 32pt, white text, black background
- Position: Bottom third
- Animation: Pop in

**Stats** (35-45s):
- "O(2ⁿ) → O(n)"
- Large, bold, center screen
- Animation: Scale up

**CTA** (50-60s):
- "Learn More - Link in Comments"
- Bottom center
- Add arrow pointing down ↓

#### 4. Add Captions (Auto)
- CapCut → Captions → Auto Captions
- Language: English
- Click Generate
- Review and fix any errors
- Style: White text, black background box

#### 5. Add Background Music (Optional)
- CapCut → Audio → Music
- Search: "upbeat tech" or "corporate"
- Volume: 20% (don't overpower)
- Keep it subtle

#### 6. Export
- Resolution: 1080p
- Frame Rate: 30fps
- Format: MP4
- Quality: High
- Export!

---

## Adding Voiceover (Optional but Better)

### Script for DP Video:
```
[0-5s]
"Dynamic Programming sounds scary, but it's actually simple."

[5-15s]
"Take Fibonacci. The recursive solution is O(2 to the n) - way too slow."

[15-30s]
"But what if we save each result and reuse it? Watch what happens."
[pause as steps execute]
"See that? We're not recalculating. We're reusing."

[30-45s]
"The result? We go from 100 million function calls to just 40.
That's the power of Dynamic Programming."

[45-60s]
"Want to learn this and 20 other patterns? Check the link in comments.
It's 100% free."
```

### Recording Voiceover:
1. **Mac**: QuickTime → File → New Audio Recording
2. **Windows**: Voice Recorder app
3. **Phone**: Voice Memos app (surprisingly good quality)

### Add to Video:
- CapCut → Audio → Extract Audio from voiceover file
- Align with video timeline
- Adjust volume
- Add fade in/out

---

## Optimization Tips

### Make it THUMB-STOPPING:
1. **First 3 seconds matter most**:
   - Start with a hook
   - Use text overlay immediately
   - Show something interesting right away

2. **Use Visual Contrast**:
   - Highlight important elements (red circles, arrows)
   - Zoom in on key parts
   - Use color to draw attention

3. **Pacing**:
   - Don't move too fast
   - Don't stay on one thing too long
   - 2-3 seconds per text overlay
   - Cut out ALL dead air

4. **Captions are MANDATORY**:
   - 85% watch without sound
   - Auto-generate, then fix errors
   - Keep text large and readable

---

## Final Checklist Before Posting

- [ ] Video is under 90 seconds
- [ ] Captions are accurate
- [ ] Text is readable on mobile
- [ ] No personal info visible (emails, notifications)
- [ ] Audio levels are balanced
- [ ] Call-to-action is clear
- [ ] Exported in 1080p MP4
- [ ] Under 200MB file size
- [ ] Tested playback on phone

---

## Quick Wins - 5 Videos You Can Make TODAY

### 1. Platform Tour (60 sec)
Record: Navigate from home → any topic → show visualization → show code → CTA

### 2. Single Visualization (30 sec)
Record: Stack push/pop animation with text explaining LIFO

### 3. Before/After (30 sec)
Record: Split screen - code on left, visualization on right

### 4. Problem Solving (60 sec)
Record: Two Pointers problem step-by-step solution

### 5. Did You Know? (15 sec)
Record: Quick fact + visual proof (e.g., ArrayList vs LinkedList benchmark)

---

## Template: Video Structure

**Every video should follow:**
```
[0-5s]   HOOK: Grab attention with bold claim or question
[5-15s]  PROBLEM: Show the pain point
[15-40s] SOLUTION: Demonstrate your platform solving it
[40-55s] PROOF: Show results, stats, or key insight
[55-60s] CTA: "Link in comments" + URL visible
```

---

## Next Steps

1. **This Weekend**:
   - Record one 60-second platform overview
   - Use OBS or Loom
   - Keep it simple - no editing needed for first one

2. **Next Week**:
   - Learn basic CapCut editing
   - Add text overlays
   - Add captions
   - Post to LinkedIn!

3. **Ongoing**:
   - One video per week
   - Repurpose: One topic → 3 videos (overview, problem, insight)
   - Track metrics: which videos get most engagement?

---

## Resources

- **OBS Tutorial**: https://www.youtube.com/watch?v=EuSUPpoi0Vs
- **CapCut Tutorial**: https://www.youtube.com/watch?v=7qKzNSKL8HA
- **LinkedIn Video Best Practices**: https://business.linkedin.com/marketing-solutions/blog/linkedin-b2b-marketing/2021/the-ultimate-guide-to-linkedin-video

---

Good luck! Start with ONE simple video. Don't aim for perfection.
Just hit record and show what you built! 🎬
