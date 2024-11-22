import { App } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./src/widget/Bar/Bar";
import { PowerMenu, Verification } from "src/widget/PowerMenu";
import NotificationPopups from "src/widget/Notifs/Popups";

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar);
    App.get_monitors().map(NotificationPopups);
    PowerMenu();
    Verification();
  },
});
