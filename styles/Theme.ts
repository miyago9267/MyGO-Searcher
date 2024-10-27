export const CustomTheme =  ([, value]: RegExpMatchArray, ) => {
	if (value == "dark") {
		return {
			'background-color': '#515151',
		};
	} else {
		return {
			'background-color': '#d3d3d380',
		};
	}
}