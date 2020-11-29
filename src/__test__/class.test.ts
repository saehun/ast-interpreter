import { run } from './runner';

describe('Class expression of Eva', () => {
  it('can create class and intanciate', () => {
    expect(
      run(`
  (class Point null
      (begin
        (def constructor (this x y)
          (begin
            (set (prop this x) x)
            (set (prop this y) y)))
        (def calc (this)
          (+ (prop this x) (prop this y)))))
    (var p (new Point 10 20))
    ((prop p calc) p)
    `)
    ).toEqual(30);
  });

  it('can inherit parent class', () => {
    expect(
      run(`
   (class Point null
      (begin
        (def constructor (this x y)
          (begin
            (set (prop this x) x)
            (set (prop this y) y)))
        (def calc (this)
          (+ (prop this x) (prop this y)))))
    (var p (new Point 10 20))
    ((prop p calc) p)

   (class Point3D Point
      (begin
        (def constructor (this x y z)
          (begin
            ((prop (super Point3D) constructor) this x y)
            (set (prop this z) z)))
        (def calc (this)
          (+ ((prop (super Point3D) calc) this)
             (prop this z)))))
    (var p (new Point3D 10 20 30))
    ((prop p calc) p) `)
    ).toEqual(60);
  });

  it('can inherit parent class', () => {
    expect(
      run(`
   (class Point null
      (begin
        (def constructor (this x)
          (begin
            (set (prop this x) x)))))

   (class Point2D Point
      (begin
        (def constructor (this x y)
          (begin
            ((prop (super Point2D) constructor) this x y)
            (set (prop this y) y)))))
    (var p (new Point2D 10 20))
    (prop p x)`)
    ).toEqual(10);
  });
});
