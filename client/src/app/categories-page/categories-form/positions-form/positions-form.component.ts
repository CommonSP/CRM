import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../../../shared/services/position.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private positionService: PositionService) {
  }

  positionId = null
  positions: Position[] = []
  loading = false
  modal: MaterialInstance
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  form: FormGroup

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.loading = true
    console.log(this.categoryId)
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      console.log(positions)
      this.loading = false
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionService.update(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция отредактирована')
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
        },
        err => {
          MaterialService.toast(err.error.massage)
        },
        () => {
          this.modal.close()
          this.form.reset({name: null, cost: 1})
          this.form.enable()
        }
      )
    } else {
      this.form.disable()


      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана')
          this.positions.push(position)
          console.log(position)

        },
        err => {
          MaterialService.toast(err.error.massage)
        },
        () => {
          this.modal.close()
          this.form.reset({name: null, cost: 1})
          this.form.enable()
        }
      )
    }


  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const desition = window.confirm(`Удалить позицию "${position.name}"?`)

    if (desition) {
      this.positionService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        err => MaterialService.toast(err.error.message)
      )
    }

  }
}
