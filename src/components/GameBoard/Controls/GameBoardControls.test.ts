import { mount, type VueWrapper } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import type { ComponentPublicInstance } from "vue";

import GameBoardControls from "./GameBoardControls.vue";

const renderComponent = () => {
  return mount(GameBoardControls, {
    shallow: true,
    global: {
      stubs: {
        AppDialog: {
          template: "<div><slot></slot><slot name='actions'></slot></div>",
        },
      },
    },
  }) as VueWrapper<
    ComponentPublicInstance & { showSettingsDialog: boolean; selectedNumObstacles: number }
  >;
};

describe("GameBoardControls", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("should render", () => {
    const wrapper = renderComponent();

    expect(wrapper.exists()).toBe(true);
  });

  describe("settings dialog", () => {
    test("opens Settings dialog", async () => {
      const wrapper = renderComponent();

      await wrapper.find("[data-testid='open-settings']").trigger("click");
      expect(wrapper.vm.showSettingsDialog).toBe(true);
    });

    test("closes Settings dialog", async () => {
      const wrapper = renderComponent();

      await wrapper.find("[data-testid='open-settings']").trigger("click");
      await wrapper.find("[data-testid='close-settings']").trigger("click");
      expect(wrapper.vm.showSettingsDialog).toBe(false);
    });
  });

  describe("events emitted", () => {
    test('emits "click:new-game" event after clicking on "New Game" button', async () => {
      const wrapper = renderComponent();

      await wrapper.find("[data-testid='new-game']").trigger("click");
      expect(wrapper.emitted("click:new-game")).toBeTruthy();
    });

    test('emits "click:new-game" event after clicking on "Save & Restart" button', async () => {
      const wrapper = renderComponent();

      await wrapper.find("[data-testid='save-settings']").trigger("click");
      expect(wrapper.emitted("click:new-game")).toBeTruthy();
    });
  });
});
