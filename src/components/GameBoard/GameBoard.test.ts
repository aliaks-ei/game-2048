import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";

import GameBoard from "./GameBoard.vue";

vi.spyOn(document, "addEventListener");
vi.spyOn(document, "removeEventListener");

// TODO: add more tests (unit)
// TODO: add more tests (e2e)
describe("GameBoard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("should render", () => {
    const wrapper = mount(GameBoard, { shallow: true });

    expect(wrapper.exists()).toBe(true);
  });

  describe("'keyup' event listener", () => {
    test("should add 'keyup' event listener after mount", () => {
      mount(GameBoard, { shallow: true });

      expect(document.addEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
    });

    test("should remove 'keyup' event listener before unmount", () => {
      const wrapper = mount(GameBoard, { shallow: true });

      wrapper.unmount();

      expect(document.removeEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
    });
  });
});
