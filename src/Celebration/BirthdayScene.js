import React, { useEffect } from 'react';

const BirthdayCanvas = () => {
  useEffect(() => {
    const c = document.getElementById('canvas');
    const ctx = c.getContext('2d');

    const bc = document.createElement('canvas');
    const bCtx = bc.getContext('2d');

    let cw = (c.width = bc.width = window.innerWidth),
      cx = cw / 2;
    let ch = (c.height = bc.height = window.innerHeight + 100),
      cy = ch;

    let frames = 0;
    let requestId = null;
    const rad = Math.PI / 180;
    const kappa = 0.5522847498;

    const balloons = [];

    class Balloon {
      constructor() {
        this.r = randomIntFromInterval(20, 70);
        this.R = 1.4 * this.r;
        this.x = randomIntFromInterval(this.r, cw - this.r);
        this.y = ch + 2 * this.r;
        this.a = this.r * 4.5;
        this.pm = Math.random() < 0.5 ? -1 : 1;
        this.speed = randomIntFromInterval(1.5, 4);
        this.k = this.speed / 5;
        this.hue = this.pm > 0 ? '210' : '10';
      }
    }

    const updateBallons = (ctx) => {
      frames += 1;
      if (frames % 37 === 0 && balloons.length < 37) {
        const balloon = new Balloon();
        balloons.push(balloon);
      }
      ctx.clearRect(0, 0, cw, ch);

      balloons.forEach((b) => {
        if (b.y > -b.a) {
          b.y -= b.speed;
        } else {
          b.y = parseInt(ch + b.r + b.R);
        }

        const p = thread(b, ctx);
        b.cx = p.x;
        b.cy = p.y - b.R;
        ctx.fillStyle = Grd(p.x, p.y, b.r, b.hue);
        drawBalloon(b, ctx);
      });
    };

    const drawBalloon = (b, ctx) => {
      const or = b.r * kappa; // offset
      const p1 = { x: b.cx - b.r, y: b.cy };
      const pc11 = { x: p1.x, y: p1.y + or };
      const pc12 = { x: p1.x, y: p1.y - or };

      const p2 = { x: b.cx, y: b.cy - b.r };
      const pc21 = { x: b.cx - or, y: p2.y };
      const pc22 = { x: b.cx + or, y: p2.y };

      const p3 = { x: b.cx + b.r, y: b.cy };
      const pc31 = { x: p3.x, y: p3.y - or };
      const pc32 = { x: p3.x, y: p3.y + or };

      const p4 = { x: b.cx, y: b.cy + b.R };
      const pc41 = { x: p4.x + or, y: p4.y };
      const pc42 = { x: p4.x - or, y: p4.y };

      const t1 = { x: p4.x + 0.2 * b.r * Math.cos(70 * rad), y: p4.y + 0.2 * b.r * Math.sin(70 * rad) };
      const t2 = { x: p4.x + 0.2 * b.r * Math.cos(110 * rad), y: p4.y + 0.2 * b.r * Math.sin(110 * rad) };

      // balloon
      ctx.beginPath();
      ctx.moveTo(p4.x, p4.y);
      ctx.bezierCurveTo(pc42.x, pc42.y, pc11.x, pc11.y, p1.x, p1.y);
      ctx.bezierCurveTo(pc12.x, pc12.y, pc21.x, pc21.y, p2.x, p2.y);
      ctx.bezierCurveTo(pc22.x, pc22.y, pc31.x, pc31.y, p3.x, p3.y);
      ctx.bezierCurveTo(pc32.x, pc32.y, pc41.x, pc41.y, p4.x, p4.y);
      // knot
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.closePath();
      ctx.fill();
    };

    const thread = (b, ctx) => {
      ctx.beginPath();
      let x, y;
      for (let i = b.a; i > 0; i -= 1) {
        const t = i * rad;
        x = b.x + b.pm * 50 * Math.cos(b.k * t - frames * rad);
        y = b.y + b.pm * 25 * Math.sin(b.k * t - frames * rad) + 50 * t;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      return { x, y };
    };

    const Grd = (x, y, r, hue) => {
      const grd = ctx.createRadialGradient(x - 0.5 * r, y - 1.7 * r, 0, x - 0.5 * r, y - 1.7 * r, r);
      grd.addColorStop(0, `hsla(${hue},100%,65%,.95)`);
      grd.addColorStop(0.4, `hsla(${hue},100%,45%,.85)`);
      grd.addColorStop(1, `hsla(${hue},100%,25%,.80)`);
      return grd;
    };

    const randomIntFromInterval = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1) + mn);

    const Draw = () => {
      updateBallons(bCtx);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(bc, 0, 0);
      requestId = window.requestAnimationFrame(Draw);
    };

    const Init = () => {
      if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = null;
      }
      cw = c.width = bc.width = window.innerWidth;
      cx = cw / 2;
      ch = c.height = bc.height = window.innerHeight + 100;
      cy = ch;
      bCtx.strokeStyle = '#abcdef';
      bCtx.lineWidth = 1;
      Draw();
    };

    setTimeout(() => {
      Init();
      window.addEventListener('resize', Init, false);
    }, 15);

    return () => {
      window.cancelAnimationFrame(requestId);
      window.removeEventListener('resize', Init);
    };
  }, []);

  return (
    <div>
      <canvas id="canvas"></canvas>
      {/* <div style={textStyle}>HAPPY BIRTHDAY!!!</div> */}
    </div>
  );
};

const textStyle = {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100vw',
  fontSize: '5vw',
  textAlign: 'center',
  marginTop: 'calc(50vh - .5em)',
  fontFamily: 'Monoton',
  color: 'hsla(35, 99%, 50%, .3)',
  zIndex: '-1',
};

export default BirthdayCanvas;
