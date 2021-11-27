import User from "./User";

import { getDistance } from "../utils";

export default class Enemy {
  private _ctx: CanvasRenderingContext2D | null;
  private _x: number;
  private _y: number;
  private _size: number;
  private _color: string;
  private _velocityX: number;
  private _velocityY: number;
  private _user: User | null;

  constructor() {
    this._ctx = null;
    this._x = 0;
    this._y = 0;
    this._size = 0;
    this._color = "black";
    this._velocityX = 0;
    this._velocityY = 0;
    this._user = null;
    this.isCollision = this.isCollision.bind(this);
    this.update = this.update.bind(this);
  }

  public isCollision(): boolean {
    const distance = getDistance(
      this._user!.getPosition().x,
      this._user!.getPosition().y,
      this._x,
      this._y
    );
    if (distance <= this._user!.getPosition().size + this._size) {
      return true;
    }
    return false;
  }

  public update() {
    this._draw();
    this._move();
    this.isCollision();
    this._reachedEnd();
  }

  public init(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    initMoveX: number,
    initMoveY: number,
    user: User
  ) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
    this._velocityX = initMoveX;
    this._velocityY = initMoveY;
    this._user = user;
  }

  private _draw() {
    this._ctx!.beginPath();
    this._ctx!.arc(this._x, this._y, this._size, 0, Math.PI * 2);
    this._ctx!.fillStyle = this._color;
    this._ctx!.fill();
    this._ctx!.closePath();
  }

  private _reachedEnd() {
    if (this._x + this._size >= this._ctx!.canvas.width) {
      this._velocityX = -this._velocityX;
    } else if (this._x - this._size <= 0) {
      this._velocityX = -this._velocityX;
    } else if (this._y + this._size >= this._ctx!.canvas.height) {
      this._velocityY = -this._velocityY;
    } else if (this._y - this._size <= 0) {
      this._velocityY = -this._velocityY;
    }
  }

  private _move() {
    this._x += this._velocityX;
    this._y += this._velocityY;
  }
}
