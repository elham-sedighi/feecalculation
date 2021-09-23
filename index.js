import {concatMap, of} from "rxjs";
import {readFile} from 'fs';

function startFeeCalculation() {
    console.log('start reading data from input file...');
    readFile('./input.json', 'utf8', function (err, data) {
        if (err) console.log('failed to read file!');
        of(JSON.parse(data)).pipe(
            concatMap(inputData => {
                console.log('start calculating fees...')
                //console.log(inputData);
                return inputData.map(operation => {
                    console.log("/////////////////////////////")
                    console.log((operation));
                    //return true;
                });
            })
        ).subscribe();
    });
}

startFeeCalculation();