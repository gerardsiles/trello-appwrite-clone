import { create } from 'zustand';
import getTodosGroupedByColumn from '@/lib/getTodosGroupedByColumn';
import { databases } from '@/appwrite';

interface BoardState {
	board: Board;
	getBoard: () => void;
	setBoardState: (board: Board) => void;
	updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

	searchString: string;
	setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>(set => ({
	board: {
		columns: new Map<TypedColumn, Column>(),
	},
	searchString: '',
	setSearchString: (searchString: string) =>
		set({ searchString: searchString }),

	getBoard: async () => {
		const board = await getTodosGroupedByColumn();
		set({ board });
	},
	setBoardState: (board: Board) => set({ board }),
	updateTodoInDB: async (todo: Todo, columnId: TypedColumn) => {
		await databases.updateDocument(
			process.env.NEXT_PUBLIC_DATABASE_ID!,
			process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
			todo.$id,
			{
				title: todo.title,
				status: columnId,
			}
		);
	},
}));
