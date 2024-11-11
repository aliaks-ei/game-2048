import { mount } from "@vue/test-utils";

import AppSelect from "./AppSelect.vue";

describe("AppSelect", () => {
  test("should render", () => {
    const wrapper = mount(AppSelect);

    expect(wrapper.exists()).toBe(true);
  });

  test("should render with provided 'options' prop", () => {
    const options = [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ];
    const wrapper = mount(AppSelect, { props: { options } });

    expect(wrapper.findAll("option").length).toBe(2);
  });

  test("should render with provided 'modelValue' prop", () => {
    const options = [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ];
    const wrapper = mount(AppSelect, { props: { options, modelValue: "option-1" } });

    expect(wrapper.find("select").element.value).toBe("option-1");
  });

  test("should emit 'update:modelValue' event", async () => {
    const options = [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ];
    const wrapper = mount(AppSelect, { props: { options } });

    await wrapper.find("select").setValue("option-2");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});
