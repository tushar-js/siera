import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-card-form',
    templateUrl: './card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

    months: Array<number>;
    years: Array<number>;

    cardForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.months = Array.from(Array(12), (el, i) => i+1);

        //assuming card expiry year ranges from 2020 to 2040
        this.years = Array.from(Array(21), (el, i) => i+2020);

        this.cardForm = this.fb.group({
            cardNumber: ['', [Validators.required]],
            cardName: ['', [Validators.required]],
            cardExpiryMonth: [null, [Validators.required]],
            cardExpiryYear: [null, [Validators.required]],
            cardCvv: [null, [Validators.required]],
        })
    }

    submitForm() {
        console.log('Submitted:');
        console.log(this.cardForm.value);
        
    }

}
