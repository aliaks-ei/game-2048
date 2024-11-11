import { mount } from "@vue/test-utils";

import GridContainer from "./GridContainer.vue";

describe("GridContainer", () => {
  test("should render", () => {
    const wrapper = mount(GridContainer, { props: { size: 3 } });

    expect(wrapper.exists()).toBe(true);
  });

  test("should render correct number of grid items based on provided 'size' prop", () => {
    const size = 3;
    const wrapper = mount(GridContainer, { props: { size } });

    expect(wrapper.findAll("[data-testid='grid-item']").length).toBe(size * size);
  });

  test('should not render grid items if "size" prop is 0', () => {
    const wrapper = mount(GridContainer, { props: { size: 0 } });

    expect(wrapper.findAll("[data-testid='grid-item']").length).toBe(0);
  });
});
