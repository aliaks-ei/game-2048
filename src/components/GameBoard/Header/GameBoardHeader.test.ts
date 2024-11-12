import { mount } from "@vue/test-utils";

import GameBoardHeader from "./GameBoardHeader.vue";

describe("GameBoardHeader", () => {
  test("should render", () => {
    const wrapper = mount(GameBoardHeader);

    expect(wrapper.exists()).toBe(true);
  });

  describe("scores", () => {
    test("should render with provided 'currentScore' and 'bestScore' props", () => {
      const currentScore = 10;
      const bestScore = 20;
      const wrapper = mount(GameBoardHeader, { props: { currentScore, bestScore } });

      expect(wrapper.findAll("[data-testid='score']").length).toBe(2);
      expect(wrapper.text()).toContain(currentScore.toString());
      expect(wrapper.text()).toContain(bestScore.toString());
    });

    test('shoult render 0 as defaults if "currentScore" and "bestScore" props are not provided', () => {
      const wrapper = mount(GameBoardHeader);

      expect(wrapper.findAll("[data-testid='score']").length).toBe(2);
      expect(wrapper.text()).toContain("0");
    });
  });
});
