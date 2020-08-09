import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-card-form',
    templateUrl: './card-form.component.html',
    styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

    months: Array<number>;
    years: Array<number>;

    constructor() { }

    ngOnInit(): void {
        this.months = Array.from(Array(12), (_, i) => i+1);
        this.years = Array.from(Array(20), (_, i) => i+2020);
    }

}
