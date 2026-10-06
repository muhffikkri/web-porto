You are a senior creative frontend engineer specializing in immersive
3D web experiences, WebGL, scroll-driven animation, React, and performance optimization.

Build a production-quality personal portfolio website based on the following concept:

The website is a continuous 3D "memory corridor".

The user does NOT feel like they are navigating between normal HTML sections.

Instead, the entire portfolio exists inside one large virtual 3D environment.

Scrolling controls a virtual camera.

SCROLL DOWN:
camera moves forward through the world.

SCROLL UP:
camera moves backward.

Portfolio content is placed at different Z positions.

============================================================
TECH STACK
============================================================

Use:

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- GSAP
- GSAP ScrollTrigger
- Lenis for smooth scrolling
- Tailwind CSS for UI/HUD styling

Use CSS 3D transforms for lightweight DOM elements when appropriate.

Use Three.js for:

- environment
- floating geometry
- platforms
- particles
- camera
- atmospheric effects
- depth-based objects

Do NOT unnecessarily render every text element as a WebGL texture.

Keep important text as HTML/DOM for:

- accessibility
- SEO
- responsive behavior
- text rendering quality

============================================================
CORE ARCHITECTURE
============================================================

Create a virtual world coordinate system.

Example:

cameraZ = scrollProgress \* WORLD_LENGTH

Each scene has a virtual Z position:

hero:
z = 0

about:
z = -25

skills:
z = -55

projects:
z = -90

experience:
z = -130

contact:
z = -170

The exact values should be configurable.

Do NOT hardcode these values throughout the components.

Create a central configuration:

SCENES = [
{
id: "hero",
z: 0,
title: "...",
},
...
]

The entire camera movement should be derived from one normalized
scrollProgress value.

============================================================
SCROLL SYSTEM
============================================================

Use Lenis for smooth scrolling.

Use GSAP ScrollTrigger to synchronize scroll progress.

Create:

useScrollProgress()

It should expose:

progress
velocity
direction

Then map:

scroll progress
↓
camera Z
↓
scene positions
↓
object scale
↓
opacity
↓
blur
↓
platform transitions

The experience must remain reversible.

If the user scrolls downward and then upward,
the animation must naturally reverse.

Do NOT create independent "enter" and "exit" animations
that become inconsistent when the user reverses scroll.

============================================================
CAMERA
============================================================

Use a PerspectiveCamera.

Recommended starting values:

FOV: 55-70
near: 0.1
far: 1000

Camera should remain mostly centered.

The illusion of movement should come from moving the camera
through the scene.

Do not simply scale the entire website.

The user should feel genuine depth.

Add very subtle camera movement:

- small vertical drift
- tiny horizontal drift
- subtle rotation

These movements should be deterministic and tied to scroll progress.

Avoid motion sickness.

============================================================
SCENE OBJECT MODEL
============================================================

Create reusable components:

<MemoryScene />
<FloatingObject />
<FloatingFragment />
<Platform />
<SceneTitle />
<DepthText />
<ProjectCarousel />
<ParticleField />
<Atmosphere />
<HUD />

Every scene should have a configurable Z position.

Example:

<MemoryScene z={-50}>
   ...
</MemoryScene>

Objects should support:

position
rotation
scale
opacity
depth
parallaxFactor

============================================================
DEPTH EFFECT
============================================================

The visual language depends heavily on depth.

For an object:

distance = objectZ - cameraZ

Use distance to influence:

scale
opacity
blur
rotation
brightness

Far objects:

- smaller
- dimmer
- slightly blurred
- less saturated

Near objects:

- larger
- sharper
- brighter
- more visually dominant

Objects passing the camera can disappear behind it.

Do NOT simply use opacity to fake all depth.

Perspective should do most of the work.

============================================================
FLOATING GEOMETRY
============================================================

Create a procedural field of floating objects.

Object types:

- triangular planes
- rectangular planes
- thin boxes
- cubes
- fragmented polygons
- small particles

Randomize:

position
rotation
scale
depth

BUT use a seeded random generator.

The environment must be deterministic between renders.

Objects should have subtle independent movement:

rotation += slow drift
position += sinusoidal movement

Movement must remain subtle.

The environment should feel like fragments suspended in space.

