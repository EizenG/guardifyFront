import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-camera',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './add-camera.component.html',
  styleUrl: './add-camera.component.scss'
})
export class AddCameraComponent {

  addCameraForm = this.fb.group({
    id_camera : ['',Validators.required],
    localisation : ['',Validators.required],
    status : [true],
  });

  constructor(private fb : FormBuilder, private cdref : ChangeDetectorRef){
    this.addCameraForm.get('status')?.valueChanges.subscribe(value => {
      console.log('Checkbox value:', value);
    });
  }

  

  test(){
    console.log(this.addCameraForm.get('status')?.value)
  }

}
