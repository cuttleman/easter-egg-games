import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Enemy from "./partials/Enemy";
import User from "./partials/User";
import { randomIdx, randomPosition } from "./utils";

// limit time 15sec
// level 1 enemy 50
// level 2 enemy 100
// level 3 enemy 150

interface Props {
  width: number;
  height: number;
  userSpeed?: number;
  result?: (data: { data: { score: number } }) => void;
}

/**@Description Props is required absoluty width and height sizes */
export const Dodge = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<
    React.RefObject<HTMLCanvasElement>["current"] | null
  >(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [score, setScore] = useState<number>(0);
  const [deadTrigger, setDeadTrigger] = useState<number>(0);

  let user = useMemo(() => new User(), []);
  let enemies: Enemy[] = [];
  let animateId: number;
  let isDead = false;
  let timer = 0;

  const animate = () => {
    animateId = window.requestAnimationFrame(animate);
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx?.strokeRect(0, 0, canvas!.width, canvas!.height);

    timer++;
    if (timer % 30 === 0) {
      setScore((prev) => prev + 1);
    }

    user.update();
    enemies.forEach((enemy) => {
      enemy.update();
      isDead = enemy.isCollision();
      if (isDead) {
        setDeadTrigger((prev) => prev + 1);
        window.cancelAnimationFrame(animateId);
      }
    });
  };

  const init = useCallback(() => {
    if (canvas && ctx) {
      user.init(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        10,
        "red",
        props.userSpeed ?? 1
      );

      for (let i = 0; i < 50; i++) {
        const randomMove = [0.5, -0.5, 1, -1, 1.5, -1.5];
        const { x, y } = randomPosition(ctx);
        const initMoveX = randomMove[randomIdx(6)];
        const initMoveY = randomMove[randomIdx(6)];
        enemies[i] = new Enemy();
        enemies[i].init(ctx, x, y, 3, "black", initMoveX, initMoveY, user);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, ctx, user]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      user.setPosition(e.code);
    },
    [user]
  );

  useEffect(() => {
    if (props.result) {
      props.result({ data: { score } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadTrigger]);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current);
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (canvas) {
      canvas.width = props.width;
      canvas.height = props.height;
    }
    init();
    animate();
    return () => window.cancelAnimationFrame(animateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  return (
    <div
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} />
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: 0,
          right: 0,
          bottom: 0,
          margin: "0 auto",
          width: "fit-content",
          height: "fit-content",
          padding: "3px 10px",
          backgroundColor: "#00000050",
          borderRadius: "5px",
          fontSize: "18px",
        }}
      >
        {score}
      </div>
    </div>
  );
};
