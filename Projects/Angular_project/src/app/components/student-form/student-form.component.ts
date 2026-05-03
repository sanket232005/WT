import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId?: number;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      course: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.studentId = Number(idParam);
      const student = this.studentService.getById(this.studentId);
      
      if (student) {
        this.studentForm.patchValue({
          name: student.name,
          age: student.age,
          course: student.course,
          email: student.email
        });
      } else {
        this.snackBar.open('Student not found!', 'Close', { duration: 3000 });
        this.router.navigate(['/students']);
      }
    }
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      
      if (this.isEditMode && this.studentId) {
        const updatedStudent: Student = {
          id: this.studentId,
          ...formValue
        };
        this.studentService.update(updatedStudent);
        this.snackBar.open('Student updated successfully!', 'Close', { duration: 3000 });
      } else {
        this.studentService.add(formValue);
        this.snackBar.open('Student added successfully!', 'Close', { duration: 3000 });
      }
      
      this.router.navigate(['/students']);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