============================================================
ATMOSPHERE
============================================================

Create a large foggy environment.

Use:

Three.js FogExp2 or equivalent.

Suggested initial direction:

cool white/blue-gray environment.

Add:

- soft fog
- vignette
- subtle bloom if performance allows
- very subtle grain
- soft lighting

Do not make the page look like a cyberpunk neon website.

The atmosphere should be:

white
gray
desaturated blue
minimal
cinematic

============================================================
OPENING SEQUENCE
============================================================

On initial load:

show an empty environment.

Display:

SYNCHRONIZING

Implement a subtle flickering effect.

Example sequence:

SYNCHRONIZING
SYNCHRONIZI\_
SYNCHRONIZING
SYNC
SYNCHRONIZING

After approximately 1.5–2.5 seconds:

show:

MUHAMMAD FIKRI

and:

MACHINE LEARNING ENGINEER • AI RESEARCHER • SOFTWARE ENGINEERING

Then transition into the interactive state.

Important:

The intro must NOT lock the user into a long animation.

If the user scrolls immediately,
allow the scroll to influence the transition.

Respect prefers-reduced-motion.

============================================================
HERO
============================================================

Hero should contain:

MUHAMMAD FIKRI

MACHINE LEARNING ENGINEER • AI RESEARCHER • SOFTWARE ENGINEERING

SCROLL TO ENTER

The hero exists inside the 3D environment.

The name should feel physically located in space.

As the user scrolls toward it:

text becomes larger.

Eventually the text becomes so large that it passes through
the viewport.

The next scene should already exist behind it.

This creates the illusion of traveling through the title.

============================================================
PLATFORM SYSTEM
============================================================

Create a floating platform at the center of each major scene.

Platform structure:

- rectangular solid
- subtle bevel
- matte light-gray material
- soft shadow
- subtle ambient lighting

The platform represents the user's current location.

When moving forward:

CURRENT PLATFORM:
moves backward/downward.

NEXT PLATFORM:
emerges from below.

Then:

NEXT PLATFORM becomes centered.

The transition should feel like:

platform A
↓
camera moves forward
↓
platform B rises from below
↓
platform B becomes current
↓
platform A falls into distance

The platform motion must be synchronized with camera progress,
not triggered by discrete scroll events.

============================================================
CHARACTER / AVATAR
============================================================

Create a placeholder avatar system.

Do NOT require a final 3D character model yet.

Use a placeholder silhouette / simple humanoid geometry
standing on the platform.

Make it easy to replace later with:

- GLB/GLTF model
- user portrait
- custom 3D character

The avatar should remain subtle.

It should feel like a person standing in the environment.

============================================================
SCENE 01 — ABOUT
============================================================

Title:

01 / ABOUT

Content:

Short personal introduction.

Additional metadata:

EDUCATION
FOCUS
INTERESTS

Do not create a normal card grid.

Use floating text panels.

Some information should enter from:

- left
- right
- far background

while still respecting the main camera movement.

============================================================
SCENE 02 — SKILLS
============================================================

Create a 3D skill constellation.

Skills include examples such as:

Python
PyTorch
TensorFlow
JavaScript
TypeScript
React
Laravel
Node.js
Docker
Linux
Git
SQL
Machine Learning
Computer Vision
Data Science
Deep Learning
1D-CNN
ConvLSTM

Place them in 3D space.

The currently focused skill should be larger.

Others should exist deeper in space.

============================================================
SCENE 03 — PROJECTS
============================================================

Create a 3D project carousel.

This should behave like a video-game character selection interface.

Projects are arranged along a shallow 3D curve.

Example:

            PROJECT 02
               |

PROJECT 01 --- CENTER --- PROJECT 03
|
PROJECT 04

The center project is:

- larger
- sharper
- brighter
- fully readable

Side projects:

- smaller
- rotated
- lower opacity
- deeper in Z space

Scrolling moves the camera and naturally changes which
project occupies the center.

Do NOT make a normal horizontal slider.

The carousel should feel like objects physically existing in space.

Each project contains:

project number
title
description
technologies
image/preview
GitHub button
Live Demo button

============================================================
EXPERIENCE
============================================================

Create spatial milestones.

============================================================
CONTACT
============================================================

