# CRT 期待値 = CRT 発生率% × CRT 倍率% + (100% - CRT 発生率%) × 100% グラフアプリケーション

Chart.js を使用した CRT 期待値計算のグラフを表示する SPA（Single Page Application）です。

## バージョン

### React 版（推奨）

- **技術スタック**: React 18 + TypeScript + Vite + Tailwind CSS + Chart.js
- **特徴**: モダンなコンポーネントベースアーキテクチャ、型安全性、レスポンシブデザイン

### Vanilla 版

- **技術スタック**: Vanilla JavaScript + Chart.js + CSS3
- **特徴**: 軽量、依存関係なし

## 機能

- **リアルタイムグラフ表示**: CRT 発生率と CRT 倍率を調整すると、グラフがリアルタイムで更新されます
- **直感的な操作**: スライダーとテキストボックスの両方で CRT 発生率と CRT 倍率を調整できます
- **CRT 期待値の表示**: 現在の CRT 発生率と CRT 倍率での CRT 期待値をリアルタイムで表示します
- **レスポンシブデザイン**: モバイルデバイスでも快適に使用できます

## 使用方法

### React 版の起動

1. 依存関係をインストール:

```bash
npm install
```

2. 開発サーバーを起動:

```bash
npm run dev
```

3. ブラウザで `http://localhost:3000` を開きます

### Vanilla 版の起動

1. `index.html`をブラウザで開きます

## 操作方法

1. CRT 発生率と CRT 倍率のスライダーまたはテキストボックスを調整してグラフの変化を確認します
2. グラフ上の赤い点が現在選択されている CRT 倍率での CRT 期待値を示します

## キーボードショートカット

- **←/→**: CRT 倍率を調整（1 刻み）
- **Ctrl + ←/→**: CRT 発生率を調整（1 刻み）
- **Shift + ←/→**: CRT 発生率と CRT 倍率を調整（10 刻み）
- **ダブルクリック**: CRT 発生率と CRT 倍率をデフォルト値（CRT 発生率=50%, CRT 倍率=150%）にリセット

## 技術仕様

### React 版

- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **グラフライブラリ**: Chart.js + react-chartjs-2
- **開発環境**: ホットリロード対応、型チェック

### Vanilla 版

- **フレームワーク**: なし（Vanilla JavaScript）
- **グラフライブラリ**: Chart.js
- **スタイリング**: CSS3（レスポンシブデザイン対応）

## ファイル構成

### React 版

```
p5x/
├── src/
│   ├── components/
│   │   ├── CRTExpectationCalculator.tsx
│   │   ├── ParameterControls.tsx
│   │   ├── FormulaDisplay.tsx
│   │   ├── CRTChart.tsx
│   │   └── InfoPanel.tsx
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

### Vanilla 版

```
p5x/
├── index.html      # メインのHTMLファイル
├── script.js       # JavaScriptロジック
└── README.md       # このファイル
```

## 計算式

CRT 期待値 = CRT 発生率% × CRT 倍率% + (100% - CRT 発生率%) × 100%

- **CRT 発生率**: CRT 発生確率（0%～ 100%）
- **CRT 倍率**: CRT 倍率（150%～ 300%）
- **CRT 期待値**: 期待値（%）

## ブラウザ対応

- Chrome（推奨）
- Firefox
- Safari
- Edge

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
