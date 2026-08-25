/**
 * 표지 색.
 *
 * 두 테마에서 같은 값을 쓴다. 천을 씌운 양장본은 낮이든 밤이든 색이
 * 변하지 않고, 옅게 물들인 판형은 책보다 UI 카드처럼 읽힌다.
 * 채도는 20%가 상한이다. 그 위로 올리면 곧바로 카드처럼 보인다.
 */
export function boards(hue: number, sat: number) {
  const foilSat = Math.min(sat, 12);
  return {
    face: `linear-gradient(158deg, hsl(${hue} ${sat}% 30%) 0%, hsl(${hue} ${Math.max(sat - 1, 0)}% 24%) 58%, hsl(${hue} ${sat}% 21%) 100%)`,
    spine: `hsl(${hue} ${sat + 4}% 15%)`,
    foil: `hsl(${hue} ${foilSat}% 87%)`,
    rule: `hsl(${hue} ${foilSat}% 87% / 0.26)`,
  };
}
