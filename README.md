# Smart Bears

A small drawing application for children, built with Expo and React Native. The app downloads drawing tasks from a companion Laravel API and lets users paint over them on a touch-friendly canvas.

## Features

- Task-image retrieval from the companion API
- Drawing with React Native Skia
- Configurable colors and stroke widths
- Undo and canvas reset
- Saving completed drawings to the device gallery
- Expo Router navigation and typed routes
- Android, iOS, and web targets through Expo

## Technology

- Expo 52
- React Native 0.76
- TypeScript
- Expo Router
- React Native Skia
- React Native Gesture Handler and Reanimated

## Development

```bash
npm install
npx expo start
```

The API base URL is currently configured in `hooks/useTaskImages.ts`. The companion backend is available in [smartbearsapi](https://github.com/vcastroglez/smartbearsapi).

## Status

Personal project and experimental application.
