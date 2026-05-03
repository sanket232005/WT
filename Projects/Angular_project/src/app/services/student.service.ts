import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly STORAGE_KEY = 'students_data';
  private studentsSubject = new BehaviorSubject<Student[]>(this.loadFromStorage());
  students$ = this.studentsSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Student[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(students: Student[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
    this.studentsSubject.next(students);
  }

  getAll(): Student[] {
    return this.studentsSubject.getValue();
  }

  getById(id: number): Student | undefined {
    return this.getAll().find(s => s.id === id);
  }

  add(student: Omit<Student, 'id'>): void {
    const students = this.getAll();
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent = { ...student, id: newId };
    this.saveToStorage([...students, newStudent]);
  }

  update(updatedStudent: Student): void {
    const students = this.getAll();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      this.saveToStorage([...students]);
    }
  }

  delete(id: number): void {
    const students = this.getAll().filter(s => s.id !== id);
    this.saveToStorage(students);
  }

  search(term: string): Student[] {
    const lowerTerm = term.toLowerCase();
    return this.getAll().filter(s => s.name.toLowerCase().includes(lowerTerm));
  }
}
