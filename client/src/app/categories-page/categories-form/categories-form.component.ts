import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  isNew = true
  image: File
  form: FormGroup
  imagePreview: string | ArrayBuffer
  category: Category
  @ViewChild('input') inputRef: ElementRef

  constructor(private route: ActivatedRoute,
              private categoriesServices: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
    this.form.disable()


    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesServices.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()

        },
        error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)

  }

  onSubmit() {
    this.form.disable()
    let obs$: Observable<Category>
    if (this.isNew) {
      obs$ = this.categoriesServices.create(this.form.value.name, this.image)
    } else {

      obs$ = this.categoriesServices.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      (category) => {
        this.category = category
        this.form.enable()
        MaterialService.toast('?????????????????? ??????????????????!')
      },
      (error) => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    )
  }

  deleteCategory(){
    const decision = window.confirm(`???? ??????????????, ?????? ???????????? ?????????????? ?????????????????? ${this.category.name}`)
    if(decision){
      this.categoriesServices.delete(this.category._id)
        .subscribe(
          res=> MaterialService.toast(res.message),
          error => MaterialService.toast(error.error.message),
          ()=> this.router.navigate(['/categories'])
        )
    }

  }

}
