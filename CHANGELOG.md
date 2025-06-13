# Changelog

All notable changes to the "How to Code for Dummies" project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] - 2025-01-06

### Added

#### Core Features
- **Interactive Code Challenge System** - Created a comprehensive client-side code evaluation framework
  - `assets/js/code-challenges.js` - New file containing the complete challenge engine
  - Supports HTML, CSS, and JavaScript code validation
  - Live code execution with sandboxed environment
  - Real-time syntax validation and feedback
  - Progress tracking using localStorage
  - Hint system with progressive guidance

#### UI/UX Enhancements
- **Code Editor Styling** - Added 176 lines of CSS for professional code editor interface
  - `.code-challenge-container` - Main container styling with shadow effects
  - `.code-editor` - Monaco-inspired editor styling with syntax highlighting support
  - `.output-section` - Live preview area for code results
  - `.feedback-section` - Styled validation messages and hints
  - Responsive design for mobile compatibility

#### Lesson Enhancements

##### Lesson 1: HTML Basics (154 lines added)
- Added "Practice Challenges" section with 4 interactive exercises:
  1. **Create a Paragraph** - Basic HTML element creation
  2. **Add a Heading** - Working with heading tags and structure
  3. **Create Interactive Elements** - Buttons and input fields with proper nesting
  4. **Build a Quiz Question** - Complete HTML structure matching the final project
- Integrated challenge system with progressive difficulty
- Added navigation link to challenges section

##### Lesson 2: CSS Styling (162 lines added)
- Added "Practice Challenges" section with 4 interactive exercises:
  1. **Change Text Color** - Basic CSS property application
  2. **Style a Button** - Multiple CSS properties (background, color, padding)
  3. **Use Class Selectors** - Understanding CSS class targeting
  4. **Style Quiz Buttons** - Advanced styling with hover effects and border-radius
- Live preview of CSS changes in real-time
- Added navigation link to challenges section

##### Lesson 3: JavaScript Basics (170 lines added)
- Added "Practice Challenges" section with 4 interactive exercises:
  1. **Create Variables** - Variable declaration with let/const/var
  2. **Write a Function** - Function creation and console.log usage
  3. **If Statement** - Conditional logic implementation
  4. **Quiz Score Calculator** - Complete function with parameters and return values
- Safe JavaScript execution with console output capture
- Added navigation link to challenges section

### Changed
- Updated navigation structure in all lesson files to include "Practice Challenges" links
- Modified lesson flow to include hands-on practice before final projects

### Technical Improvements
- Implemented regex-based code validation for accurate checking
- Created reusable validator functions for common patterns
- Added tab key support in code editors
- Implemented iframe sandboxing for HTML/CSS preview
- Safe JavaScript execution using Function constructor with custom console

### Infrastructure
- All changes are 100% client-side compatible for GitHub Pages hosting
- No external dependencies beyond existing Bootstrap and jQuery
- Maintains compatibility with existing lesson structure

## [1.0.0] - 2025-01-06

### Added
- Initial project structure
- 7 lesson files covering HTML, CSS, and JavaScript
- Main index page with lesson navigation
- Bootstrap-based responsive design
- CSS animations and styling
- README.md with project overview
- .gitignore for web development projects
- .gitkeep files for empty directories (images/, js/)