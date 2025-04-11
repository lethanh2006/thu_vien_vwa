declare module Z3950 {
	export interface IRecord {
		id: string;
		author: string;
		isbn: string;
		issn: string;
		publisher: string;
		source: string;
		title: string;
		year: string;
	}

	export interface IMayChu {
		database: string;
		description: string;
		host: string;
		name: string;
		port: number;
		syntax: string;
	}
}
