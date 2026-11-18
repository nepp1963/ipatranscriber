# IPA Generator

Build a professional web application called "IPA Transcriber".

The website converts English text into IPA (International Phonetic Alphabet) transcription in real time, similar to tophonetics.com.

TECH STACK
- React
- TypeScript
- Tailwind CSS
- Responsive Design
- Modern UI
- Fast performance
- Clean code structure

CORE FEATURES

1. TEXT INPUT
- Large text area for user input.
- Support short text or long paragraphs.
- Allow line breaks.
- Auto-expand if needed.
- Character counter.

2. REAL-TIME IPA TRANSCRIPTION
- Automatically convert text while the user types.
- No submit button required.
- Transcription updates instantly.

3. ACCENT SELECTION
Provide tabs or a segmented control for:
- American English (General American)
- British English (Received Pronunciation)

Switching accents immediately updates the transcription.

4. IPA OUTPUT PANEL
- Output displayed in a separate card.
- Read-only field.
- Beautiful IPA-friendly font.
- Preserve paragraph formatting.
- Display clear stress markers.
- Easy to read on desktop and mobile.

5. COPY FEATURE
- One-click "Copy IPA" button.
- Show toast message:
  "IPA copied successfully."

6. CLEAR BUTTON
- Clears both input and output.

7. DARK MODE
- Light mode
- Dark mode
- System mode detection

8. RESPONSIVE DESIGN
- Desktop
- Tablet
- Mobile

9. WORD COUNT
Display:
- Character count
- Word count

10. UNKNOWN WORD HANDLING
- Highlight words not found by the pronunciation engine.
- Show a warning icon.
- Tooltip:
  "Pronunciation unavailable."

11. HISTORY
- Save the last 20 transcription requests locally.
- No user account required.
- Show timestamps.
- Allow restoring previous text.

12. SETTINGS PANEL

Options:

☐ Show stress marks

☐ Show syllable breaks

☐ Preserve punctuation

☐ Highlight unknown words

☐ Auto-copy output

13. IMPORT / EXPORT

Buttons:

- Export IPA as TXT
- Export IPA as PDF
- Download transcription

14. ACCESSIBILITY

- Keyboard shortcuts
- Screen reader support
- High contrast support
- Proper ARIA labels

15. SEO

- Meta title:
  IPA Transcriber | English to IPA Converter

- Meta description:
  Convert English text into accurate IPA phonetic transcription using American or British pronunciation.

16. PERFORMANCE

- Debounce typing input
- Fast updates for large paragraphs
- Efficient state management

IPA ENGINE

Use an IPA conversion library such as:
- eng-to-ipa
or
- CMU Pronouncing Dictionary

Create the code in a way that the pronunciation engine can easily be swapped later.

BONUS FEATURES

A. AUDIO PRONUNCIATION
- Button to hear the pronunciation using Web Speech API.

B. WORD ANALYZER
Click a word to display:
- IPA transcription
- Number of syllables
- Primary stress
- Secondary stress

C. IPA LEGEND
Include a collapsible section explaining:
- Vowels
- Consonants
- Stress symbols

D. TEACHER MODE
Special mode for ESL teachers.

Teacher Mode displays:
- Original text
- IPA transcription
- Line-by-line view
- Word-by-word pronunciation assistance

E. STUDENT PRACTICE MODE
Students can:
- Enter a sentence
- Compare their transcription with the system transcription
- Receive correctness feedback

DESIGN STYLE

Use a clean modern educational design inspired by:
- Duolingo
- Grammarly
- Notion
- Modern SaaS dashboards

Colors:
- Primary: Indigo
- Accent: Cyan
- Neutral grays

Layout:
- Centered container
- Large hero section
- Rounded cards
- Soft shadows
- Smooth animations
- Professional typography

SITE STRUCTURE

Home Page

Header:
- Logo
- Theme switcher
- Settings

Main:
- Input panel
- IPA output panel
- Copy controls

Below:
- IPA legend
- Teacher Mode options
- History section

Footer:
- About
- Privacy
- Contact

Create production-quality code with excellent UI/UX and fully responsive layout.


Prioritize pronunciation accuracy for ESL learners and teachers. Display IPA using a high-quality phonetic font and ensure copied output retains all IPA symbols correctly across Windows, Android, iOS, and macOS devices.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ipatranscriber.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/920a06ac-f400-452d-810c-bf44cf2905f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
