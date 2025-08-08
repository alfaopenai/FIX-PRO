# Fix Pro - Logistics Desktop Application

## סקירה כללית
אפליקציה שולחנית לניהול לוגיסטיקה שנבנתה עם Tauri ו-React.

## קבצי האפליקציה

### קובץ EXE עצמאי
- **מיקום**: `src-tauri/target/release/fix-pro-logistics.exe`
- **גודל**: ~8.2MB
- **שימוש**: הפעלה ישירה ללא התקנה

### קבצי התקנה
- **NSIS Setup**: `src-tauri/target/release/bundle/nsis/logistics-app_0.1.0_x64-setup.exe` (~2.0MB)
- **MSI Installer**: `src-tauri/target/release/bundle/msi/logistics-app_0.1.0_x64_en-US.msi` (~2.9MB)

## פיתוח

### דרישות מערכת
- Node.js 18+
- Rust 1.77+
- Windows 10/11 (עבור בנייה)

### התקנה
```bash
npm install
```

### פיתוח
```bash
# פיתוח ווב בלבד
npm run dev

# פיתוח אפליקציה שולחנית
npm run tauri:dev

# בנייה ופיתוח שולחני
npm run desktop:dev
```

### בנייה
```bash
# בנייה לווב
npm run build

# בנייה לאפליקציה שולחנית
npm run tauri:build

# בנייה מלאה
npm run desktop:build
```

## תכונות האפליקציה השולחנית

- **חלון מותאם**: 1200x800 פיקסלים עם גודל מינימלי של 800x600
- **מרכזי**: החלון נפתח במרכז המסך
- **ניתן לשינוי גודל**: עם גבולות מינימליים
- **עיצוב מודרני**: עם תמיכה ב-Tailwind CSS ו-Radix UI

## מבנה הפרויקט

```
fix-pro-e8af1585/
├── src/                    # קוד React
├── src-tauri/             # קוד Rust של Tauri
│   ├── src/
│   ├── tauri.conf.json    # הגדרות Tauri
│   └── Cargo.toml         # תלויות Rust
├── dist/                  # קבצי בנייה של ווב
└── package.json           # תלויות Node.js
```

## פתרון בעיות

### שגיאת "cargo not found"
התקן Rust:
```bash
winget install Rustlang.Rust.MSVC
# או
Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe
.\rustup-init.exe --default-toolchain stable --profile default -y
```

### שגיאת "identifier not unique"
שנה את המזהה ב-`src-tauri/tauri.conf.json`:
```json
"identifier": "com.yourcompany.yourapp"
```

## הפצה

הקבצים מוכנים להפצה נמצאים ב:
- `src-tauri/target/release/fix-pro-logistics.exe` - קובץ עצמאי
- `src-tauri/target/release/bundle/` - קבצי התקנה

## רישיון
MIT License 