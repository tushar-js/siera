import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { pairwise, startWith, tap } from 'rxjs/operators';

@Component({
    selector: 'app-card-form',
    templateUrl: './card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit, OnDestroy {

    months: Array<string>;
    years: Array<string>;

    cardForm: FormGroup;
    subs: Array<Subscription>;

    isCvvActive = false;
    cardProvider = 'MasterCard'

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        //create an array from numbers and pad zeroes if needed
        this.months = Array.from(Array(12), (el, i) => (i+1).toString().padStart(2, '0'));

        //assuming card expiry year ranges from 2020 to 2040
        this.years = Array.from(Array(21), (el, i) => (i+2020).toString());

        this.cardForm = this.fb.group({

            //Limitation: for this demo, only 16 digit card numbers are valid
            //regex checks for 4 groups of 4 digits
            cardNumber: ['', [Validators.required, Validators.maxLength(19), Validators.pattern(/^([0-9]{4}\s?){4}$/)]],

            //for name, all letters with accents are allowed.
            cardName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s]*$/)]],

            //months and year need no validation as they're in a dropdown
            //however, text input with validation might be a better UX
            cardExpiryMonth: [null, [Validators.required]],
            cardExpiryYear: [null, [Validators.required]],

            //valid CVV is 3 or 4 digits
            cardCvv: [null, [Validators.required, Validators.maxLength(4), Validators.pattern(/^[0-9]{3,4}$/)]],
        });

        this.handleNumberField();
    }

    handleNumberField() {
        let pub: Observable<[string, string]> = this.cardNumberField.valueChanges
        .pipe(
            startWith(''), 
            tap((val: string)=> {
                console.log(val);
                // if(val.length > 1) {
                //     return;
                // }
                
                //broad assumption
                //TODO: implement more accurate detection algorithm
                let firstDigit = val[0];
                switch(firstDigit) {
                    case '4':
                        this.cardProvider = 'VISA';
                        break;
                    case '5':
                        this.cardProvider = 'MasterCard';
                        break;
                    case '6':
                        this.cardProvider = 'Discover';
                        break;
                    default:
                        this.cardProvider = 'Unknown';
                }
            }),

            //send two at a time so previous value can be referenced
            pairwise()
        );

        let sub: Subscription = pub.subscribe( ([prev, curr]: [string, string]) => {
            let len = curr.length;

            //assuming valid card numbers will be of 16 digits
            //place a `space` after each group
            //imperfect implementation
            if([4,9,14].indexOf(len) > -1 && len > prev.length) {
                this.cardNumberField.setValue(curr + ' ');
            }
        });
        this.subs.push(sub);
    }

    submitForm() {
        console.log('Submitted:');
        console.log(this.cardForm.value);  
    }

    //getters for form fields in order to keep the template concise
    get cardNumberField() {
        return this.cardForm.get('cardNumber')
    }
    get cardNameField() {
        return this.cardForm.get('cardName')
    }
    get cardExpiryMonth() {
        return this.cardForm.get('cardExpiryMonth')
    }
    get cardExpiryYear() {
        return this.cardForm.get('cardExpiryYear')
    }
    get cardCvv() {
        return this.cardForm.get('cardCvv')
    }

    ngOnDestroy() {
        //to prevent memory leaks, unsubscribe from all subs
        for(let sub of this.subs) {
            sub.unsubscribe();
        }
    }

}
