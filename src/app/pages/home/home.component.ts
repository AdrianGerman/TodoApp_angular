import {
  Component,
  signal,
  computed,
  effect,
  inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], //mandamos los imports a nuestro archivo html
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  editedTaskIndex: number | null = null;

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  injector = inject(Injector);

  constructor() {}

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
    document.addEventListener('click', this.documentClickHandler.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.documentClickHandler.bind(this));
  }

  documentClickHandler(event: Event) {
    const target = event.target as HTMLElement;

    const isOutsideEditedTask = !target.closest('.editing');

    if (isOutsideEditedTask && this.editedTaskIndex !== null) {
      this.tasks.update((prevState) => {
        return prevState.map((task, index) => {
          if (index === this.editedTaskIndex) {
            return {
              ...task,
              editing: false,
            };
          }
          return task;
        });
      });
      this.editedTaskIndex = null;
    }
  }

  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      { injector: this.injector }
    );
  }

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  updateTaskEditingMode(index: number) {
    this.editedTaskIndex = index;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index && !task.completed) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        }
        return {
          ...task,
          text: true,
        };
      });
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }

  clearCompletedTasks() {
    this.tasks.update((tasks) => tasks.filter((task) => !task.completed));
  }
}
