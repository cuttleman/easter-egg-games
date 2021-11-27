export function randomIdx(length: number) {
  return Math.floor(Math.random() * length);
}

export function randomPosition(ctx: CanvasRenderingContext2D) {
  const startX1 = 0;
  const endX1 = ctx.canvas.width / 2.2;
  const startY1 = 0;
  const endY1 = ctx.canvas.height / 2.2;

  const startX2 = ctx.canvas.width / 1.9;
  const endX2 = ctx.canvas.width;
  const startY2 = ctx.canvas.height / 1.9;
  const endY2 = ctx.canvas.height;

  const x1 = Math.floor(Math.random() * (endX1 - startX1) + startX1);
  const y1 = Math.floor(Math.random() * (endY1 - startY1) + startY1);

  const x2 = Math.floor(Math.random() * (endX2 - startX2) + startX2);
  const y2 = Math.floor(Math.random() * (endY2 - startY2) + startY2);

  const xList = [x1, x2];
  const yList = [y1, y2];

  return {
    x: xList[randomIdx(2)],
    y: yList[randomIdx(2)],
  };
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(
    Math.pow(Math.abs(x1) - Math.abs(x2), 2) +
      Math.pow(Math.abs(y1) - Math.abs(y2), 2)
  );
}
