export default class User {
  private _ctx: CanvasRenderingContext2D | null;
  private _x: number;
  private _y: number;
  private _size: number;
  private _color: string;
  private _moveXSpace: number;
  private _moveYSpace: number;
  private _speed: number;

  constructor() {
    this._x = 0;
    this._y = 0;
    this._moveXSpace = 0;
    this._moveYSpace = 0;
    this._speed = 1;
    this._size = 0;
    this._color = "black";
    this._ctx = null;
    this.getPosition = this.getPosition.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.update = this.update.bind(this);
  }

  public getPosition() {
    return { x: this._x, y: this._y, size: this._size };
  }

  public setPosition(type: KeyboardEvent["code"]) {
    switch (type) {
      case "ArrowDown":
        this._moveXSpace = 0;
        this._moveYSpace = this._speed;
        break;
      case "ArrowUp":
        this._moveXSpace = 0;
        this._moveYSpace = -this._speed;
        break;
      case "ArrowRight":
        this._moveXSpace = this._speed;
        this._moveYSpace = 0;
        break;
      case "ArrowLeft":
        this._moveXSpace = -this._speed;
        this._moveYSpace = 0;
        break;
      default:
        break;
    }
  }

  public update() {
    this._draw();
    if (this._ctx) {
      this._x += this._moveXSpace;
      this._y += this._moveYSpace;
      if (
        this._x - this._size <= 0 ||
        this._x + this._size >= this._ctx.canvas.width
      ) {
        this._moveXSpace = 0;
      } else if (
        this._y - this._size <= 0 ||
        this._y + this._size >= this._ctx.canvas.height
      ) {
        this._moveYSpace = 0;
      }
    }
  }

  public init(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    speed: number
  ) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
    this._speed = speed;
  }

  private _draw() {
    if (this._ctx) {
      this._ctx.beginPath();
      this._ctx.arc(this._x, this._y, this._size, 0, Math.PI * 2);
      this._ctx.fillStyle = this._color;
      this._ctx.fill();
      this._ctx.closePath();
    }
  }
}
