'use client';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import Column from './Column';

function Board() {
	const [getBoard, board, setBoardState, updateTodoInDB] = useBoardStore(
		state => [
			state.getBoard,
			state.board,
			state.setBoardState,
			state.updateTodoInDB,
		]
	);

	useEffect(() => {
		getBoard();
	}, [getBoard]);

	const handleOnDragEnd = (result: DropResult) => {
		const { destination, source, type } = result;

		// If there is no destination, do nothing
		if (!destination) return;

		// Handle column change
		if (type === 'column') {
			const entries = Array.from(board.columns.entries());
			// Remove the column from the old position
			const [removed] = entries.splice(source.index, 1);

			// Add the column to the new position
			entries.splice(destination.index, 0, removed);

			// Update the board
			const newColumns = new Map(entries);
			setBoardState({ ...board, columns: newColumns });
		} else {
			// Handle todo change
			// Convert indexes (0,1,2...) to id's
			const columns = Array.from(board.columns);
			const startColIndex = columns[Number(source.droppableId)];
			const finishColIndex = columns[Number(destination.droppableId)];
			const startCol: Column = {
				id: startColIndex[0],
				todos: startColIndex[1].todos,
			};

			const finishCol: Column = {
				id: finishColIndex[0],
				todos: finishColIndex[1].todos,
			};

			if (!startCol || !finishCol) return;

			// Cancel it if the position hasn't changed
			if (source.index === destination.index && startCol.id === finishCol.id)
				return;

			const newTodos = startCol.todos;
			const [todoMoved] = newTodos.splice(source.index, 1);
			// If is the same column
			if (startCol.id === finishCol.id) {
				// Same column but different position
				newTodos.splice(destination.index, 0, todoMoved);
				const newCol = {
					id: startCol.id,
					todos: newTodos,
				};
				const newColumns = new Map(board.columns);
				newColumns.set(newCol.id, newCol);
				setBoardState({ ...board, columns: newColumns });
			} else {
				// Different column
				const finishTodos = Array.from(finishCol.todos);
				finishTodos.splice(destination.index, 0, todoMoved);

				const newColumns = new Map(board.columns);
				const newCol = {
					id: startCol.id,
					todos: newTodos,
				};

				newColumns.set(newCol.id, newCol);
				newColumns.set(finishCol.id, {
					id: finishCol.id,
					todos: finishTodos,
				});

				// update in DB
				updateTodoInDB(todoMoved, finishCol.id);

				// TODO: persist the order of the columns

				setBoardState({ ...board, columns: newColumns });
			}
		}
	};

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='board' direction='horizontal' type='column'>
				{provided => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
					>
						{Array.from(board.columns.entries()).map(([id, column], index) => (
							<Column key={id} id={id} todos={column.todos} index={index} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
export default Board;
