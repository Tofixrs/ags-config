import GLib20 from "gi://GLib?version=2.0";

export const date = Variable(GLib20.DateTime.new_now_local(), {
	poll: [500, () => GLib20.DateTime.new_now_local()],
});
