"use client";
import { useState, useEffect } from 'react';

interface Task {
  description: string;
  xp: number;
  repeatDays: string[];
}

const calculateLevel = (xp: number) => {
  let level = 1;
  let xpForNextLevel = 100;
  while (xp >= xpForNextLevel) {
    xp -= xpForNextLevel;
    level++;
    xpForNextLevel += 100;
  }
  return { level, xpForNextLevel };
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskXp, setNewTaskXp] = useState(0);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpForNextLevel, setXpForNextLevel] = useState(100);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedXp = parseInt(localStorage.getItem('xp') || '0', 10);
    const { level, xpForNextLevel } = calculateLevel(savedXp);
    setTasks(savedTasks);
    setXp(savedXp);
    setLevel(level);
    setXpForNextLevel(xpForNextLevel);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('xp', xp.toString());
    const { level, xpForNextLevel } = calculateLevel(xp);
    setLevel(level);
    setXpForNextLevel(xpForNextLevel);
  }, [tasks, xp]);

  const addTask = () => {
    if (newTask.trim() && newTaskXp > 0) {
      setTasks([...tasks, { description: newTask, xp: newTaskXp, repeatDays }]);
      setNewTask('');
      setNewTaskXp(0);
      setRepeatDays([]);
    }
  };

  const removeTask = (index: number) => {
    const taskXp = tasks[index].xp;
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setXp(xp + taskXp); // Add XP for completing a task
    playSound();
  };

  const toggleRepeatDay = (day: string) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const playSound = () => {
    const audio = new Audio('/sounds/complete.mp3');
    audio.play();
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Life RPG</h1>
        <nav>
          <a href="#" className="mr-4 hover:underline">Home</a>
          <a href="#" className="hover:underline">Profile</a>
        </nav>
      </header>
      <main>
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Tasks</h2>
          <div className="flex flex-col sm:flex-row mb-4 text-gray-950">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task"
              className="border p-2 mr-2 mb-2 sm:mb-0 rounded"
            />
            <input
              type="number"
              value={newTaskXp}
              onChange={(e) => setNewTaskXp(parseInt(e.target.value, 10))}
              placeholder="XP"
              className="border p-2 mr-2 mb-2 sm:mb-0 rounded"
            />
            <button onClick={addTask} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add Task</button>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Repeat on:</label>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <label key={day} className="mr-2">
                <input
                  type="checkbox"
                  checked={repeatDays.includes(day)}
                  onChange={() => toggleRepeatDay(day)}
                  className="mr-1"
                />
                {day}
              </label>
            ))}
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="mb-2 flex justify-between items-center bg-white text-black p-4 rounded shadow">
                <span>{task.description} - {task.xp} XP</span>
                <span>Repeat on: {task.repeatDays.join(', ')}</span>
                <button onClick={() => removeTask(index)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Complete</button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-3xl font-semibold mb-4">XP</h2>
          <p>{xp} XP</p>
          <p>Level: {level}</p>
          <p>XP for next level: {xpForNextLevel - xp}</p>
        </section>
      </main>
    </div>
  );
}
