# Logistics Management App

אפליקציה לניהול לוגיסטיקה ומשלוחים הבנויה עם React ו-Vite.

## תכונות עיקריות

- ניהול לקוחות
- מעקב אחר הזמנות
- ניהול משלוחים ומטענים
- מערכת הודעות
- לוח בקרה עם סטטיסטיקות
- הגדרות מערכת

## הרצת האפליקציה

```bash
npm install
npm run dev
```

## בניית האפליקציה לייצור

```bash
npm run build
```

## פיתוח

האפליקציה משתמשת ב-localStorage לשמירת נתונים מקומיים במצב דמו.
בסביבת ייצור, יש להחליף את שכבת ה-API להתחבר לשרת אמיתי.

### מבנה הפרויקט

- `src/api/` - שכבת API וניהול נתונים
- `src/components/` - רכיבי React
- `src/pages/` - עמודי האפליקציה
- `src/hooks/` - Custom hooks
- `src/lib/` - כלי עזר

## טכנולוגיות

- React 18
- Vite
- Tailwind CSS
- Radix UI
- Lucide React Icons
- React Router DOM