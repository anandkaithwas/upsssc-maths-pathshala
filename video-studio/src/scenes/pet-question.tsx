import {makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {Circle, Line, Rect, Txt} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  view.fill('#0b1020');

  const brand = createRef<Txt>();
  const hook = createRef<Txt>();
  const card = createRef<Rect>();
  const question = createRef<Txt>();
  const answer = createRef<Txt>();
  const prompt = createRef<Txt>();
  const accent = createRef<Circle>();

  view.add(
    <>
      <Txt
        ref={brand}
        text="UPSSSC MATHS PATHSHALA"
        x={-360}
        y={-820}
        fontSize={34}
        fontWeight={700}
        letterSpacing={2}
        fill="#b9a6ff"
        opacity={0}
      />
      <Circle ref={accent} x={330} y={-660} size={150} fill="#6d4aff" opacity={0} />
      <Txt
        ref={hook}
        text="CAN YOU SOLVE THIS?"
        y={-490}
        fontSize={62}
        fontWeight={900}
        fill="#ffffff"
        opacity={0}
      />
      <Rect
        ref={card}
        y={-20}
        width={900}
        height={440}
        radius={42}
        fill="#18233d"
        stroke="#8c75ff"
        lineWidth={5}
        scale={0.85}
        opacity={0}
      >
        <Txt
          ref={question}
          text={'Find the next term\n2, 6, 12, 20, ?'}
          fontSize={66}
          lineHeight={1.35}
          fontWeight={800}
          textAlign="center"
          fill="#ffffff"
        />
      </Rect>
      <Line
        points={[[-330, 300], [330, 300]]}
        stroke="#5eead4"
        lineWidth={8}
        lineCap="round"
        end={0}
      />
      <Txt
        ref={prompt}
        text="Pause the reel and comment your answer"
        y={410}
        fontSize={32}
        fontWeight={600}
        fill="#d5def0"
        opacity={0}
        textAlign="center"
      />
      <Txt
        ref={answer}
        text="Answer reveal coming next"
        y={560}
        fontSize={40}
        fontWeight={800}
        fill="#5eead4"
        opacity={0}
      />
    </>,
  );

  yield* all(
    brand().opacity(1, 0.5),
    hook().opacity(1, 0.7),
    accent().opacity(0.22, 0.7),
  );
  yield* waitFor(0.8);
  yield* all(card().opacity(1, 0.6), card().scale(1, 0.6));
  yield* question().opacity(1, 0.4);
  yield* waitFor(1.2);
  yield* all(
    prompt().opacity(1, 0.5),
    view.children()[4].end(1, 0.6),
  );
  yield* waitFor(1.0);
  yield* answer().opacity(1, 0.5);
  yield* waitFor(1.0);
});