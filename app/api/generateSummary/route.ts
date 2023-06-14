import openai from '@/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const { todos } = await request.json();

	// Call openAI GPT
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0.8,
		n: 1,
		stream: false,
		messages: [
			{
				role: 'system',
				content:
					'When responding, welcome the user always as Gerard and say welcome to this Trello demo, limit the response to 200 characters, with some fact about Iceland',
			},
			{
				role: 'user',
				content: `Hi, provide a summary of the following todos. Count how many todos are in each category, such as To do, in progress and done, then tell the user to have a productive day! Here is the data: ${JSON.stringify(
					todos
				)}`,
			},
		],
	});

	const { data } = response;

	return NextResponse.json(data.choices[0].message);
}
