# 👨‍💻 Примеры кода для разработчиков

## Импорт функций

```typescript
import {
  getDailyLeaderboard,
  addDailyResult,
  getCurrentPlayerRank,
  getTimeUntilReset,
  getLeaderboardDateFormatted,
  setPlayerName,
  getPlayerName,
  getOrCreatePlayerId,
  clearDailyLeaderboard,
  DailyLeaderboardEntry,
} from '../utils/dailyLeaderboard';
```

---

## 1️⃣ Получить текущий рейтинг

### Пример 1: Простой вывод топ-10
```typescript
import { getDailyLeaderboard } from '../utils/dailyLeaderboard';

const MyLeaderboard = () => {
  const leaderboard = getDailyLeaderboard();
  
  return (
    <div>
      {leaderboard.map((entry, index) => (
        <div key={entry.userId}>
          <span>#{entry.rank}</span>
          <span>{entry.name}</span>
          <span>{entry.totalScore} очков</span>
        </div>
      ))}
    </div>
  );
};
```

### Пример 2: С автоматическим обновлением
```typescript
import { useEffect, useState } from 'react';
import { getDailyLeaderboard } from '../utils/dailyLeaderboard';

const LiveLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    // Обновлять каждые 3 секунды
    const interval = setInterval(() => {
      const updated = getDailyLeaderboard();
      setLeaderboard(updated);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div>
      {leaderboard.map((entry) => (
        <div key={entry.userId} className="border p-4">
          <h3>{entry.name}</h3>
          <p>Место: {entry.rank}</p>
          <p>Очки: {entry.totalScore}</p>
          <p>Попыток: {entry.attemptsCount}</p>
          <p>Лучший результат: {entry.bestScore}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 2️⃣ Добавить результат в рейтинг

### Пример 1: Простое добавление
```typescript
import { addDailyResult } from '../utils/dailyLeaderboard';

// После завершения викторины
const score = 150;
addDailyResult(score);
```

### Пример 2: С именем игрока
```typescript
import { addDailyResult } from '../utils/dailyLeaderboard';

const playerName = "Мой никнейм";
const score = 200;

addDailyResult(score, playerName);
```

### Пример 3: В компоненте ResultScreen
```typescript
import { useEffect } from 'react';
import { addDailyResult, getPlayerName } from '../utils/dailyLeaderboard';

const ResultScreen = ({ totalScore, onQuit }) => {
  // Автоматически добавить результат при загрузке
  useEffect(() => {
    if (totalScore > 0) {
      const playerName = getPlayerName();
      addDailyResult(totalScore, playerName);
    }
  }, []);
  
  return (
    <div>
      <h2>Результат: {totalScore} очков</h2>
      <p>✅ Результат добавлен в ежедневный рейтинг!</p>
      <button onClick={onQuit}>Вернуться в меню</button>
    </div>
  );
};
```

---

## 3️⃣ Получить позицию текущего игрока

### Пример 1: Простая проверка
```typescript
import { getCurrentPlayerRank } from '../utils/dailyLeaderboard';

const MyRank = () => {
  const myRank = getCurrentPlayerRank();
  
  if (!myRank) {
    return <p>Вы еще не в топ-10</p>;
  }
  
  return (
    <div>
      <h2>Ваше место: #{myRank.rank}</h2>
      <p>Очки: {myRank.totalScore}</p>
    </div>
  );
};
```

### Пример 2: С визуализацией
```typescript
import { getCurrentPlayerRank } from '../utils/dailyLeaderboard';

const PlayerRankBadge = () => {
  const myRank = getCurrentPlayerRank();
  
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}️⃣`;
  };
  
  return (
    <div className="badge">
      {myRank && (
        <>
          <span>{getMedalEmoji(myRank.rank)}</span>
          <span>{myRank.name}</span>
          <span>{myRank.totalScore}</span>
        </>
      )}
    </div>
  );
};
```

---

## 4️⃣ Получить время до сброса

