module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  css: [
    './src/styles/home.css',
    './src/styles/shared-layout.css'
  ],
  output: './src/styles/purged/',
  safelist: {
    standard: [
      /^sl_/,
      /^home-/,
      /^ant-/
    ],
    deep: [],
    greedy: [
      /^home-.*$/,
      /^sl_.*$/,
      /^ant-.*$/
    ]
  },
  // Aktivieren Sie diese Optionen nach Bedarf
  fontFace: true,
  keyframes: true,
  variables: true,
  rejected: true, // Um ungenutzte Selektoren zu sehen
  rejectedCss: true // Um ungenutzten CSS-Code zu sehen
}