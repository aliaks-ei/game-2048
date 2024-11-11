import { mount } from "@vue/test-utils";

import AppDialog from "./AppDialog.vue";

describe("AppDialog", () => {
  const mountAppDialog = (
    props: Record<string, unknown> | null = {},
    slots: Record<string, string> = {},
  ) => {
    return mount(AppDialog, {
      props: {
        modelValue: true,
        ...props,
      },
      global: { stubs: { teleport: true } },
      slots,
    });
  };

  beforeEach(() => {
    // create teleport target
    const el = document.createElement("div");
    el.id = "dialogs";
    document.body.appendChild(el);
  });

  afterEach(() => {
    // clean up
    document.body.innerHTML = "";
  });

  test("should render", () => {
    const wrapper = mountAppDialog();

    expect(wrapper.find("[data-testid='app-dialog']").exists()).toBeTruthy();
  });

  test("should not render if 'modelValue' is false", () => {
    const wrapper = mountAppDialog({ modelValue: false });

    expect(wrapper.find("[data-testid='app-dialog']").exists()).toBeFalsy();
  });

  test("should render with provided 'title' prop", () => {
    const title = "Test title";
    const wrapper = mountAppDialog({ title });

    expect(wrapper.text()).toContain(title);
  });

  test("should emit 'update:modelValue' event", async () => {
    const wrapper = mountAppDialog();

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  describe("slots", () => {
    test("should render default slot content", () => {
      const content = "Test content";
      const wrapper = mountAppDialog(null, {
        default: content,
      });

      expect(wrapper.text()).toContain(content);
    });

    test("should render 'actions' slot content", () => {
      const content = "Test content";
      const wrapper = mountAppDialog(null, {
        actions: content,
      });

      expect(wrapper.text()).toContain(content);
    });
  });
});