Final scene:

LET'S BUILD SOMETHING.

Display:

Muhammad Fikri

Email
GitHub
LinkedIn

The environment should become slightly brighter.

The final scene should feel like reaching the end of the corridor.

============================================================
HUD
============================================================

Create a minimal persistent HUD.

Example:

MEMORY 03 / 06

and:

01 ABOUT
02 SKILLS
03 PROJECTS
04 EXPERIENCE
05 CONTACT

The HUD should be subtle.

It should not dominate the visual experience.

Add a small scroll progress indicator.

============================================================
TRANSITION DESIGN
============================================================

IMPORTANT:

Never use abrupt:

display: none
display: block

for major scenes.

Scenes should exist simultaneously in the world.

The transition is caused by physical distance.

For example:

Scene A:
z = -20

Scene B:
z = -60

As camera moves from:

cameraZ = -10
to
cameraZ = -70

Scene A naturally gets closer and then moves behind camera.

Scene B naturally approaches.

This is the core illusion.

============================================================
PERFORMANCE
============================================================

This is critical.

The website must remain performant.

Implement:

- instanced meshes for repeated particles/geometries
- limited geometry complexity
- lazy loading of project images
- compressed textures
- device pixel ratio cap
- avoid unnecessary React rerenders
- use refs for animation state
- animate Three.js objects directly
- avoid storing per-frame animation state in React state

Target:

60 FPS on a modern desktop.

Provide reduced-motion fallback.

On mobile:

- reduce particles
- reduce floating fragments
- reduce post-processing
- simplify geometry
- reduce DPR

============================================================
RESPONSIVE
============================================================

Desktop:
full 3D experience.

Tablet:
moderate depth.

Mobile:
simplified 3D experience.

The core concept must remain:

scroll = camera movement.

Do not fall back to a generic stacked portfolio unless WebGL
is completely unavailable.

============================================================
ACCESSIBILITY
============================================================

All important content must exist as semantic HTML.

Interactive elements must be keyboard accessible.

Provide:

prefers-reduced-motion

For reduced motion:

replace continuous camera movement with simpler transitions
while keeping all content accessible.

============================================================
CODE QUALITY
============================================================

Use a clean architecture.

Suggested:

src/
components/
experience/
MemoryWorld.tsx
CameraRig.tsx
FloatingObject.tsx
FloatingFragments.tsx
Platform.tsx
ParticleField.tsx
Atmosphere.tsx

    scenes/
      IntroScene.tsx
      HeroScene.tsx
      AboutScene.tsx
      SkillsScene.tsx
      ProjectsScene.tsx
      ExperienceScene.tsx
      ContactScene.tsx

    ui/
      HUD.tsx
      SceneTitle.tsx
      ScrollIndicator.tsx
      ProjectInfo.tsx

data/
scenes.ts
projects.ts
skills.ts

hooks/
useScrollProgress.ts
useReducedMotion.ts

styles/

Keep all portfolio content in data files.

Do not hardcode content directly inside animation logic.

============================================================
IMPORTANT IMPLEMENTATION RULE
============================================================

Before writing code:

1. Analyze the existing project.
2. Identify current framework and dependencies.
3. Reuse existing infrastructure where possible.
4. Do not unnecessarily rewrite the entire application.
5. Install only required dependencies.
6. Build the experience incrementally.

First implement:

PHASE 1:
camera + scroll + infinite environment

PHASE 2:
hero + intro

PHASE 3:
platform system

PHASE 4:
about + skills

PHASE 5:
3D project carousel

PHASE 6:
experience + contact

PHASE 7:
performance + responsive + accessibility

After each phase, verify that the application still runs.

============================================================
MOST IMPORTANT DESIGN PRINCIPLE
============================================================

The result should NOT feel like:

"portfolio website with some 3D effects."

It should feel like:

"A 3D world that happens to contain a portfolio."

The user is physically traveling through the portfolio.

Scrolling is the camera.

Content is architecture.

Platforms are locations.

Projects are artifacts.

Floating fragments are environmental elements.

Typography is part of the environment.

The entire experience should feel cinematic, spatial, mysterious,
minimal, and technologically sophisticated.

Commit after completing each phases and let me decide to continue
