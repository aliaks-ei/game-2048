import { mount } from "@vue/test-utils";

import TileItem from "./TileItem.vue";

const mockTile = {
  isObstacle: false,
  value: 2,
  col: 1,
  row: 1,
  id: "id-1",
};

describe("TileItem", () => {
  test("should render", () => {
    const wrapper = mount(TileItem, { props: { tile: mockTile } });

    expect(wrapper.exists()).toBe(true);
  });

  test("should render with provided 'tile' prop", () => {
    const wrapper = mount(TileItem, { props: { tile: mockTile } });

    expect(wrapper.find(".tile__inner").classes()).toContain(`tile__inner--${mockTile.value}`);
    expect(wrapper.classes()).not.toContain("tile--obstacle");
  });

  test('should render obstacle if provided "tile" prop is obstacle', () => {
    const tile = { ...mockTile, isObstacle: true };
    const wrapper = mount(TileItem, { props: { tile } });

    expect(wrapper.classes()).toContain("tile--obstacle");
    expect(wrapper.find("img").exists()).toBe(true);
  });
});
