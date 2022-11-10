import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Workout } from '@app/health/shared/services/workouts.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router, RouterModule, Routes} from '@angular/router';

@Component({
  selector: 'app-workout-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['workout-form.component.scss'],
  templateUrl: './workout-form.component.html'
})
export class WorkoutFormComponent implements OnChanges {

  toggled = false;
  exists = false;

  @Input()
  workout: Workout;

  @Output()
  create = new EventEmitter<Workout>();

  @Output()
  update = new EventEmitter<Workout>();

  @Output()
  remove = new EventEmitter<Workout>();

  form = this.fb.group({
    name: ['', Validators.required],
    type: 'cycling',
    reps: 0,
    sets: 0
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  get placeholder() {
    return `e.g. ${this.form.get('type').value === 'cycling' ? 'Benchpress' : 'Treadmill'}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.workout && this.workout.name) {
      this.exists = true;
      const value = this.workout;
      this.form.patchValue(value);
    }
  }

  get required() {
    return (
      this.form.get('name').hasError('required') &&
      this.form.get('name').touched
    );
  }

  createWorkout() {
    if (this.form.valid) {
      // this.create.emit(this.form.value);
      // tslint:disable-next-line:max-line-length
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyNzI0MDc3LWRiYTEtNDE1OS05MjNhLWZjOTFhOTViN2NlYSIsImlhdCI6MTY2ODA0NDU0NCwiZXhwIjoxNjY4MDUxNzQ0fQ.s9EfWsfMl6tkY4arGmWY5POkWlzq8qoFt8oNj-BNVPo';
      const headers = new HttpHeaders()
        .set('Content-Type' , 'application/json')
        .set('Authorization' , 'Bearer ' + token );

      const body = {
        duration: this.form.value.reps,
        distance: this.form.value.sets,
        startDate: '2016-09-18T17:34:02.666Z',
        endDate: '2016-09-18T17:34:02.666Z',
        title: `${this.form.value.name} - ${this.form.value.type}`,
        type: 'training'
      };

      console.log(this.form.value);
      this.http.post<any>('http://localhost:3000/api/events', body, { headers })
        .toPromise().then((data: any) => {
        this.router.navigate(['/workouts']);
        console.log(data);
      });

    }
  }

  updateWorkout() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  removeWorkout() {
    this.remove.emit(this.form.value);
  }

  toggle() {
    this.toggled = !this.toggled;
  }

}
