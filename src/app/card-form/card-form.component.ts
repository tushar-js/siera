import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-card-form',
    templateUrl: './card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit, OnDestroy {

    months: Array<number>;
    years: Array<number>;

    cardForm: FormGroup;
    subs: Array<Subscription>;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.months = Array.from(Array(12), (el, i) => i+1);

        //assuming card expiry year ranges from 2020 to 2040
        this.years = Array.from(Array(21), (el, i) => i+2020);

        this.cardForm = this.fb.group({
            cardNumber: ['', [Validators.required, Validators.maxLength(19)]],
            cardName: ['', [Validators.required]],
            cardExpiryMonth: [null, [Validators.required]],
            cardExpiryYear: [null, [Validators.required]],
            cardCvv: [null, [Validators.required]],
        });

        this.handleNumberField();
    }

    handleNumberField() {
        let ob = this.cardNumberField.valueChanges
        .pipe(startWith(''), pairwise())
        .subscribe( ([prev, curr]: [string, string]) => {
            let len = curr.length;
            if([4,9,14].indexOf(len) > -1 && len > prev.length) {
                this.cardNumberField.setValue(curr + ' ');
            }
        })

    }

    submitForm() {
        console.log('Submitted:');
        console.log(this.cardForm.value);  
    }

    get cardNumberField() {
        return this.cardForm.get('cardNumber')
    }

    get cardNameField() {
        return this.cardForm.get('cardName')
    }

    ngOnDestroy() {
        for(let sub of this.subs) {
            sub.unsubscribe();
        }
    }

}
