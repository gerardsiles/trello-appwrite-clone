'use client';

import Image from 'next/image';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Avatar from 'react-avatar';
import { useBoardStore } from '@/store/boardStore';
import { useEffect, useState } from 'react';
import fetchSuggestion from '@/lib/fetchSuggestion';

function Header() {
	const [board, searchString, setSearchString] = useBoardStore(state => [
		state.board,
		state.searchString,
		state.setSearchString,
	]);
	const [loading, setLoading] = useState<boolean>(false);
	const [suggestion, setSuggestion] = useState<string>('');

	// useEffect(() => {
	// 	if (board.columns.size === 0) return;
	// 	setLoading(true);
	// 	const fetchGPT = async () => {
	// 		const result = await fetchSuggestion(board);
	// 		setSuggestion(result);
	// 		setLoading(false);
	// 	};
	// 	fetchGPT();
	// }, [board]);

	return (
		<header>
			<div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
				<div
					className='absolute top-0 left-0 w-full h-96
        bg-gradient-to-br from-pink-400 to-[#0055D1] filter blur-3xl opacity-50 -z-50
        '
				></div>
				<Image
					src='https://links.papareact.com/c2cdd5'
					width={300}
					height={100}
					className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
					alt='Trello logo'
				/>
				<div className='flex items-center space-x-5 flex-1 justify-end w-full'>
					{/* Search */}
					<form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
						<MagnifyingGlassIcon className='w-6 h-6 text-gray-400' />
						<input
							type='text'
							placeholder='Search'
							className='outline-none flex-1 p-2'
							value={searchString}
							onChange={e => setSearchString(e.target.value)}
						/>

						<button type='submit' hidden>
							Search
						</button>
					</form>

					<Avatar
						name='Gerard Siles'
						size='50'
						color='#0055D1'
						round={true}
						className='cursor-pointer'
					/>
				</div>
			</div>
			{/* 
			<div className='flex items-center justify-center px-5 py-2 md:py-5'>
				<p className='flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
					<UserCircleIcon
						className={`w-10 h-10 inline-block text-[#0055D1] mr-1 ${
							loading && 'animate-spin'
						}`}
					/>
					{suggestion && !loading
						? suggestion
						: 'GPT is summarizing your tasks'}
				</p>
			</div> */}
		</header>
	);
}
export default Header;
