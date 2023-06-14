function formatTodosForAi(board: Board) {
	const todos = Array.from(board.columns.entries());

	const flatArray = todos.reduce((map, [key, value]) => {
		map[key] = value.todos;
		return map;
	}, {} as { [key in TypedColumn]: Todo[] });

	// Reduce to key: value(length)
	const flatArrayCounted = Object.entries(flatArray).reduce(
		(map, [key, value]) => {
			map[key as TypedColumn] = value.length;
			return map;
		},
		{} as { [key in TypedColumn]: number }
	);

	return flatArrayCounted;
}

async function fetchSuggestion(board: Board) {
	const todos = formatTodosForAi(board);

	const response = await fetch('/api/generateSummary', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ todos }),
	});

	const data = await response.json();
	const { content } = data;
	return content;
}

export default fetchSuggestion;
