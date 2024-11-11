import { mount } from "@vue/test-utils";

import AppButton from "./AppButton.vue";

describe("AppButton", () => {
  test("should render", () => {
    const wrapper = mount(AppButton);

    expect(wrapper.exists()).toBe(true);
  });

  test("should render with outline class", () => {
    const wrapper = mount(AppButton, { props: { outline: true } });

    expect(wrapper.classes()).toContain("app-button--outline");
  });

  test("should emit click event", async () => {
    const wrapper = mount(AppButton);

    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