### Пример 1: Простой отсчет
```typescript
import { getTimeUntilReset } from '../utils/dailyLeaderboard';

const ResetTimer = () => {
  const time = getTimeUntilReset();
  
  return (
    <div>
      <p>
        Сброс через: {time.hours}ч {time.minutes}м {time.seconds}с
      </p>
    </div>
  );
};
```

### Пример 2: С обновлением каждую секунду
```typescript
import { useEffect, useState } from 'react';
import { getTimeUntilReset } from '../utils/dailyLeaderboard';

const LiveTimer = () => {
  const [time, setTime] = useState(getTimeUntilReset());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilReset());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="timer">
      ⏱️ {String(time.hours).padStart(2, '0')}:
      {String(time.minutes).padStart(2, '0')}:
      {String(time.seconds).padStart(2, '0')}
    </div>
  );
};
```

### Пример 3: Форматированный таймер
```typescript
import { useEffect, useState } from 'react';
import { getTimeUntilReset } from '../utils/dailyLeaderboard';

const FormattedTimer = () => {
  const [displayTime, setDisplayTime] = useState('');
  
  useEffect(() => {
    const update = () => {
      const time = getTimeUntilReset();
      const formatted = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formatted);
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return <span className="mono">{displayTime}</span>;
};
```

---

## 5️⃣ Управление именем игрока

### Пример 1: Установить имя
```typescript
import { setPlayerName, getPlayerName } from '../utils/dailyLeaderboard';

const PlayerNameInput = () => {
  const [name, setName] = useState(getPlayerName());
  
  const handleSave = () => {
    setPlayerName(name);
  };
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите имя..."
      />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};
```

### Пример 2: Получить текущее имя
```typescript
import { getPlayerName } from '../utils/dailyLeaderboard';

const PlayerGreeting = () => {
  const name = getPlayerName();
  return <h1>Привет, {name}!</h1>;
};
```

---

## 6️⃣ Получить/Создать ID игрока

### Пример: Показать уникальный ID
```typescript
import { getOrCreatePlayerId } from '../utils/dailyLeaderboard';

const PlayerInfo = () => {
  const playerId = getOrCreatePlayerId();
  
  return (
    <div>
      <p>ID вашего браузера:</p>
      <code>{playerId}</code>
    </div>
  );
};
```

---

## 7️⃣ Получить дату в красивом формате

### Пример: Отображение даты рейтинга
```typescript
import { getLeaderboardDateFormatted } from '../utils/dailyLeaderboard';

const LeaderboardHeader = () => {
  const date = getLeaderboardDateFormatted();
  
  return <h2>Рейтинг на {date}</h2>;
};
```

---

## 8️⃣ Очистить рейтинг (отладка)

### Пример: Кнопка для разработчиков
```typescript
import { clearDailyLeaderboard } from '../utils/dailyLeaderboard';

const DevTools = () => {
  return (
    <button onClick={clearDailyLeaderboard}>
      🗑️ Очистить рейтинг (для отладки)
    </button>
  );
};
```

---

## 🎯 Комплексный пример: Полная страница рейтинга

