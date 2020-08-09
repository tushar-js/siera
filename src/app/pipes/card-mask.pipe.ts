import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cardMask'
})
export class CardMaskPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): unknown {
        let maskedValue;
        let groups = value.split(' ');
        let [g1, g2,g3, g4] = [...groups]
        console.log(g1, g2, g3, g4);
        
        let n1, n2, n3, n4;
        n1 = n2 = n3 = n4 = '####';

        n1 = this.pad(g1, false);
        n2 = this.pad(g2, true);
        n3 = this.pad(g3, true);
        n4 = this.pad(g4, false);

        let final = `${n1} ${n2} ${n3} ${n4}`
        return final;
    }

    pad(original: string = '', applyMask: boolean, groupLength = 4) {
        let len = original.length;
        let padLength = groupLength - len;
        let maskChar = '#';
        let padding = maskChar.repeat(padLength);

        let prefix = original;
        if(applyMask) {
            prefix = '*'.repeat(len);
        }

        return prefix + padding;

    }

}
