import { App } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./src/widget/Bar/Bar";
import { PowerMenu, Verification } from "src/widget/PowerMenu";

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar);
    PowerMenu();
    Verification();
  },
});
