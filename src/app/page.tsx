"use client";
import { useState, useEffect } from 'react';

interface Task {
  description: string;
  xp: number;
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
      setTasks([...tasks, { description: newTask, xp: newTaskXp }]);
      setNewTask('');
      setNewTaskXp(0);
    }
  };

  const removeTask = (index: number) => {
    const taskXp = tasks[index].xp;
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setXp(xp + taskXp); // Add XP for completing a task
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 bg-gray-100 text-gray-950">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Life RPG</h1>
        <nav>
          <a href="#" className="mr-4">Home</a>
          <a href="#">Profile</a>
        </nav>
      </header>
      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <div className="flex flex-col sm:flex-row mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task"
              className="border p-2 mr-2 mb-2 sm:mb-0"
            />
            <input
              type="number"
              value={newTaskXp}
              onChange={(e) => setNewTaskXp(parseInt(e.target.value, 10))}
              placeholder="XP"
              className="border p-2 mr-2 mb-2 sm:mb-0"
            />
            <button onClick={addTask} className="bg-blue-500 text-white p-2">Add Task</button>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="mb-2 flex justify-between items-center bg-white p-4 rounded shadow">
                <span>{task.description} - {task.xp} XP</span>
                <button onClick={() => removeTask(index)} className="bg-red-500 text-white p-2 rounded">Complete</button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">XP</h2>
          <p>{xp} XP</p>
          <p>Level: {level}</p>
          <p>XP for next level: {xpForNextLevel - xp}</p>
        </section>
      </main>
    </div>
  );
}