```typescript
import React, { useEffect, useState } from 'react';
import {
  getDailyLeaderboard,
  getCurrentPlayerRank,
  getTimeUntilReset,
  getLeaderboardDateFormatted,
  addDailyResult,
  setPlayerName,
  getPlayerName,
  DailyLeaderboardEntry,
} from '../utils/dailyLeaderboard';

const CompleteLeaderboardPage = ({ score, onBack }) => {
  const [leaderboard, setLeaderboard] = useState<DailyLeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [time, setTime] = useState(getTimeUntilReset());
  const [playerName, setPlayerNameLocal] = useState(getPlayerName());
  const [showNameInput, setShowNameInput] = useState(false);
  
  // Загрузить данные
  useEffect(() => {
    const refresh = () => {
      setLeaderboard(getDailyLeaderboard());
      setPlayerRank(getCurrentPlayerRank());
      setTime(getTimeUntilReset());
    };
    
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Сохранить результат
  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    
    setPlayerName(playerName.trim());
    addDailyResult(score, playerName.trim());
    
    // Обновить данные
    setLeaderboard(getDailyLeaderboard());
    setPlayerRank(getCurrentPlayerRank());
    setShowNameInput(false);
  };
  
  return (
    <div className="leaderboard-page">
      {/* Заголовок с датой и временем */}
      <div className="header">
        <h1>🏆 Ежедневный Рейтинг</h1>
        <p>📅 {getLeaderboardDateFormatted()}</p>
        <p>⏱️ {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}</p>
      </div>
      
      {/* Текущий результат игрока */}
      <div className="current-score">
        <h3>Ваш результат: {score}</h3>
        {!showNameInput ? (
          <button onClick={() => setShowNameInput(true)}>
            💾 Сохранить в рейтинг
          </button>
        ) : (
          <div>
            <input
              value={playerName}
              onChange={(e) => setPlayerNameLocal(e.target.value)}
              placeholder="Имя..."
            />
            <button onClick={handleSaveScore}>Сохранить</button>
            <button onClick={() => setShowNameInput(false)}>Отмена</button>
          </div>
        )}
      </div>
      
      {/* Таблица лидеров */}
      <div className="leaderboard">
        <h2>Топ-10 за 24 часа</h2>
        {leaderboard.length === 0 ? (
          <p>Рейтинг еще пуст</p>
        ) : (
          <table>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.userId}
                  className={playerRank?.userId === entry.userId ? 'current' : ''}
                >
                  <td className="rank">#{entry.rank}</td>
                  <td className="name">{entry.name}</td>
                  <td className="score">{entry.totalScore}</td>
                  <td className="attempts">{entry.attemptsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <button onClick={onBack}>← Назад</button>
    </div>
  );
};

export default CompleteLeaderboardPage;
```

---

## 🔍 Полезные JavaScript команды для консоли

```javascript
// Посмотреть весь рейтинг
JSON.parse(localStorage.getItem('eduplay_daily_leaderboard'))

// Посмотреть только записи
JSON.parse(localStorage.getItem('eduplay_daily_leaderboard')).entries

// Посмотреть вашего ID
localStorage.getItem('eduplay_player_id')

// Посмотреть ваше имя
localStorage.getItem('eduplay_player_name')

// Посмотреть дату рейтинга
JSON.parse(localStorage.getItem('eduplay_daily_leaderboard')).date

// Очистить рейтинг
localStorage.removeItem('eduplay_daily_leaderboard')

// Очистить всё
localStorage.clear()
```

---

## 📝 Шаблоны компонентов

### Минималистичный компонент рейтинга
```typescript
import { getDailyLeaderboard } from '../utils/dailyLeaderboard';

const SimpleLeaderboard = () => {
  const leaderboard = getDailyLeaderboard();
  
  return (
    <ul>
      {leaderboard.map((entry) => (
        <li key={entry.userId}>
          #{entry.rank} - {entry.name}: {entry.totalScore}
        </li>
      ))}
    </ul>
  );
};
```

### Красивый компонент рейтинга с стилями
```typescript
import { getDailyLeaderboard, getCurrentPlayerRank } from '../utils/dailyLeaderboard';

const StyledLeaderboard = () => {
  const leaderboard = getDailyLeaderboard();
  const myRank = getCurrentPlayerRank();
  
  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#999';
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>🏆 Топ-10</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: myRank?.userId === entry.userId ? '#d4f1d4' : '#f0f0f0',
              borderRadius: '8px',
              borderLeft: `4px solid ${getMedalColor(entry.rank)}`,
            }}
          >
            <span>#{entry.rank} {entry.name}</span>
            <strong>{entry.totalScore}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🚀 Интеграция с вашими компонентами

### Как добавить в существующий компонент
```typescript
// Было раньше
import { Button, Card } from '../components';

// Добавляем импорт для рейтинга
import {
  getDailyLeaderboard,
  addDailyResult,
} from '../utils/dailyLeaderboard';

// Используем в useEffect
useEffect(() => {
  if (quizComplete) {
    addDailyResult(finalScore, playerName);
  }
}, [quizComplete]);
```

---

**Версия:** 1.0  
**Последнее обновление:** Апрель 2024  
**Уровень:** Для разработчиков 👨‍💻
