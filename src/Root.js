import Container from "./Container.js";
import { VerticalLayout } from "./Layout.js";
import Button from "./Button.js";
import Workspace from "./Workspace.js";
export default class Root extends Container {
  constructor(title, ...argv) {
    super(...argv);
    this.title = title;
		this.layout = new VerticalLayout(); // NOTE: a layout applies to children only, this will not set xywh of the root component
	}
  start() {
    super.start();
    const windowCaption = new Button(this.title, {h:15});
    const workspaceTest = new Workspace("./templates/hello-world.json", "test", {h:100, color: 'red'});
    workspaceTest.view = this.view;

    const workspaceTest2 = new Workspace("./templates/hello-world.json", "test", {h:100, color: 'yellow'});
    workspaceTest2.view = this.view;
    this.children.add(windowCaption, workspaceTest, workspaceTest2);
	}
}
