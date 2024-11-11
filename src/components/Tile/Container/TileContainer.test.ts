import { mount } from "@vue/test-utils";

import TileContainer from "./TileContainer.vue";

describe("TileContainer", () => {
  test("should render", () => {
    const wrapper = mount(TileContainer);

    expect(wrapper.exists()).toBe(true);
  });

  test("should render provided slot content", () => {
    const content = "Test content";
    const wrapper = mount(TileContainer, {
      slots: {
        default: content,
      },
    });

    expect(wrapper.text()).toContain(content);
  });
});
