import { defineComponent } from "vue";
import {
  NLoadingBarProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from "naive-ui";

export const AppProvider = defineComponent({
  name: "AppProvider",
  setup(_props, { slots }) {
    function register() {
      window.$loadingBar = useLoadingBar();
      window.$dialog = useDialog();
      window.$message = useMessage();
      window.$notification = useNotification();
    }

    register();

    return () => (
      <NLoadingBarProvider>
        <NDialogProvider>
          <NNotificationProvider>
            <NMessageProvider>{slots["default"]?.()}</NMessageProvider>
          </NNotificationProvider>
        </NDialogProvider>
      </NLoadingBarProvider>
    );
  },
});
