export const ICON_MAP = new Map();

mapping([0, 1], 'sun');
mapping([2], 'cloud-sun');
mapping([3], 'cloud');
mapping([45, 48], 'smog');
mapping(
	[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
	'cloud-showers-heavy'
);
mapping([71, 73, 75, 77, 85, 86], 'snowflake');
mapping([95, 96, 99], 'cloud-bolt');

function mapping(values, icon) {
	values.forEach((value) => {
		ICON_MAP.set(value, icon);
	});
}
