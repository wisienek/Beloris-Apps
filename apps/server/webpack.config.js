module.exports = (config, context) => {
	return {
		...config,
		output: {
			...config.output,
			devtoolModuleFilenameTemplate: ".",
			devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]"
		}
	};
};

