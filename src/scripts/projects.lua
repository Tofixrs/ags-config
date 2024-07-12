local history = require("project_nvim.utils.history");
for _, v in pairs(history.get_recent_projects()) do
	io.stdout:write(v .. "\n");
end
