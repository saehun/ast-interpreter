import { run } from './runner';

/**
 * (if <condition>
 *     <consequent>
 *     <alternate>)
 */
describe('If expression of Eva', () => {
  run(
    'can handle branch',
    `(begin
        (var x 10)
        (var y 10)
        (if (> x 10)
            (set y 20)
            (set y 30))
        y)
    `,
    30
  );
});

/**
 * (while <condition>
 *        <body>)
 */
describe('While expression of Eva', () => {
  run(
    'can loop over',
    `(begin
        (var counter 0)
        (var result 1)
        (while (< counter 10)
            (begin
                (set result (* result 2))
                (set counter (+ counter 1))))
        result)
    `,
    1024
  );
});
